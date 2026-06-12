import React, { useState } from 'react';
import { FiUser, FiMapPin, FiStar, FiPackage } from 'react-icons/fi';
import { FaMotorcycle, FaCar, FaBicycle } from 'react-icons/fa';

export function AcompanhamentoPedido() {
  // Estados de controle para a apresentação
  const [motoristaAceitou, setMotoristaAceitou] = useState(false);
  const [idCestoAtivo, setIdCestoAtivo] = useState(1);

  // Mock dos dados simulando o retorno do seu banco de dados
  const dadosPedido = {
    numero_pedido: 4092,
    preco_total: 51.00,
    cestos_total: 2,
    cestos: [
      {
        id: 1,
        tipo: 'Lavagem Pesada',
        secagem: 'SIM',
        roupas: [
          { nome: 'Camisa Polo', cor: 'Azul', quantidade: 3 },
          { nome: 'Calça Jeans', cor: 'Preta', quantidade: 2 }
        ]
      },
      {
        id: 2,
        tipo: 'Lavagem Normal',
        secagem: 'NAO',
        roupas: [
          { nome: 'Lençol', cor: 'Branco', quantidade: 1 },
          { nome: 'Fronha', cor: 'Branca', quantidade: 2 }
        ]
      }
    ],
    motorista: {
      nome: 'Carlos Silva',
      avaliacao: 4.8,
      veiculo: {
        modalidade: 'motocicleta',
        modelo: 'Honda CG 160 Titan',
        placa: 'ABC1D23',
        cor: 'Vermelha'
      }
    }
  };

  // Encontra o cesto que está selecionado no momento para atualizar as informações dinamicamente
  const cestoAtual = dadosPedido.cestos.find(c => c.id === idCestoAtivo) || dadosPedido.cestos[0];

  const renderIconeVeiculo = (modalidade: string) => {
    switch (modalidade) {
      case 'motocicleta': return <FaMotorcycle size={24} color="#475569" />;
      case 'carro': return <FaCar size={24} color="#475569" />;
      case 'bike': return <FaBicycle size={24} color="#475569" />;
      default: return <FaCar size={24} color="#475569" />;
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* ==========================================
          CARD BRANCO PRINCIPAL (Engloba TUDO)
          ========================================== */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        
        {/* CABEÇALHO E BOTÃO DE STATUS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>Status da Coleta</h2>
          
          <button 
            onClick={() => setMotoristaAceitou(!motoristaAceitou)}
            style={{ padding: '10px 20px', backgroundColor: motoristaAceitou ? '#22c55e' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' }}
          >
            {motoristaAceitou ? 'Aceito com Motorista' : 'Analisando pedido...'}
          </button>
        </div>

        {/* ÁREA DO MAPA */}
        <div style={{ width: '100%', height: '220px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', border: '2px dashed #cbd5e1' }}>
          <FiMapPin size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <p style={{ color: '#64748b', margin: 0, fontWeight: '500' }}>Mapa de geolocalização da lavanderia</p>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(Simulação de rastreamento)</span>
        </div>

        {/* CARD AZUL (Motorista e Resumo) */}
        {motoristaAceitou && (
          <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '24px', border: '1px solid #bfdbfe', marginBottom: '32px' }}>
            
            <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '1.2rem' }}>Dados do Transporte</h3>
            
            {/* Informações do Motorista */}
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <FiUser size={24} color="#64748b" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.1rem' }}>{dadosPedido.motorista.nome}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <FiStar fill="#f59e0b" /> <span>{dadosPedido.motorista.avaliacao}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>{dadosPedido.motorista.veiculo.modelo}</h4>
                  <span style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#334155' }}>
                    {dadosPedido.motorista.veiculo.placa}
                  </span>
                </div>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {renderIconeVeiculo(dadosPedido.motorista.veiculo.modalidade)}
                </div>
              </div>
            </div>

            {/* Resumo do Pedido (Números e Configuração do Cesto) */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              {/* Linha 1: Valores e Quantidades */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Nº do Pedido</p>
                  <strong style={{ color: '#0f172a', fontSize: '1.2rem' }}>#{dadosPedido.numero_pedido}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Quantidade</p>
                  <strong style={{ color: '#0f172a', fontSize: '1.2rem' }}>{dadosPedido.cestos_total} Cestos</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Preço Total</p>
                  <strong style={{ color: '#22c55e', fontSize: '1.3rem' }}>R$ {dadosPedido.preco_total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Linha 2: Informação de Lavagem e Secagem (Dinâmico conforme a aba clicada) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Modo do Cesto {cestoAtual.id}:</span>
                  <strong style={{ color: '#0f172a' }}>{cestoAtual.tipo}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Secagem Inclusa:</span>
                  <span style={{ 
                    backgroundColor: cestoAtual.secagem === 'SIM' ? '#dcfce7' : '#fee2e2', 
                    color: cestoAtual.secagem === 'SIM' ? '#166534' : '#991b1b', 
                    padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' 
                  }}>
                    {cestoAtual.secagem}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            RELAÇÃO DO PEDIDO (Abas Interativas)
            ========================================== */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <FiPackage /> Relação das Roupas
          </h3>

          {/* Botões das Abas (Tabs) */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {dadosPedido.cestos.map((cesto) => (
              <button
                key={cesto.id}
                onClick={() => setIdCestoAtivo(cesto.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: idCestoAtivo === cesto.id ? '2px solid #007bff' : '1px solid #cbd5e1',
                  backgroundColor: idCestoAtivo === cesto.id ? '#eff6ff' : '#fff',
                  color: idCestoAtivo === cesto.id ? '#007bff' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                Cesto {cesto.id}
              </button>
            ))}
          </div>

          {/* Conteúdo da Aba Selecionada */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#334155' }}>Itens no {cestoAtual.tipo}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cestoAtual.roupas.map((roupa, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <strong style={{ color: '#0f172a' }}>{roupa.quantidade}x {roupa.nome}</strong>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Cor: {roupa.cor}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
      </div>
    </div>
  );
}