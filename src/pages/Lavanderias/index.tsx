import { useState } from 'react';
import { useSteeper } from '../../hooks/useSteeper'; // Corrigido de useSteeper para useStepper
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';

const lavanderiasMock = [
  { id: 1, nome: 'SempreLimpa Centro', bairro: 'Centro', cidade: 'Jandira', avaliacao: 4.8, lat: -23.5280, lng: -46.9050 },
  { id: 2, nome: 'Expresso Jardim', bairro: 'Jardim Alvorada', cidade: 'Jandira', avaliacao: 4.5, lat: -23.5312, lng: -46.9030 },
  { id: 3, nome: 'Lava Rápido Fátima', bairro: 'Vila Fátima', cidade: 'Jandira', avaliacao: 4.9, lat: -23.5240, lng: -46.9100 }
];

export function Lavanderias() {
  // 1. O motor do Cabeçalho
  const { 
    passoAtual, 
    circuloAtivo, 
    porcentagem, 
    proximoPasso 
  } = useSteeper();

  // 2. Os Estados de Filtro e Favoritos
  const [busca, setBusca] = useState('');
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([1]); // ID 1 já vem favoritado

  const lidarComFavorito = (id: number) => {
    setFavoritos(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
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
      
      {/* =========================================
          O CABEÇALHO PROGRESSIVO (Sempre visível)
          ========================================= */}
      <StepHeader circuloAtivo={circuloAtivo} porcentagem={porcentagem} />


      {/* =========================================
          PASSO 01: SELEÇÃO DE LAVANDERIA
          ========================================= */}
      {passoAtual === 1 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          
          <FilterBar 
            valorBusca={busca}
            aoMudarBusca={setBusca}
            filtrosAtivos={filtrosSelecionados} 
            aoClicarFiltro={lidarComCliqueNoFiltro}
          />

          <div className="lista-lavanderias" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
            {lavanderiasMock.map(lav => (
              <LaundryCard 
                key={lav.id}
                id={lav.id}
                nome={lav.nome}
                bairro={lav.bairro}
                cidade={lav.cidade}
                avaliacao={lav.avaliacao}
                isFavorito={favoritos.includes(lav.id)} 
                onAlternarFavorito={lidarComFavorito}
                onSelecionar={(id) => {
                  // A mágica acontece aqui: ao selecionar, você guarda os dados da lavanderia 
                  // e avança o passo, fazendo a tela de seleção sumir e o Cesto aparecer.
                  console.log(`Lavanderia ${id} selecionada!`);
                  proximoPasso();
                }}
              />
            ))}
          </div>

        </div>
      )}


      {/* =========================================
          PASSO 02: O CESTO
          ========================================= */}
      {passoAtual === 2 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#333' }}>O seu Cesto</h2>
          <p style={{ color: '#666' }}>A interface de adicionar roupas será montada aqui...</p>
        </div>
      )}

    </div>
  );
}