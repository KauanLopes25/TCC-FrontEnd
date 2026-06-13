import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBarPedidos } from '../../components/FilterBarPedidos';
import { ModalDataPedido } from '../../components/ModalDataPedidos';
import { FiEye, FiShoppingBag } from 'react-icons/fi';
import { usePedidos } from '../../hooks/usePedidos';
import './MeusPedidos.css';

export function MeusPedidos() {
  const navigate = useNavigate();

  const idUsuarioLogado = 1; 
  const { pedidos, carregando, erro } = usePedidos(idUsuarioLogado);

  const [busca, setBusca] = useState('');
  const [statusAtivo, setStatusAtivo] = useState<string | null>(null);
  const [mostrarModalData, setMostrarModalData] = useState(false);
  const [filtroDataValor, setFiltroDataValor] = useState<string | null>(null);
  const [filtroDataLabel, setFiltroDataLabel] = useState<string | null>(null);

  const formatarData = (dataIso: string | undefined) => {
    if (!dataIso) return 'Data indisponível';
    try {
      const dataObj = new Date(dataIso);
      return dataObj.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (
  statusTexto?: string,
  statusId?: number
) => {

  let status = statusTexto;

  if (!status && statusId) {
    switch (statusId) {
      case 1: status = 'SOLICITADO'; break;
      case 2: status = 'ATRIBUIDO'; break;
      case 3: status = 'COLETANDO'; break;
      case 4: status = 'EM_TRANSITO'; break;
      case 5: status = 'LAVANDO'; break;
      case 6: status = 'SECANDO'; break;
      case 7: status = 'RETORNANDO'; break;
      case 8: status = 'ENTREGUE'; break;
      case 9: status = 'CANCELADO'; break;
    }
  }

  if (!status) {
    return <span className="badge-status">Indisponível</span>;
  }

  switch (status) {
    case 'SOLICITADO': return <span className="badge-status solicitado">Solicitado</span>;
    case 'ATRIBUIDO': return <span className="badge-status atribuido">Atribuído</span>;
    case 'COLETANDO': return <span className="badge-status coletando">Coletando</span>;
    case 'EM_TRANSITO': return <span className="badge-status transito">Em Trânsito</span>;
    case 'LAVANDO': return <span className="badge-status lavando">Lavando</span>;
    case 'SECANDO': return <span className="badge-status secando">Secando</span>;
    case 'RETORNANDO': return <span className="badge-status retornando">Retornando</span>;
    case 'ENTREGUE': return <span className="badge-status entregue">Entregue</span>;
    case 'CANCELADO': return <span className="badge-status cancelado">Cancelado</span>;
    default: return <span className="badge-status">{status}</span>;
  }
};

  const pedidosFiltrados = Array.isArray(pedidos) ? pedidos.filter((pedido) => {
    if (busca !== '') {
      const idString = String(pedido.pedido_id || pedido.id);
      if (!idString.includes(busca)) {
        return false; 
      }
    }

    if (statusAtivo) {
      const statusStr = String(pedido.status_pedido || '').toUpperCase();
      const andamentoStatus = ['SOLICITADO', 'ATRIBUIDO', 'COLETANDO', 'EM_TRANSITO', 'LAVANDO', 'SECANDO', 'RETORNANDO'];
      
      if (statusAtivo === 'andamento' && !andamentoStatus.includes(statusStr)) return false;
      if (statusAtivo === 'entregue' && statusStr !== 'ENTREGUE') return false;
      if (statusAtivo === 'cancelado' && statusStr !== 'CANCELADO') return false;
    }

    if (filtroDataValor && pedido.data) {
      const dataDoPedido = new Date(pedido.data);
      const dataDeHoje = new Date();
      
      const diferencaTempo = dataDeHoje.getTime() - dataDoPedido.getTime();
      const diferencaDias = Math.floor(diferencaTempo / (1000 * 3600 * 24));

      if (filtroDataValor === '7dias' && diferencaDias > 7) return false;
      if (filtroDataValor === '30dias' && diferencaDias > 30) return false;
    }

    return true; 
  }) : [];

  return (
    <div className="pedidos-container">
      <div className="conteudo-principal-pedidos">
        
        <div className="header-pedidos">
          <h2>Meus Pedidos</h2>
          <FilterBarPedidos 
            valorBusca={busca}
            aoMudarBusca={setBusca}
            statusAtivo={statusAtivo}
            aoMudarStatus={(status) => setStatusAtivo(status === statusAtivo ? null : status)}
            aoAbrirModalData={() => setMostrarModalData(true)}
            dataSelecionada={filtroDataLabel}
          />
        </div>

        <div className="card-lista-pedidos">
          <div className="lista-scroll-container">
            
            {carregando && <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando seus pedidos...</p>}
            {erro && <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>{erro}</p>}
            
            {!carregando && !erro && pedidosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhum pedido encontrado com esses filtros.</p>
            )}

            {!carregando && !erro && pedidosFiltrados.map((pedido) =>  (
                <div key={pedido.pedido_id || pedido.id} className="pedido-item-row">
                
                <div className="pedido-info-esquerda">
                  <div className="icone-cesto-wrapper">
                    <FiShoppingBag size={24} />
                  </div>
                  
                  <div className="pedido-textos">
                    <div className="linha-topo-textos">
                      <span className="pedido-numero">Pedido #{pedido.pedido_id || pedido.id}</span>
                      {getStatusBadge(
                        pedido.status_pedido,
                        pedido.fk_status_pedido_id
                      )}
                    </div>
                    <span className="pedido-detalhes">
                      {formatarData(pedido.data)} • R$ {pedido.valor_total}
                    </span>
                  </div>
                </div>
                
                <div className="pedido-acoes-direita">
                  <button 
                    className="btn-visualizar-pedido"
                    onClick={() => navigate(`/acompanhamento/${pedido.pedido_id || pedido.id}`)}
                  >
                    <FiEye size={18} />
                    <span>Visualizar</span>
                  </button>
                </div>

              </div>
            ))}

            {!carregando && pedidos.length > 0 && (
              <div className="carregar-mais-container">
                <button className="btn-carregar-mais">Carregar próximos 20 pedidos</button>
              </div>
            )}

          </div>
        </div>

      </div>

      {mostrarModalData && (
        <ModalDataPedido 
          opcaoAtual={filtroDataValor}
          aoSelecionar={(valor, label) => {
            setFiltroDataValor(valor);
            setFiltroDataLabel(label);
            setMostrarModalData(false);
          }}
          aoFechar={() => setMostrarModalData(false)}
        />
      )}

    </div>
  );
}