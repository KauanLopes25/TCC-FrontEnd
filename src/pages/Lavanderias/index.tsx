import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSteeper } from '../../hooks/useSteeper';
import { useLavanderia } from '../../hooks/useLavanderia'; 
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
import { LocationFilter } from '../../components/LocationFilter'; 
import { PagamentoPedido } from '../../components/PagamentoPedido';
import { usePedido } from '../../hooks/usePedido'; 
import { DetalhesLavanderia } from '../DetalhesLavanderia'; 
import { MontagemCesto } from '../MontagemCesto';
import { CheckoutPedido } from '../../components/CheckoutPedido';

export function Lavanderias() {
  const navigate = useNavigate(); 
  const { passoAtual, circuloAtivo, porcentagem, proximoPasso, passoAnterior } = useSteeper();
  const { criarPedido, processandoPagamento, dadosPagamentoAbacate } = usePedido();
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

      {passoAtual === 4 && (
        <CheckoutPedido 
          lavanderia={lavanderias.find(l => l.lavanderia_id === idLavanderiaSelecionada)}
          dadosDoPedido={dadosDoPedido}
          onVoltar={passoAnterior}
          onConfirmar={(dadosFinais) => {
            setDadosFinaisPedido(dadosFinais);
            proximoPasso(); 
          }}
        />
      )}
      
      {passoAtual === 5 && dadosFinaisPedido && (
        <PagamentoPedido 
          resumoFinanceiro={dadosFinaisPedido.resumoFinanceiro}
          onVoltar={passoAnterior}
          processando={processandoPagamento} 
          dadosPix={dadosPagamentoAbacate}   
          
          onFinalizarPagamento={async (metodo, dadosMetodo) => {
            
            const payloadFinalAPI = {
              usuario_id: 1, 
              lavanderia_id: dadosFinaisPedido.idLavanderia,
              valor_ciclos: dadosFinaisPedido.resumoFinanceiro.valor_ciclos,
              taxa_entrega: dadosFinaisPedido.resumoFinanceiro.taxa_entrega,
              tipo_pagamento: metodo.toUpperCase(), 
              cartao_id: metodo === 'cartao' ? dadosMetodo.cartaoId : null,
              tipo_cartao: 'CREDITO', 
              cestos: dadosFinaisPedido.cestos 
            };

            const respostaHook = await criarPedido(payloadFinalAPI);

            if (respostaHook.sucesso) {
              // 🚀 Agora sim estamos acessando a camada correta!
              const idGerado = respostaHook.dados.items.pedido_id;

              if (metodo === 'cartao') {
                setTimeout(() => {
                  navigate(`/acompanhamento/${idGerado}`);
                }, 2000);
              } 
              // Se for PIX, o próprio hook já cuidou de salvar o ID e atualizar a tela, 
              // não precisamos dar navigate aqui porque o cliente ainda vai ler o QR Code.
            } else {
              alert("Erro ao processar: " + respostaHook.erro);
            }
          }}
        />
      )}

    </div>
  );
}