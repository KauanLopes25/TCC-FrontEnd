import React, { useState } from 'react';
import { FiCreditCard, FiCopy, FiCheckCircle, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { MdQrCode2 } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useCartao } from '../../hooks/useCartao'; // 🚀 Restaurado seu hook real
import './pagamentoPedido.css';

interface PagamentoPedidoProps {
  resumoFinanceiro: any; 
  onVoltar: () => void;
  onFinalizarPagamento: (metodo: string, dadosPagamento: any) => void;
  processando?: boolean;
  dadosPix?: { 
    metodo: 'pix' | 'cartao';
    qrCodeTexto?: string;
    qrCodeUrl?: string;
    checkoutUrl?: string; 
    idPedidoBanco?: string | number;
  } | null;
}

export function PagamentoPedido({ resumoFinanceiro, onVoltar, onFinalizarPagamento, processando, dadosPix }: PagamentoPedidoProps) {
  const navigate = useNavigate();
  const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix'>('cartao');
  
  // Suporta tanto número (banco) quanto string para evitar bugs de tipagem
  const [idCartaoSelecionado, setIdCartaoSelecionado] = useState<number | string | null>(null);
  
  const [copiado, setCopiado] = useState(false);
  const { registrarCartao } = useCartao(); // 🚀 Sua função real do Node.js
  const [isRegistrandoCartao, setIsRegistrandoCartao] = useState(false);
  const [dadosNovoCartao, setDadosNovoCartao] = useState({
    nome: '', numero: '', validade: '', cvv: '', cpf: ''
  });

  // Inicializa buscando do localStorage para não perder os cartões criados nas sessões anteriores
  const [listaCartoes, setListaCartoes] = useState(() => {
    const salvos = localStorage.getItem('@SempreLimpa:cartoes');
    if (salvos) {
      return JSON.parse(salvos);
    }
    // Padronizado os IDs dos Mocks para evitar o conflito visual anterior
    return [
      { id: 100, final: '4321', bandeira: 'Mastercard', tipo: 'Crédito' },
      { id: 200, final: '8765', bandeira: 'Visa', tipo: 'Débito' }
    ];
  });

  const copiarPix = (textoParaCopiar: string) => {
    if (!textoParaCopiar) return;
    navigator.clipboard.writeText(textoParaCopiar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleRegistrarCartao = async () => {
    try {
      const cartaoRetornadoApi = await registrarCartao(dadosNovoCartao);

      if (cartaoRetornadoApi) {
        // 🚀 O SEGREDO ESTÁ AQUI: Filtra a lista atual para arrancar os Mocks fora
        const listaSemMocks = listaCartoes.filter((c: any) => c.id !== 100 && c.id !== 200);
        
        // Junta a lista limpa apenas com o seu novo cartão real
        const novaLista = [...listaSemMocks, cartaoRetornadoApi];
        
        setListaCartoes(novaLista);
        localStorage.setItem('@SempreLimpa:cartoes', JSON.stringify(novaLista));

        setIsRegistrandoCartao(false);
        setDadosNovoCartao({ nome: '', numero: '', validade: '', cvv: '', cpf: '' });
        setIdCartaoSelecionado(cartaoRetornadoApi.id);
      }
    } catch (error) {
      console.error("Erro ao registrar cartão na API:", error);
    }
  };

  const simularPagamentoSucesso = () => {
    if (dadosPix?.idPedidoBanco) {
       navigate(`/acompanhamento/${dadosPix.idPedidoBanco}`);
    } else {
       navigate('/pedidos');
    }
  };

  if (!resumoFinanceiro) return <p>Carregando dados do pagamento...</p>;

  return (
    <div className="pagamento-container">
      <div className="pagamento-layout">
        
        <div className="coluna-esquerda card-branco">
          
          {!isRegistrandoCartao && (
            <>
              <h2 className="titulo-pagamento">Como você prefere pagar?</h2>
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
                  onClick={() => {
                    setMetodoPagamento('pix');
                    if (!dadosPix && !processando) {
                      onFinalizarPagamento('pix', {});
                    }
                  }}
                >
                  <MdQrCode2 size={24} />
                  <span>Pix</span>
                </button>
              </div>
            </>
          )}

          <div className="area-conteudo-metodo">
            
            {metodoPagamento === 'cartao' && (
              <div className="visao-cartao">
                
                {isRegistrandoCartao ? (
                  <div className="form-novo-cartao-container">
                    <button className="btn-voltar-form" onClick={() => setIsRegistrandoCartao(false)}>
                      <FiArrowLeft size={20} /> Voltar aos cartões
                    </button>
                    
                    <h3>Registrar novo cartão</h3>
                    <p className="subtitulo-form">Seus dados estão protegidos e criptografados.</p>

                    <div className="form-grid">
                      <div className="input-group-cartao">
                        <label>Nome no cartão</label>
                        <input 
                          type="text" 
                          placeholder="Ex: GUILHERME V SOUZA" 
                          value={dadosNovoCartao.nome}
                          onChange={(e) => setDadosNovoCartao({...dadosNovoCartao, nome: e.target.value.toUpperCase()})}
                        />
                      </div>

                      <div className="input-group-cartao">
                        <label>Número do cartão</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          maxLength={19}
                          value={dadosNovoCartao.numero}
                          onChange={(e) => setDadosNovoCartao({...dadosNovoCartao, numero: e.target.value})}
                        />
                      </div>

                      <div className="linha-inputs-duplos">
                        <div className="input-group-cartao">
                          <label>Vencimento</label>
                          <input 
                            type="text" 
                            placeholder="MM/AA" 
                            maxLength={5}
                            value={dadosNovoCartao.validade}
                            onChange={(e) => setDadosNovoCartao({...dadosNovoCartao, validade: e.target.value})}
                          />
                        </div>
                        <div className="input-group-cartao">
                          <label>CVV</label>
                          <input 
                            type="password" 
                            placeholder="123" 
                            maxLength={4}
                            value={dadosNovoCartao.cvv}
                            onChange={(e) => setDadosNovoCartao({...dadosNovoCartao, cvv: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="input-group-cartao">
                        <label>CPF do titular</label>
                        <input 
                          type="text" 
                          placeholder="000.000.000-00" 
                          maxLength={14}
                          value={dadosNovoCartao.cpf}
                          onChange={(e) => setDadosNovoCartao({...dadosNovoCartao, cpf: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="acoes-pagamento-esquerdo" style={{ marginTop: '32px' }}>
                      <button 
                        className="btn-acao-principal"
                        onClick={handleRegistrarCartao}
                        disabled={!dadosNovoCartao.numero || !dadosNovoCartao.validade || !dadosNovoCartao.cvv}
                      >
                        Registrar cartão
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>Seus cartões salvos</h3>
                    
                    {listaCartoes.length > 0 ? (
                      <div className="lista-cartoes">
                        {listaCartoes.map((cartao:any) => (
                          <div 
                            key={cartao.id} 
                            /* Blindagem contra bug de tipo: transforma tudo em String para comparar perfeitamente */
                            className={`card-cartao-cinza ${String(idCartaoSelecionado) === String(cartao.id) ? 'selecionado' : ''}`}
                            onClick={() => setIdCartaoSelecionado(cartao.id)}
                          >
                            <div className="icone-bandeira">
                              <FiCreditCard size={24} color={String(idCartaoSelecionado) === String(cartao.id) ? '#007bff' : '#64748b'} />
                            </div>
                            <div className="info-cartao">
                              <span className="nome-cartao">{cartao.bandeira} • {cartao.tipo}</span>
                              <span className="final-cartao">Final {cartao.final}</span>
                            </div>
                            <div className="radio-customizado">
                              {String(idCartaoSelecionado) === String(cartao.id) && <div className="radio-ativo"></div>}
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
                          onClick={() => {
                            if (dadosPix?.idPedidoBanco) {
                               navigate(`/acompanhamento/${dadosPix.idPedidoBanco}`);
                            } else {
                               // Envia o ID numérico/real diretamente para o hook e para a procedure
                               onFinalizarPagamento('cartao', { cartaoId: idCartaoSelecionado });
                            }
                          }}
                          disabled={processando} 
                        >
                          {processando ? 'Processando...' : 'Confirmar pagamento'}
                        </button>
                      ) : (
                        <button 
                          className="btn-acao-secundaria"
                          onClick={() => setIsRegistrandoCartao(true)}
                        >
                          <FiPlus size={18} style={{ marginRight: '8px' }} />
                          Registrar novo cartão
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {metodoPagamento === 'pix' && !isRegistrandoCartao && (
              <div className="visao-pix">
                
                {!dadosPix ? (
                  <div className="geracao-pix-pendente" style={{ textAlign: 'center', padding: '40px 0' }}>
                     <div className="spinner-loader" style={{ margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#475569', marginBottom: '24px' }}>
                      Gerando seu código Pix seguro...
                    </p>
                  </div>
                ) : (
                  
                  <div className="pix-gerado-sucesso">
                    <div className="box-qrcode-cinza" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {dadosPix.qrCodeTexto ? (
                         <QRCodeSVG value={dadosPix.qrCodeTexto} size={150} level={"M"} />
                      ) : (
                         <MdQrCode2 size={120} color="#334155" />
                      )}
                      <p style={{ marginTop: '16px' }}>Escaneie o QR Code com o app do seu banco</p>
                    </div>

                    <div className="box-copia-cola">
                      <p className="label-copia">Ou copie o código Pix (Copia e Cola)</p>
                      <div className="input-group-copiar">
                        <input type="text" readOnly value={dadosPix.qrCodeTexto || 'Código não gerado'} />
                        <button 
                          onClick={() => copiarPix(dadosPix.qrCodeTexto || '')} 
                          className={copiado ? 'copiado' : ''}
                        >
                          {copiado ? <FiCheckCircle size={20} /> : <FiCopy size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="status-pix-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="spinner-loader"></div>
                        <span>Esperando conclusão do pagamento...</span>
                      </div>
                      
                      <button 
                        className="btn-acao-principal"
                        style={{ backgroundColor: '#22c55e', border: 'none', padding: '10px 20px', borderRadius: '8px', color: '#fff', cursor: 'pointer', width: '100%' }}
                        onClick={simularPagamentoSucesso}
                      >
                        Concluído
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

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
              Voltar para a configuração
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}