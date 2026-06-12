import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPackage, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { useAcompanhamento } from '../../hooks/useAcompanhamento'; // Ajuste o caminho da pasta!

export function AcompanhamentoPedido() {
  const { idPedido } = useParams();
  const navigate = useNavigate();

  // 🚀 TUDO VEM DO HOOK AGORA! Visual 100% separado da lógica.
  const { dadosPedido, loading, erro, idCestoAtivo, setIdCestoAtivo } = useAcompanhamento(idPedido);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: '#64748b' }}>Buscando localização da sua roupa...</div>;
  }
  const renderizarStatusBadge = (statusTexto: string) => {
  const statusFormatado = String(statusTexto).toUpperCase();

  switch (statusFormatado) {
    case 'SOLICITADO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#f59e0b', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Aguardando Motorista</div>;
    case 'ATRIBUIDO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Motorista a Caminho</div>;
    case 'COLETANDO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Coletando Roupas</div>;
    case 'EM_TRANSITO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#06b6d4', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Em Trânsito</div>;
    case 'LAVANDO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Lavando Roupas</div>;
    case 'SECANDO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#f97316', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Secando Roupas</div>;
    case 'RETORNANDO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#a855f7', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Devolvendo Roupas</div>;
    case 'ENTREGUE':
      return <div style={{ padding: '8px 16px', backgroundColor: '#22c55e', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Finalizado</div>;
    case 'CANCELADO':
      return <div style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>Cancelado</div>;
    default:
      return <div style={{ padding: '8px 16px', backgroundColor: '#64748b', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>{statusTexto}</div>;
  }
};

  if (erro || !dadosPedido) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <FiAlertCircle size={48} color="#ef4444" />
        <h2 style={{ color: '#1e293b' }}>Ops! {erro}</h2>
        <button onClick={() => navigate('/home')} style={{ padding: '10px 20px', background: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Voltar para a Home</button>
      </div>
    );
  }

  const cestoAtual = dadosPedido.cestos.find((c: any) => c.id === idCestoAtivo) || dadosPedido.cestos[0];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>Status da Coleta</h2>
          <div style={{ padding: '8px 16px', backgroundColor: dadosPedido.motorista ? '#22c55e' : '#f59e0b', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>
            {dadosPedido.status}
          </div>
        </div>

        <div style={{ width: '100%', height: '220px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', border: '2px dashed #cbd5e1' }}>
          <FiMapPin size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Mapa de geolocalização da lavanderia</p>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(Simulação de rastreamento)</span>
        </div>

        <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '24px', border: '1px solid #bfdbfe', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '1.2rem' }}>Dados do Transporte</h3>
          
          {dadosPedido.motorista ? (
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <FiUser size={24} color="#64748b" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.1rem' }}>{dadosPedido.motorista}</h4>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Motorista Parceiro</span>
                </div>
              </div>
              <FiTruck size={32} color="#475569" />
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', color: '#64748b' }}>
              Aguardando motorista aceitar a corrida...
            </div>
          )}

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Nº do Pedido</p>
                <strong style={{ color: '#0f172a', fontSize: '1.2rem' }}>#{dadosPedido.numero_pedido}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Lavanderia</p>
                <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{dadosPedido.lavanderia}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Preço Total</p>
                <strong style={{ color: '#22c55e', fontSize: '1.3rem' }}>R$ {dadosPedido.valor_total.toFixed(2)}</strong>
              </div>
            </div>

            {cestoAtual && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Cesto {cestoAtual.id}:</span>
                  <strong style={{ color: '#0f172a' }}>{cestoAtual.tipo}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Secagem:</span>
                  <span style={{ backgroundColor: cestoAtual.secagem === 'SIM' ? '#dcfce7' : '#fee2e2', color: cestoAtual.secagem === 'SIM' ? '#166534' : '#991b1b', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {cestoAtual.secagem}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {dadosPedido.cestos.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <FiPackage /> Relação das Roupas
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {dadosPedido.cestos.map((cesto: any, index: number) => (
                <button
                  key={cesto.id}
                  onClick={() => setIdCestoAtivo(cesto.id)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                    border: idCestoAtivo === cesto.id ? '2px solid #007bff' : '1px solid #cbd5e1',
                    backgroundColor: idCestoAtivo === cesto.id ? '#eff6ff' : '#fff',
                    color: idCestoAtivo === cesto.id ? '#007bff' : '#64748b',
                    transition: 'all 0.2s'
                  }}
                >
                  Cesto {index + 1}
                </button>
              ))}
            </div>

            {cestoAtual && (
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cestoAtual.roupas.map((roupa: any, i: number) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <strong style={{ color: '#0f172a' }}>{roupa.quantidade}x {roupa.nome}</strong>
                    </li>
                  ))}
                  {cestoAtual.roupas.length === 0 && (
                     <li style={{ textAlign: 'center', color: '#64748b' }}>Nenhuma roupa descrita neste cesto.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}