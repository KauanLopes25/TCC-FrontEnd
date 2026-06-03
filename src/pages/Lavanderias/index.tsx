import { useState, useEffect } from 'react';
import { useSteeper } from '../../hooks/useSteeper';
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
// 1. Importando o serviço que bate no Node.js
import { buscarLavanderias } from '../../services/laundryService'; 

export function Lavanderias() {
  const { passoAtual, circuloAtivo, porcentagem, proximoPasso } = useSteeper();

  // Estados dos Filtros
  const [busca, setBusca] = useState('');
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([1]); 

  // 2. Novos Estados para gerenciar os dados reais da API
  const [lavanderias, setLavanderias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true); 

  // 3. O Motor de Busca: Roda sozinho sempre que um filtro ou texto muda
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      
      try {
        const dadosApi = await buscarLavanderias(busca, filtrosSelecionados);
        
        // ATENÇÃO: Como o seu Node devolve { status_code: 200, algo_com_os_dados: [...] }
        // Precisamos extrair apenas o Array. Substitua "dados" pelo nome exato que o seu
        // controller do Knex usa para devolver a lista.
        // Lendo exatamente a "gaveta" que o back-end enviou
        const listaExtraida = dadosApi.items?.lavanderia || [];
        
        // Proteção essencial: garante que o React só salve no estado se for um Array,
        // evitando o erro fatal "lavanderias.map is not a function".
        setLavanderias(Array.isArray(listaExtraida) ? listaExtraida : []);

      } catch (error: any) {
        console.error('Falha ao buscar:', error.message);
        setLavanderias([]); // Deixa a lista vazia caso o servidor caia
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [busca, filtrosSelecionados]);

  // Handlers de interação
  const lidarComFavorito = (id: number) => {
    setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const lidarComCliqueNoFiltro = (nomeDoFiltro: string) => {
    setFiltrosSelecionados((filtrosAnteriores) => {
      if (filtrosAnteriores.includes(nomeDoFiltro)) {
        return filtrosAnteriores.filter((filtro) => filtro !== nomeDoFiltro);
      } else {
        return [...filtrosAnteriores, nomeDoFiltro];
      }
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <StepHeader circuloAtivo={circuloAtivo} porcentagem={porcentagem} />

      {passoAtual === 1 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          
          <FilterBar 
            valorBusca={busca}
            aoMudarBusca={setBusca}
            filtrosAtivos={filtrosSelecionados} 
            aoClicarFiltro={lidarComCliqueNoFiltro}
          />

          <div className="lista-lavanderias" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
            
            {/* 4. Renderização dinâmica baseada no estado da API */}
            {carregando ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                Buscando lavanderias...
              </p>
            ) : lavanderias.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                Nenhuma lavanderia encontrada com esses filtros.
              </p>
            ) : (
              lavanderias.map(lav => (
                <LaundryCard 
                  key={lav.id || Math.random()} // Previne erro se o ID não vier
                  id={lav.id}
                  
                  // Fallbacks (Valores padrão caso o banco retorne vazio)
                  nome={lav.nome || 'Lavanderia Indisponível'} 
                  bairro={lav.bairro || 'Bairro não informado'}
                  cidade={lav.cidade || 'Cidade não informada'}
                  
                  // A BLINDAGEM MÁGICA DA AVALIAÇÃO:
                  // O Number() força a conversão pra matemática. O || 0 garante que se for null, vira 0.
                  avaliacao={Number(lav.media_avaliacao) || 0}
                  
                  isFavorito={favoritos.includes(lav.id)} 
                  onAlternarFavorito={lidarComFavorito}
                  onSelecionar={(id) => {
                    console.log(`Avançando com a lavanderia ID: ${id}`);
                    proximoPasso();
                  }}
                />
              ))
            )}

          </div>

        </div>
      )}

      {/* PASSO 2 OMITIDO PARA FOCARMOS NA INTEGRAÇÃO */}
      {passoAtual === 2 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2>O seu Cesto</h2>
        </div>
      )}

    </div>
  );
}