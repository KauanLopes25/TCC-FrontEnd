import React, { useState } from 'react'; // Importar useState
import { useSteeper } from '../../hooks/useSteeper';
import { useLavanderia } from '../../hooks/useLavanderia'; 
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
import { LocationFilter } from '../../components/LocationFilter'; 
import { MontagemCesto } from '../MontagemCesto';
import { DetalhesLavanderia } from '../DetalhesLavanderia'; 

export function Lavanderias() {
  const { passoAtual, circuloAtivo, porcentagem, proximoPasso, passoAnterior } = useSteeper();
  
  const [idLavanderiaSelecionada, setIdLavanderiaSelecionada] = useState<number | null>(null);
  
  // AQUI: Estado para guardar os cestos e roupas confirmados no Passo 3
  const [dadosDoPedido, setDadosDoPedido] = useState<any>(null);
  
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

      {/* AJUSTE AQUI: Capturando os dados enviados pela tela de Cesto */}
      {passoAtual === 3 && (
        <MontagemCesto
          onVoltar={passoAnterior} 
          onAvancar={(payloadDoCesto: any) => {
            setDadosDoPedido(payloadDoCesto); // Salva o array de cestos/roupas na memória
            proximoPasso(); // Segue para a próxima etapa (Passo 4 - Pagamento)
          }}
        />
      )}

      {/* PASSO 4 PREPARADO: Onde o JSON vai se transformar em POST no backend */}
      {passoAtual === 4 && (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Resumo do Pedido e Pagamento</h2>
          <p style={{ textAlign: 'left', color: '#666' }}>Dados coletados com sucesso. Prontos para envio:</p>
          <pre style={{ textAlign: 'left', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            {JSON.stringify({ idLavanderiaSelecionada, dadosDoPedido }, null, 2)}
          </pre>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={passoAnterior} className="btn-navegacao-voltar">Voltar</button>
            <button className="btn-navegacao-avancar">Finalizar e Pagar</button>
          </div>
        </div>
      )}

    </div>
  );
}