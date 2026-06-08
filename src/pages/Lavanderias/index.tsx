import React, { useState } from 'react'; // 1. Importar useState
import { useSteeper } from '../../hooks/useSteeper';
import { useLavanderia } from '../../hooks/useLavanderia'; 
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
import { LocationFilter } from '../../components/LocationFilter'; 

// 2. Importar a nova tela de Detalhes
import { DetalhesLavanderia } from '../DetalhesLavanderia'; 

export function Lavanderias() {
  // 3. Adicionar a função de voltar do seu hook (ajuste o nome se for diferente)
  const { passoAtual, circuloAtivo, porcentagem, proximoPasso, passoAnterior } = useSteeper();
  
  // 4. Estado para guardar a lavanderia que o usuário clicou
  const [idLavanderiaSelecionada, setIdLavanderiaSelecionada] = useState<number | null>(null);
  
  const {
    busca, setBusca,
    filtrosSelecionados, lidarComCliqueNoFiltro,
    bairroFiltro, mostrarModalDistancia, selecionarLocalizacao, cancelarLocalizacao,
    lavanderias, carregando,
    favoritos, lidarComFavorito
  } = useLavanderia();

  const lavanderiasParaExibir = filtrosSelecionados.includes('favoritos')
    ? lavanderias.filter(lav => favoritos.includes(lav.lavanderia_id))
    : lavanderias;

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

          {mostrarModalDistancia && filtrosSelecionados.includes('distancia') && (
            <LocationFilter 
              bairroAtual={bairroFiltro}
              aoSelecionar={selecionarLocalizacao}
              aoCancelar={cancelarLocalizacao}
            />
          )}

          <div className="lista-lavanderias" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
            
            {carregando ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Buscando lavanderias...</p>
            ) : lavanderiasParaExibir.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Nenhuma lavanderia encontrada.</p>
            ) : (
              lavanderiasParaExibir.map(lav => {
                const idReal = lav.lavanderia_id;

                return (
                  <LaundryCard 
                    key={idReal}
                    id={idReal}
                    nome={lav.nome || 'Lavanderia Indisponível'} 
                    bairro={lav.bairro || 'Bairro não informado'}
                    cidade={lav.cidade || 'Cidade não informada'}
                    avaliacao={Number(lav.media_avaliacao) || 0}
                    isFavorito={favoritos.includes(idReal)} 
                    onAlternarFavorito={lidarComFavorito}
                    
                    // 5. Salva o ID no estado antes de pular para o passo 2
                    onSelecionar={(idSelecionado) => {
                      setIdLavanderiaSelecionada(idSelecionado);
                      proximoPasso();
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {passoAtual === 2 && (
        <DetalhesLavanderia 
          idLavanderia={idLavanderiaSelecionada}
          onVoltar={passoAnterior} 
          onAvancar={proximoPasso} 
        />
      )}

      
      {passoAtual === 3 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2>O seu Cesto de Roupas</h2>
        </div>
      )}

    </div>
  );
}