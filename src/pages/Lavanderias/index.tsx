import { useSteeper } from '../../hooks/useSteeper';
import { StepHeader } from '../../components/StepHeader';
import { Background } from '../../components/Background';
// Repare que não precisamos mais importar a Sidebar aqui!
import { useState } from 'react';
import { FilterBar } from '../../components/FilterBar';
export function Lavanderias() {
  // Chamamos o nosso Hook mágico
  const { 
    passoAtual, 
    circuloAtivo, 
    porcentagem, 
    proximoPasso, 
    passoAnterior 
  } = useSteeper();

  const [busca, setBusca] = useState('');
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);

  const lidarComCliqueNoFiltro = (nomeDoFiltro: string) => {
    setFiltrosSelecionados((filtrosAnteriores) => {
      // Se o filtro clicado JÁ ESTIVER na lista, nós removemos ele (desligar)
      if (filtrosAnteriores.includes(nomeDoFiltro)) {
        return filtrosAnteriores.filter((filtro) => filtro !== nomeDoFiltro);
      } 
      // Se NÃO ESTIVER na lista, nós adicionamos ele junto com os outros (ligar)
      else {
        return [...filtrosAnteriores, nomeDoFiltro];
      }
    });

    // Se quiser abrir o modal de distância:
    if (nomeDoFiltro === 'distancia' && !filtrosSelecionados.includes('distancia')) {
      // abrirModalDeDistancia();
    }
  };
  return (
  <Background>
    <div style={{ width: '100%', height: '100%' }}>
      
      {/* 1. O CABEÇALHO PROGRESSIVO */}
      <StepHeader circuloAtivo={circuloAtivo} porcentagem={porcentagem} />

      {/* 2. ÁREA DE CONTEÚDO DINÂMICO (Background interno) */}
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Renderização condicional baseada no "passoAtual" (de 1 a 6) */}
        {passoAtual === 1 && (
          <div>
            <h2>Selecione uma Lavanderia</h2>
            <p>Lista de lavanderias próximas aparecerá aqui...</p>
          </div>
        )}

        {passoAtual === 2 && (
          <div>
            <h2>Detalhes da Lavanderia e Início do Cesto</h2>
            <p>Carregando máquinas e produtos...</p>
          </div>
        )}

        {passoAtual === 3 && (
          <div>
            <h2>Seu Cesto de Roupas</h2>
            <p>Revise seus itens...</p>
          </div>
        )}
        
        {/* BOTÕES DE TESTE PARA VER A BARRA ANDAR */}
        <div style={{ marginTop: '50px', display: 'flex', gap: '15px' }}>
          <button 
            onClick={passoAnterior} 
            disabled={passoAtual === 1}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Voltar Etapa
          </button>
          
          <button 
            onClick={proximoPasso} 
            disabled={passoAtual === 6}
            style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#3ba1f2', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Avançar Etapa
          </button>
        </div>

      </div>
    </div>

    <div style={{ padding: '20px' }}>
      
      {/* O seu componente novo, limpo e encapsulado */}
      <div style={{ padding: '20px' }}>
      
      <FilterBar 
        valorBusca={busca}
        aoMudarBusca={setBusca}
        // MUDANÇA 2: Passamos o Array inteiro para o componente
        filtrosAtivos={filtrosSelecionados} 
        aoClicarFiltro={lidarComCliqueNoFiltro}
      />

      <div style={{ marginTop: '30px' }}>
         <p>Buscando por: {busca}</p>
         {/* O .join(', ') serve só para mostrar os itens separados por vírgula na tela para você testar */}
         <p>Filtros ativados: {filtrosSelecionados.join(', ')}</p> 
      </div>

    </div>

    </div>
  </Background>
  );
}