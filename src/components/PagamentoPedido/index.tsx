import React, { useState } from 'react';
import { FiCreditCard, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { MdQrCode2 } from 'react-icons/md';
import './pagamentoPedido.css';

interface PagamentoPedidoProps {
  resumoFinanceiro: any; // Recebe o resumo que montamos no Passo 4
  onVoltar: () => void;
  onFinalizarPagamento: (metodo: string, dadosPagamento: any) => void;
}

// Mock de cartões que viriam do banco de dados do usuário
const cartoesSalvosMock = [
  { id: 1, final: '4321', bandeira: 'Mastercard', tipo: 'Crédito' },
  { id: 2, final: '8765', bandeira: 'Visa', tipo: 'Débito' }
];

export function PagamentoPedido({ resumoFinanceiro, onVoltar, onFinalizarPagamento }: PagamentoPedidoProps) {
  // Estados da tela
  const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix'>('cartao');
  const [idCartaoSelecionado, setIdCartaoSelecionado] = useState<number | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Simulando o código Pix que viria do backend
  const codigoPixMock = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266554400005204000053039865802BR5913Sempre Limpa6009Sao Paulo62070503***63041A2B";

  const copiarPix = () => {
    navigator.clipboard.writeText(codigoPixMock);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Se por acaso a tela carregar sem os dados (F5), evita quebrar
  if (!resumoFinanceiro) return <p>Carregando dados do pagamento...</p>;

  return (
    <div className="pagamento-container">
      <div className="pagamento-layout">
        
        {/* ==========================================
            COLUNA ESQUERDA (Opções de Pagamento)
            ========================================== */}
        <div className="coluna-esquerda card-branco">
          <h2 className="titulo-pagamento">Como você prefere pagar?</h2>

          {/* Toggle de Seleção PIX / CARTÃO */}
          <div className="seletor-metodo-pagamento">
            <button 
              className={`btn-metodo ${metodoPagamento === 'cartao' ? 'ativo' : ''}`}
              onClick={() => setMetodoPagamento('cartao')}
            >
              <FiCreditCard size={24} />
              <span>Cartão</span>
            </button>
            <button 
              className={`btn-metodo ${metodoPagamento === 'pix' ? 'ativo' : ''}`}
              onClick={() => setMetodoPagamento('pix')}
            >
              <MdQrCode2 size={24} />
              <span>Pix</span>
            </button>
          </div>

          <div className="area-conteudo-metodo">
            
            {/* --- VISÃO CARTÃO --- */}
            {metodoPagamento === 'cartao' && (
              <div className="visao-cartao">
                <h3>Seus cartões salvos</h3>
                
                {cartoesSalvosMock.length > 0 ? (
                  <div className="lista-cartoes">
                    {cartoesSalvosMock.map(cartao => (
                      <div 
                        key={cartao.id} 
                        className={`card-cartao-cinza ${idCartaoSelecionado === cartao.id ? 'selecionado' : ''}`}
                        onClick={() => setIdCartaoSelecionado(cartao.id)}
                      >
                        <div className="icone-bandeira">
                          <FiCreditCard size={24} color={idCartaoSelecionado === cartao.id ? '#007bff' : '#64748b'} />
                        </div>
                        <div className="info-cartao">
                          <span className="nome-cartao">{cartao.bandeira} • {cartao.tipo}</span>
                          <span className="final-cartao">Final {cartao.final}</span>
                        </div>
                        <div className="radio-customizado">
                          {idCartaoSelecionado === cartao.id && <div className="radio-ativo"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="texto-vazio">Você ainda não possui cartões cadastrados.</p>
                )}

                <div className="acoes-pagamento-esquerdo">
                  {idCartaoSelecionado ? (
                    <button 
                      className="btn-acao-principal"
                      onClick={() => onFinalizarPagamento('cartao', { cartaoId: idCartaoSelecionado })}
                    >
                      Confirmar pagamento
                    </button>
                  ) : (
                    <button className="btn-acao-secundaria">
                      <FiPlus size={18} style={{ marginRight: '8px' }} />
                      Registrar novo cartão
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* --- VISÃO PIX --- */}
            {metodoPagamento === 'pix' && (
              <div className="visao-pix">
                <div className="box-qrcode-cinza">
                  <MdQrCode2 size={120} color="#334155" />
                  <p>Escaneie o QR Code com o app do seu banco</p>
                </div>

                <div className="box-copia-cola">
                  <p className="label-copia">Ou copie o código Pix (Copia e Cola)</p>
                  <div className="input-group-copiar">
                    <input type="text" readOnly value={codigoPixMock} />
                    <button onClick={copiarPix} className={copiado ? 'copiado' : ''}>
                      {copiado ? <FiCheckCircle size={20} /> : <FiCopy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="status-pix-container">
                  <div className="spinner-loader"></div>
                  <span>Esperando conclusão do pagamento...</span>
                </div>

                <div className="acoes-pagamento-esquerdo">
                  <button 
                    className="btn-acao-principal pix-btn"
                    onClick={() => onFinalizarPagamento('pix', { status: 'pago' })}
                  >
                    Já paguei!
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ==========================================
            COLUNA DIREITA (Resumo do Pedido - Reutilizado visualmente)
            ========================================== */}
        <div className="coluna-direita">
          <div className="card-branco card-resumo-financeiro">
            <h3>Resumo final</h3>
            
            <div className="linhas-financeiras">
              <div className="linha-valor">
                <span>Preço dos ciclos</span>
                <span>R$ {resumoFinanceiro.valor_ciclos?.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Taxas de entrega</span>
                <span>R$ {resumoFinanceiro.taxa_entrega?.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Taxa do aplicativo</span>
                <span>R$ {resumoFinanceiro.taxa_app?.toFixed(2)}</span>
              </div>
            </div>

            <hr className="divisor-resumo" />

            <div className="linha-total">
              <span>Total a pagar</span>
              <span style={{ color: '#007bff' }}>R$ {resumoFinanceiro.valor_total_pedido?.toFixed(2)}</span>
            </div>

            <button className="btn-voltar-checkout" onClick={onVoltar} style={{ marginTop: '20px' }}>
              Voltar para o carrinho
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Hack rápido para o FiPlus funcionar caso você não tenha importado lá em cima
import { FiPlus } from 'react-icons/fi';