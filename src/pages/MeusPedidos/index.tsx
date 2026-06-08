import React, { useState } from 'react';
import { FilterBarPedidos } from '../../components/FilterBarPedidos';
import { ModalDataPedido } from '../../components/ModalDataPedidos';
import { FiEye, FiShoppingBag } from 'react-icons/fi';
import { usePedidos } from '../../hooks/usePedidos'; // 1. Importando o Hook
import './MeusPedidos.css';

export function MeusPedidos() {
  // 2. Chamando o Hook (Usando o ID 1 para testar. Troque depois pelo usuário logado!)
  const idUsuarioLogado = 1; 
  const { pedidos, carregando, erro } = usePedidos(idUsuarioLogado);

  const [busca, setBusca] = useState('');
  const [statusAtivo, setStatusAtivo] = useState<string | null>(null);
  const [mostrarModalData, setMostrarModalData] = useState(false);
  const [filtroDataValor, setFiltroDataValor] = useState<string | null>(null);
  const [filtroDataLabel, setFiltroDataLabel] = useState<string | null>(null);

  // 1. Garantimos que a data vai ser lida corretamente, mesmo se vier em outro formato
  const formatarData = (dataIso: string | undefined) => {
    if (!dataIso) return 'Data indisponível';
    try {
      const dataObj = new Date(dataIso);
      return dataObj.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // 2. Forçamos a conversão para Number para o Switch não falhar
// 2. Função Blindada e Expandida para 5 Status
  const getStatusBadge = (idStatus: string | number | undefined) => {
    if (idStatus === undefined || idStatus === null) {
      return <span className="badge-status">Indisponível</span>;
    }

    const idNumerico = Number(idStatus);
    
    if (isNaN(idNumerico)) {
       return <span className="badge-status">Desconhecido</span>;
    }
    
    // Ajuste os nomes conforme estão cadastrados na sua tabela de status_pedido
    switch (idNumerico) {
      case 1: return <span className="badge-status pendente">Aguardando</span>;
      case 2: return <span className="badge-status coletado">Coletado</span>;
      case 3: return <span className="badge-status andamento">Lavando</span>;
      case 4: return <span className="badge-status entregue">Entregue</span>;
      case 5: return <span className="badge-status cancelado">Cancelado</span>;
      default: return <span className="badge-status">Status {idNumerico}</span>;
    }
  };

  // ... suas funções formatarData e getStatusBadge ...

  // ==========================================
  // O FUNIL DE FILTROS
  // ==========================================
  const pedidosFiltrados = Array.isArray(pedidos) ? pedidos.filter((pedido) => {
    // 1. Filtro de Busca (Número do Pedido)
    if (busca !== '') {
      // Pega o ID (ex: 13) transforma em string ("13") e vê se inclui o que foi digitado
      const idString = String(pedido.pedido_id || pedido.id);
      if (!idString.includes(busca)) {
        return false; // Se não bater, descarta da lista
      }
    }

    // 2. Filtro de Status (Relacionando as strings com os IDs do Banco)
    if (statusAtivo) {
      const idStatus = Number(pedido.fk_status_id);
      
      // Se o botão for "andamento", aceita os status 1, 2 e 3 (Pendente, Coletado, Lavando)
      if (statusAtivo === 'andamento' && ![1, 2, 3].includes(idStatus)) return false;
      
      // Se o botão for "entregue", aceita apenas o status 4
      if (statusAtivo === 'entregue' && idStatus !== 4) return false;
      
      // Se o botão for "cancelado", aceita apenas o status 5
      if (statusAtivo === 'cancelado' && idStatus !== 5) return false;
    }

    // 3. Filtro de Data (7 dias ou 30 dias)
    if (filtroDataValor && pedido.data) {
      const dataDoPedido = new Date(pedido.data);
      const dataDeHoje = new Date();
      
      // Calcula a diferença em dias
      const diferencaTempo = dataDeHoje.getTime() - dataDoPedido.getTime();
      const diferencaDias = Math.floor(diferencaTempo / (1000 * 3600 * 24));

      if (filtroDataValor === '7dias' && diferencaDias > 7) return false;
      if (filtroDataValor === '30dias' && diferencaDias > 30) return false;
    }

    // Se sobreviveu a todos os `ifs` acima, o pedido passa pelo funil!
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
            
            {/* 3. Tratamento visual de Loading e Erro */}
            {carregando && <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando seus pedidos...</p>}
            {erro && <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>{erro}</p>}
            
            {!carregando && !erro && pedidosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhum pedido encontrado com esses filtros.</p>
                )}

            {/* 4. Renderizando os dados reais do banco */}
            {!carregando && !erro && pedidosFiltrados.map((pedido) =>  (
                <div key={pedido.pedido_id || pedido.id} className="pedido-item-row">
                
                <div className="pedido-info-esquerda">
                  <div className="icone-cesto-wrapper">
                    <FiShoppingBag size={24} />
                  </div>
                  
                  <div className="pedido-textos">
                    <div className="linha-topo-textos">
                      <span className="pedido-numero">Pedido #{pedido.pedido_id || pedido.id}</span>
                      
                      {/* A CORREÇÃO ESTÁ AQUI: Trocamos pedido.status por pedido.fk_status_id */}
                      {getStatusBadge(pedido.fk_status_id)}
                      
                    </div>
                    <span className="pedido-detalhes">
                      {formatarData(pedido.data)} • R$ {pedido.valor_total}
                    </span>
                  </div>


                </div>
                
                <div className="pedido-acoes-direita">
                  <button className="btn-visualizar-pedido">
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