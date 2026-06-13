import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiPlus, FiChevronRight, 
  FiShoppingBag, FiClock 
} from 'react-icons/fi';
import { useHome } from '../../hooks/useHome'; // Importando o Hook Real!

export function Home() {
  const navigate = useNavigate();
  const idUsuarioSalvo = 2;
  // Chamada do Hook passando o ID do usuário logado (1 para o MVP)
  const { dadosHome, carregando, erro } = useHome(1);

  // Tratamentos de Loading
  if (carregando) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>Carregando seu painel...</div>;
  
  // ==========================================
  // 🚀 TELA DE BOAS-VINDAS (EMPTY STATE)
  // Se o usuário não tiver pedidos ou a API der 404, mostramos essa tela linda
  // ==========================================
  if (erro) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ marginTop: '60px', padding: '50px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #cbd5e1', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🧺</div>
          <h2 style={{ color: '#1e293b', fontSize: '1.8rem', margin: '0 0 12px 0' }}>Bem-vindo ao SempreLimpa!</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0 0 32px 0' }}>
            Parece que você ainda não tem nenhum pedido no seu histórico. Que tal experimentar os nossos serviços agora mesmo?
          </p>
          <button 
            onClick={() => navigate('/lavanderias')}
            style={{ padding: '16px 32px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,86,179,0.2)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Fazer meu primeiro pedido
          </button>
        </div>
      </div>
    );
  }

  if (!dadosHome) return null;

  // Desestruturando os dados que vieram do banco através do Hook
  const { usuario, metricas, pedidoAtual, ultimosPedidos } = dadosHome;

  // Funções Utilitárias e Navegações
  const formatarNumero = (id: number) => String(id).padStart(4, '0');
  const lidarComNovoPedido = () => navigate('/lavanderias');
  
  // Direciona para o ID específico do pedido atual
  const lidarComDetalhes = () => {
    if (pedidoAtual?.pedido_id) {
      navigate(`/acompanhamento/${pedidoAtual.pedido_id}`);
    }
  };

  const obterCoresBadge = (status: string) => {
    switch (status) {
      case 'ENTREGUE': 
        return { bg: '#dcfce7', border: '#bbf7d0', text: '#166534' }; // Verde
      case 'CANCELADO': 
        return { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' }; // Vermelho
      case 'SOLICITADO':
      case 'ATRIBUIDO':
      case 'COLETANDO': 
        return { bg: '#fef3c7', border: '#fde68a', text: '#92400e' }; // Amarelo/Laranja
      default: 
        return { bg: '#dbeafe', border: '#bfdbfe', text: '#1e40af' }; // Azul (Lavando, Secando, Trânsito, Retornando)
    }
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* 1. CABEÇALHO LIMPO */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1e293b', margin: '0 0 8px 0', fontSize: '1.8rem' }}>
          Olá, Guilherme! 👋
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>
          Bem-vindo ao seu painel do SempreLimpa.
        </p>
      </div>

      {/* 2. DASHBOARD DE MÉTRICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div style={styles.cardMetrica}>
          <div style={{...styles.iconeFundo, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <FiShoppingBag size={28} />
          </div>
          <div>
            <p style={styles.labelMetrica}>Histórico de Uso</p>
            <h3 style={styles.valorMetrica}>{metricas.totalPedidos} <span style={styles.subValor}>pedidos</span></h3>
          </div>
        </div>

        <div style={styles.cardMetrica}>
          <div style={{...styles.iconeFundo, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6'}}>
            <FiPackage size={28} />
          </div>
          <div>
            <p style={styles.labelMetrica}>Volume Processado</p>
            <h3 style={styles.valorMetrica}>{metricas.totalCestos} <span style={styles.subValor}>cestos lavados</span></h3>
          </div>
        </div>
      </div>

      {/* 3. PEDIDO EM ANDAMENTO */}
      {pedidoAtual && (
        <div style={{ marginBottom: '24px' }}> 
          <h2 style={styles.tituloSecao}>Pedido em Andamento</h2>
          
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Pedido #{formatarNumero(pedidoAtual.pedido_id)}
                </span>
                <h3 style={{ margin: '8px 0 0 0', color: '#1e293b', fontSize: '1.4rem' }}>{pedidoAtual.status_pedido}</h3>
              </div>
              <button onClick={lidarComDetalhes} style={{ backgroundColor: 'transparent', border: 'none', color: '#0056b3', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                Acompanhar ao vivo &rarr;
              </button>
            </div>

            {/* Barra de Progresso */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Progresso logístico</span>
              <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{pedidoAtual.progresso}%</span>
            </div>
            
            <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${pedidoAtual.progresso}%`, height: '100%', backgroundColor: '#0056b3', borderRadius: '5px', transition: 'width 1s ease-in-out' }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                {pedidoAtual.mensagem}
              </p>
              <p style={{ color: '#0056b3', fontSize: '0.95rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiClock size={16} /> Estimativa: ~{pedidoAtual.tempo_estimado_minutos} min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOVO BOTÃO GIGANTE DE AÇÃO (CTA) */}
      <div style={{ marginBottom: '40px' }}>
        <button 
          onClick={lidarComNovoPedido}
          style={styles.botaoGigante}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,86,179,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,86,179,0.2)';
          }}
        >
          <FiPlus size={28} /> Solicitar Nova Lavagem
        </button>
      </div>

      {/* 5. ÚLTIMOS PEDIDOS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={styles.tituloSecao}>Últimos Pedidos</h2>
          <button onClick={() => navigate('/pedidos')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>Ver histórico completo</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {ultimosPedidos.length > 0 ? (
            ultimosPedidos.map((pedido: any) => (
              <div key={pedido.pedido_id} style={styles.cardPedidoAntigo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', backgroundColor: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0056b3' }}>
                    <FiPackage size={20} />
                  </div>
                  <FiChevronRight size={20} color="#cbd5e1" style={{ cursor: 'pointer' }} onClick={() => navigate(`/acompanhamento/${pedido.pedido_id}`)} />
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>Pedido #{formatarNumero(pedido.pedido_id)}</h4>
                  <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.9rem' }}>{formatarData(pedido.data)} • {pedido.quantidade_cestos} cestos</p>
                  
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    border: '1px solid',
                    backgroundColor: obterCoresBadge(pedido.status_pedido).bg,
                    borderColor: obterCoresBadge(pedido.status_pedido).border,
                    color: obterCoresBadge(pedido.status_pedido).text,
                    display: 'inline-block'
                  }}>
                    {pedido.status_pedido}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#94a3b8', gridColumn: 'span 3', textAlign: 'center', padding: '20px' }}>Você ainda não possui histórico de pedidos.</p>
          )}
        </div>
      </div>

    </div>
  );
}

// Estilos
const styles = {
  cardMetrica: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  iconeFundo: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelMetrica: {
    margin: '0 0 6px 0',
    color: '#64748b',
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  valorMetrica: {
    margin: 0,
    color: '#0f172a',
    fontSize: '1.8rem',
  },
  subValor: {
    fontSize: '1rem',
    color: '#94a3b8',
    fontWeight: 'normal'
  },
  tituloSecao: {
    fontSize: '1.3rem',
    color: '#1e293b',
    margin: '0',
  },
  cardPedidoAntigo: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  botaoGigante: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#0056b3',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(0,86,179,0.2)',
    transition: 'all 0.3s ease'
  }
};