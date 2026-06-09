import { useState, useCallback } from 'react';
import { buscarCatalogoRoupas } from '../services/roupaService';

// Uma "Chave do Cesto" agora é ID da Peça + Cor para permitir duplicatas
export type ItemKey = string; // Formato: "id-cor" (ex: "1-branca")

export interface CestoData {
  id: number;
  itens: Record<ItemKey, number>; // Mapeia a chave exclusiva -> quantidade
  limiteMaximo: number; 
}

// Cores que a lavanderia aceita para separação (Regra de Negócio)
const VARIACAO_CORES = [
  { nome: 'Branca', hex: '#FFFFFF' },
  { nome: 'Escura/Preta', hex: '#2D3748' },
  { nome: 'Colorida', hex: '#E53E3E' } // Ex: Um vermelho vivo
];

export function useCesto() {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas'); // Antes era filtroCor
  const [cestos, setCestos] = useState<CestoData[]>([{ id: 1, itens: {}, limiteMaximo: 30 }]);
  const [idCestoAtivo, setIdCestoAtivo] = useState<number>(1);
  const [catalogoVariavel, setCatalogoVariavel] = useState<any[]>([]); // O catálogo "cozinhado" com cores
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(true);

  // BUSCA E GERAÇÃO DE VARIAÇÕES (GET)
 // FUNÇÃO NOVA: O "Avaliador" de Categorias
  const determinarCategoria = (nomePeca: string) => {
    const nome = nomePeca.toLowerCase();
    
    if (nome.includes('camisa') || nome.includes('blusa') || nome.includes('jaqueta') || nome.includes('casaco') || nome.includes('moletom') || nome.includes('polo')) {
      return 'Superior';
    }
    if (nome.includes('calça') || nome.includes('calca') || nome.includes('bermuda') || nome.includes('short') || nome.includes('saia')) {
      return 'Inferior';
    }
    if (nome.includes('meia') || nome.includes('touca') || nome.includes('luva') || nome.includes('cinto')) {
      return 'Acessórios';
    }
    
    return 'Outros'; // Cobertor, toalha, edredom, tapete, etc.
  };

  // BUSCA E GERAÇÃO DE VARIAÇÕES (GET)
  const carregarRoupas = useCallback(async () => {
    setCarregandoCatalogo(true);
    try {
      const resultadoAPI = await buscarCatalogoRoupas();
      const listaRoupasBase = resultadoAPI?.items?.roupas || [];

      // A MÁGICA ARQUITETURAL: Pega cada roupa e agora adiciona a categoria!
      const catalogoComCores = listaRoupasBase.flatMap((roupaBase: { id: number; nome_peca: string }) => {
        
        // Carimbamos a categoria aqui antes de gerar as cores
        const categoriaDaPeca = determinarCategoria(roupaBase.nome_peca);

        return VARIACAO_CORES.map(cor => ({
          id: `${roupaBase.id}-${cor.nome.toLowerCase()}`, 
          fk_roupas_id: roupaBase.id, 
          nome: roupaBase.nome_peca,
          cor: cor.nome, 
          corHex: cor.hex,
          categoria: categoriaDaPeca // <--- NOVA PROPRIEDADE INJETADA!
        }));
      });

      setCatalogoVariavel(catalogoComCores);
    } catch (erro) {
      console.error("Falha ao carregar catálogo de roupas:", erro);
    } finally {
      setCarregandoCatalogo(false);
    }
  }, []);

  // CONTROLES DO CESTO (REGRAS DE NEGÓCIO)
  const calcularTotalPecas = (cesto: CestoData) => {
    return Object.values(cesto.itens).reduce((acc, qtd) => acc + qtd, 0);
  };

  const alterarQuantidadeRoupa = (itemKey: ItemKey, operacao: 'somar' | 'subtrair') => {
    setCestos((prevCestos) =>
      prevCestos.map((cesto) => {
        if (cesto.id !== idCestoAtivo) return cesto;

        const quantidadeAtual = cesto.itens[itemKey] || 0;
        const totalPecasNoCesto = calcularTotalPecas(cesto);

        if (operacao === 'somar') {
          if (totalPecasNoCesto >= cesto.limiteMaximo) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [itemKey]: quantidadeAtual + 1 }
          };
        } else {
          if (quantidadeAtual <= 0) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [itemKey]: quantidadeAtual - 1 }
          };
        }
      })
    );
  };

  const adicionarCesto = () => {
    const novoId = cestos.length + 1;
    setCestos([...cestos, { id: novoId, itens: {}, limiteMaximo: 30 }]);
    setIdCestoAtivo(novoId);
  };

  const removerCesto = (id: number) => {
    if (cestos.length <= 1) return;
    const novosCestos = cestos.filter((c) => c.id !== id);
    setCestos(novosCestos);
    if (idCestoAtivo === id) {
      setIdCestoAtivo(novosCestos[0].id);
    }
  };

  const selecionarCesto = (id: number) => {
    setIdCestoAtivo(id);
  };

  // EMPACOTAMENTO FINAL PARA O PEDIDO (POST) - Prontinho para o backend refatorado!
  const gerarPayloadDoPedido = () => {
    return cestos.map(cesto => {
      // Pega as roupas que têm quantidade > 0
      const itensComQuantidade = Object.keys(cesto.itens)
        .filter(key => cesto.itens[key] > 0)
        .map(key => {
          // A chave é "idReal-corNome". Separamos para obter os dados.
          const [idReal, corNome] = key.split('-');
          
          return {
            fk_roupas_id: Number(idReal), // ID real do banco (tabela roupas)
            quantidade: cesto.itens[key],
            cor: corNome.charAt(0).toUpperCase() + corNome.slice(1) // A cor exata para a tabela cesto_roupa!
          };
        });

      return {
        peso_estimado: 0, 
        tipo_lavagem: 'NORMAL', 
        roupas: itensComQuantidade
        // Aqui no futuro entra o perfil_lavagem: 'BRANCAS' etc
      };
    }).filter(cesto => cesto.roupas.length > 0); 
  };

  // Variáveis úteis para o render
  const cestoAtivo = cestos.find((c) => c.id === idCestoAtivo)!;
  const totalPecasAtivas = calcularTotalPecas(cestoAtivo);

  return {
    cestos, idCestoAtivo, cestoAtivo, totalPecasAtivas, buscaTexto, filtroCategoria, setBuscaTexto, setFiltroCategoria,
    removerCesto, adicionarCesto, selecionarCesto, alterarQuantidadeRoupa, calcularTotalPecas,
    // Retornos do Catálogo Variavel
    catalogoCompleto: catalogoVariavel, // Mantemos o nome para não quebrar a tela
    carregandoCatalogo, carregarRoupas,
    gerarPayloadDoPedido // Função final que já trata o ID real e a Cor
  };
}