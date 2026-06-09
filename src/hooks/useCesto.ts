import { useState, useCallback } from 'react';
import { buscarCatalogoRoupas } from '../services/roupaService'; // Lembre-se de ajustar o caminho

export interface CestoData {
  id: number;
  itens: Record<number, number>; // Mapeia id_roupa -> quantidade inserida
  limiteMaximo: number; // Ex: 30 peças
}

export function useCesto() {
  // ==========================================
  // ESTADOS PRINCIPAIS DO CESTO
  // ==========================================
  const [cestos, setCestos] = useState<CestoData[]>([
    { id: 1, itens: {}, limiteMaximo: 30 }
  ]);
  const [idCestoAtivo, setIdCestoAtivo] = useState<number>(1);

  // ==========================================
  // ESTADOS DO CATÁLOGO DE ROUPAS (API)
  // ==========================================
  const [catalogoCompleto, setCatalogoCompleto] = useState<any[]>([]);
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(true);

  // ==========================================
  // BUSCA E FORMATAÇÃO DE DADOS (GET)
  // ==========================================
  const carregarRoupas = useCallback(async () => {
    setCarregandoCatalogo(true);
    try {
      const resultadoAPI = await buscarCatalogoRoupas();

      // Acessa o array dentro do objeto padronizado da API (ajuste "items" se necessário)
      const listaRoupas = resultadoAPI.items || [];

      const roupasFormatadas = listaRoupas.map((r: any) => ({
        id: r.id,
        nome: r.nome_peca,
        cor: 'Não especificada', // Pronto para a nossa nova coluna no banco!
        tipo: r.tipo || 'outro'
      }));

      setCatalogoCompleto(roupasFormatadas);
    } catch (erro) {
      console.error("Falha ao carregar catálogo de roupas:", erro);
    } finally {
      setCarregandoCatalogo(false);
    }
  }, []);

  // ==========================================
  // CONTROLES DO CESTO (REGRAS DE NEGÓCIO)
  // ==========================================
  const adicionarCesto = () => {
    const novoId = cestos.length + 1;
    setCestos([...cestos, { id: novoId, itens: {}, limiteMaximo: 30 }]);
    setIdCestoAtivo(novoId); // Já foca automaticamente no cesto novo
  };

  const removerCesto = (id: number) => {
    // Salvaguarda: não permite remover se for o único cesto
    if (cestos.length <= 1) return;

    // Filtra a lista removendo o cesto selecionado
    const novosCestos = cestos.filter((c) => c.id !== id);
    setCestos(novosCestos);

    // Se o cesto que foi apagado era o que estava ativo, muda o foco para o primeiro da lista
    if (idCestoAtivo === id) {
      setIdCestoAtivo(novosCestos[0].id);
    }
  };

  const selecionarCesto = (id: number) => {
    setIdCestoAtivo(id);
  };

  // Calcula dinamicamente quantas peças existem dentro de um cesto específico
  const calcularTotalPecas = (cesto: CestoData) => {
    return Object.values(cesto.itens).reduce((acc, qtd) => acc + qtd, 0);
  };

  const alterarQuantidadeRoupa = (roupaId: number, operacao: 'somar' | 'subtrair') => {
    setCestos((prevCestos) =>
      prevCestos.map((cesto) => {
        if (cesto.id !== idCestoAtivo) return cesto;

        const quantidadeAtual = cesto.itens[roupaId] || 0;
        const totalPecasNoCesto = calcularTotalPecas(cesto);

        if (operacao === 'somar') {
          // Trava de segurança se atingir o limite do cesto (ex: 30 peças)
          if (totalPecasNoCesto >= cesto.limiteMaximo) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [roupaId]: quantidadeAtual + 1 }
          };
        } else {
          if (quantidadeAtual <= 0) return cesto;
          return {
            ...cesto,
            itens: { ...cesto.itens, [roupaId]: quantidadeAtual - 1 }
          };
        }
      })
    );
  };

  // ==========================================
  // EMPACOTAMENTO FINAL PARA O PEDIDO (POST)
  // ==========================================
  const gerarPayloadDoPedido = () => {
    return cestos
      .map(cesto => {
        // Pega apenas as roupas que o usuário selecionou (qtd > 0)
        const itensComQuantidade = Object.keys(cesto.itens)
          .map(Number)
          .filter(id => cesto.itens[id] > 0)
          .map(id => {
            const infoRoupa = catalogoCompleto.find(c => c.id === id);
            return {
              fk_roupas_id: id,
              quantidade: cesto.itens[id],
              cor: infoRoupa?.cor || 'Não especificada'
            };
          });

        // Monta o objeto no formato exato que a API de pedidos vai pedir
        return {
          peso_estimado: 0, 
          tipo_lavagem: 'NORMAL', 
          roupas: itensComQuantidade
        };
      })
      // Limpa do pacote os cestos que o usuário criou mas deixou vazios
      .filter(cesto => cesto.roupas.length > 0); 
  };

  // Variáveis úteis para o render da tela
  const cestoAtivo = cestos.find((c) => c.id === idCestoAtivo)!;
  const totalPecasAtivas = calcularTotalPecas(cestoAtivo);

  // Retorna absolutamente tudo para o componente
  return {
    cestos,
    idCestoAtivo,
    cestoAtivo,
    totalPecasAtivas,
    removerCesto,
    adicionarCesto,
    selecionarCesto,
    alterarQuantidadeRoupa,
    calcularTotalPecas,
    
    // Retornos da Integração
    catalogoCompleto,
    carregandoCatalogo,
    carregarRoupas,
    gerarPayloadDoPedido
  };
}