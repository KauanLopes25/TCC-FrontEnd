import React, { useState } from 'react';
import { useSteeper } from '../../hooks/useSteeper';
import { useLavanderia } from '../../hooks/useLavanderia'; 
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
import { LocationFilter } from '../../components/LocationFilter'; 
import { PagamentoPedido } from '../../components/PagamentoPedido';

// Importando as Telas/Componentes
import { DetalhesLavanderia } from '../DetalhesLavanderia'; 
import { MontagemCesto } from '../MontagemCesto';

// IMPORT AJUSTADO: Buscando o CheckoutPedido da pasta components!
import { CheckoutPedido } from '../../components/CheckoutPedido';

export function Lavanderias() {
  const { passoAtual, circuloAtivo, porcentagem, proximoPasso, passoAnterior } = useSteeper();
  
  const [idLavanderiaSelecionada, setIdLavanderiaSelecionada] = useState<number | null>(null);
  const [dadosDoPedido, setDadosDoPedido] = useState<any>(null);
  const [dadosFinaisPedido, setDadosFinaisPedido] = useState<any>(null);
  
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

      {passoAtual === 3 && (
        <MontagemCesto
          onVoltar={passoAnterior} 
          onAvancar={(payloadDoCesto: any) => {
            setDadosDoPedido(payloadDoCesto); 
            proximoPasso(); 
          }}
        />
      )}

      {/* O Componente do Passo 4 perfeitamente plugado */}
      {passoAtual === 4 && (
        <CheckoutPedido 
          lavanderia={lavanderias.find(l => l.lavanderia_id === idLavanderiaSelecionada)}
          dadosDoPedido={dadosDoPedido}
          onVoltar={passoAnterior}
          onConfirmar={(dadosFinais) => {
            setDadosFinaisPedido(dadosFinais);
            proximoPasso(); // Manda para o Passo 5
          }}
        />
      )}
      {passoAtual === 5 && dadosFinaisPedido && (
        <PagamentoPedido 
          resumoFinanceiro={dadosFinaisPedido.resumoFinanceiro}
          onVoltar={passoAnterior}
          onFinalizarPagamento={(metodo, dadosMetodo) => {
            console.log("INICIANDO FLUXO REAL COM BACKEND:");
            console.log("1. Payload do Pedido:", dadosFinaisPedido);
            console.log("2. Método de Pagamento:", metodo, dadosMetodo);
            // Aqui é onde faremos a mágica do Axios.post('/pedido') no futuro!
          }}
        />
      )}

    </div>
  );
}