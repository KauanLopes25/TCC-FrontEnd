import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 ADICIONADO: Importação do hook de navegação do React Router
import { useSteeper } from '../../hooks/useSteeper';
import { useLavanderia } from '../../hooks/useLavanderia'; 
import { StepHeader } from '../../components/StepHeader';
import { FilterBar } from '../../components/FilterBar';
import { LaundryCard } from '../../components/LaundryCard';
import { LocationFilter } from '../../components/LocationFilter'; 
import { PagamentoPedido } from '../../components/PagamentoPedido';
import { usePedido } from '../../hooks/usePedido'; 
// Importando as Telas/Componentes
import { DetalhesLavanderia } from '../DetalhesLavanderia'; 
import { MontagemCesto } from '../MontagemCesto';

// IMPORT AJUSTADO: Buscando o CheckoutPedido da pasta components!
import { CheckoutPedido } from '../../components/CheckoutPedido';

export function Lavanderias() {
  const navigate = useNavigate(); // 🚀 ADICIONADO: Inicialização do navegador de rotas
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
      
      {/* ==========================================
          PASSO 5: TELA DE PAGAMENTO FINAL
          ========================================== */}
      {passoAtual === 5 && dadosFinaisPedido && (
        <PagamentoPedido 
          resumoFinanceiro={dadosFinaisPedido.resumoFinanceiro}
          onVoltar={passoAnterior}
          processando={processandoPagamento} // Passa o estado de loading do hook
          dadosPix={dadosPagamentoAbacate}   // Passa os dados reais da AbacatePay (QR Code / Copia e Cola)
          
          onFinalizarPagamento={async (metodo, dadosMetodo) => {
            
            // Montamos o JSON exato que o seu Node.js (criarPedidoCompleto) espera receber
            const payloadFinalAPI = {
              usuario_id: 1, // Chumbado temporariamente para o MVP até ter o Context de Login
              lavanderia_id: dadosFinaisPedido.idLavanderia,
              
              // Valores financeiros que vieram calculados do Passo 4
              valor_ciclos: dadosFinaisPedido.resumoFinanceiro.valor_ciclos,
              taxa_entrega: dadosFinaisPedido.resumoFinanceiro.taxa_entrega,
              
              // Informações do método de pagamento escolhido na UI
              tipo_pagamento: metodo.toUpperCase(), // Vai como 'PIX' ou 'CARTAO'
              cartao_id: metodo === 'cartao' ? dadosMetodo.cartaoId : null,
              tipo_cartao: 'CREDITO', // Padrão para a simulação
              
              // O array de cestos contendo os ciclos selecionados e as roupas de cada um
              cestos: dadosFinaisPedido.cestos 
            };

            console.log("🚀 Enviando pacote final de Checkout para a API:", payloadFinalAPI);

            // Dispara a função do hook que faz o fetch e se comunica com a AbacatePay
            const resultado = await criarPedido(payloadFinalAPI);

            if (resultado.sucesso) {
              if (metodo === 'cartao') {
                setTimeout(() => {
                  navigate('/acompanhamento');
                }, 2000);
              } else {
                console.log("Pix gerado com sucesso pelo back-end!");
              }
            } else {
              alert("Erro ao processar o seu pedido. Verifique o console do back-end.");
            }
          }}
        />
      )}

    </div>
  );
}