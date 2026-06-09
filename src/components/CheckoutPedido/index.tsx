import React, { useState } from 'react';
import { FiMapPin, FiClock, FiCalendar, FiCheck } from 'react-icons/fi';
import './checkoutPedido.css'; // Importando o CSS local da pasta do componente

interface CheckoutPedidoProps {
  lavanderia: any;
  dadosDoPedido: any[]; 
  onVoltar: () => void;
  onConfirmar: (dadosFinais: any) => void;
}

export function CheckoutPedido({ lavanderia, dadosDoPedido, onVoltar, onConfirmar }: CheckoutPedidoProps) {
  const [cestoExpandido, setCestoExpandido] = useState<number>(0);
  const [opcoesCestos, setOpcoesCestos] = useState<Record<number, string[]>>({});
  const [cupom, setCupom] = useState('');

  const precoNormal = Number(lavanderia?.preco_padrao_lavagem) || 20.00;
  const precoPesada = precoNormal * 1.5; 
  const precoSecagem = Number(lavanderia?.preco_padrao_secagem) || 15.00;

  const taxaMotorista = 12.00;
  const taxaKm = 4.50;
  const taxaApp = 6.00;

  const toggleOpcao = (indexCesto: number, opcao: string) => {
    setOpcoesCestos(prev => {
      const opcoesAtuais = prev[indexCesto] || [];
      if (opcoesAtuais.includes(opcao)) {
        return { ...prev, [indexCesto]: opcoesAtuais.filter(o => o !== opcao) };
      } else {
        return { ...prev, [indexCesto]: [...opcoesAtuais, opcao] };
      }
    });
  };

  const calcularTotalCiclos = () => {
    let total = 0;
    Object.values(opcoesCestos).forEach(opcoes => {
      if (opcoes.includes('normal')) total += precoNormal;
      if (opcoes.includes('pesada')) total += precoPesada;
      if (opcoes.includes('secagem')) total += precoSecagem;
    });
    return total;
  };

  const valorTotalCiclos = calcularTotalCiclos();
  const valorTotalPedido = valorTotalCiclos + taxaMotorista + taxaKm + taxaApp;

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (!lavanderia) return <p>Carregando dados da lavanderia...</p>;

  return (
    <div className="checkout-container">
      <div className="checkout-layout">
        
        {/* COLUNA ESQUERDA */}
        <div className="coluna-esquerda">
          <div className="card-branco header-lavanderia-checkout">
            <div className="foto-lavanderia-checkout">
              {lavanderia.logo ? (
                <img src={lavanderia.logo} alt={lavanderia.nome} />
              ) : (
                <div className="foto-placeholder">IMG</div>
              )}
            </div>
            <div className="info-lavanderia-checkout">
              <h3>{lavanderia.nome}</h3>
              <div className="endereco-linha">
                <FiMapPin size={16} />
                <span>
                  {lavanderia.logradouro}, {lavanderia.numero} - {lavanderia.bairro}, {lavanderia.cidade}/{lavanderia.uf} | CEP: {lavanderia.cep || '00000-000'}
                </span>
              </div>
            </div>
          </div>

          <div className="card-branco secao-ciclos">
            <h4>Selecione os ciclos por cesto</h4>
            <div className="lista-cestos-checkout">
              {dadosDoPedido.map((cesto, index) => {
                const totalPecas = cesto.roupas.reduce((acc: number, r: any) => acc + r.quantidade, 0);
                const isExpandido = cestoExpandido === index;
                const opcoesSelecionadas = opcoesCestos[index] || [];

                return (
                  <div key={index} className={`cesto-ciclo-item ${isExpandido ? 'expandido' : ''}`}>
                    <div className="cesto-ciclo-header" onClick={() => setCestoExpandido(index)}>
                      <div className="cesto-info-basica">
                        <strong>Cesto {index + 1}</strong>
                        <span>{totalPecas} peças</span>
                      </div>
                      <div className="status-ciclos">
                        {opcoesSelecionadas.length > 0 ? (
                          <span className="badge-sucesso"><FiCheck /> {opcoesSelecionadas.length} ciclos</span>
                        ) : (
                          <span className="badge-pendente">Configurar</span>
                        )}
                      </div>
                    </div>

                    {isExpandido && (
                      <div className="cesto-ciclo-opcoes">
                        <p>Quais serviços este cesto precisa?</p>
                        
                        <label className={`opcao-checkbox ${opcoesSelecionadas.includes('normal') ? 'ativo' : ''}`}>
                          <input type="checkbox" checked={opcoesSelecionadas.includes('normal')} onChange={() => toggleOpcao(index, 'normal')} />
                          <div className="opcao-textos">
                            <span>Lavagem Normal</span>
                            <small>R$ {precoNormal.toFixed(2)}</small>
                          </div>
                        </label>

                        <label className={`opcao-checkbox ${opcoesSelecionadas.includes('pesada') ? 'ativo' : ''}`}>
                          <input type="checkbox" checked={opcoesSelecionadas.includes('pesada')} onChange={() => toggleOpcao(index, 'pesada')} />
                          <div className="opcao-textos">
                            <span>Lavagem Pesada</span>
                            <small>R$ {precoPesada.toFixed(2)}</small>
                          </div>
                        </label>

                        <label className={`opcao-checkbox ${opcoesSelecionadas.includes('secagem') ? 'ativo' : ''}`}>
                          <input type="checkbox" checked={opcoesSelecionadas.includes('secagem')} onChange={() => toggleOpcao(index, 'secagem')} />
                          <div className="opcao-textos">
                            <span>Secagem</span>
                            <small>R$ {precoSecagem.toFixed(2)}</small>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-branco secao-agendamento">
            <h4>Data e Hora de Retirada</h4>
            <div className="agendamento-info">
              <div className="agendamento-bloco">
                <FiCalendar size={20} />
                <div>
                  <span className="agendamento-label">Data</span>
                  <span className="agendamento-valor">Hoje, {dataAtual}</span>
                </div>
              </div>
              <div className="linha-vertical"></div>
              <div className="agendamento-bloco">
                <FiClock size={20} />
                <div>
                  <span className="agendamento-label">Horário</span>
                  <span className="agendamento-valor">{horaAtual}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="coluna-direita">
          <div className="card-branco card-resumo-financeiro">
            <h3>Resumo do pedido</h3>
            <div className="linhas-financeiras">
              <div className="linha-valor">
                <span>Preço dos ciclos</span>
                <span>R$ {valorTotalCiclos.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Taxa motorista</span>
                <span>R$ {taxaMotorista.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Taxa de KM total</span>
                <span>R$ {taxaKm.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Taxa do aplicativo</span>
                <span>R$ {taxaApp.toFixed(2)}</span>
              </div>
              <div className="linha-valor desconto">
                <span>Desconto</span>
                <span>- R$ 0.00</span>
              </div>
            </div>

            <hr className="divisor-resumo" />

            <div className="linha-total">
              <span>Valor total do pedido</span>
              <span>R$ {valorTotalPedido.toFixed(2)}</span>
            </div>

            <div className="area-cupom">
              <input 
                type="text" 
                placeholder="Aplicar cupom de desconto" 
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
              />
              <button className="btn-aplicar">Aplicar</button>
            </div>

            <div className="acoes-finais">
              <button className="btn-voltar-checkout" onClick={onVoltar}>Voltar</button>
              <button 
                className="btn-confirmar-pedido"
                disabled={valorTotalCiclos === 0}
                onClick={() => {
                  const pacoteFinal = {
                    cestosCompletos: dadosDoPedido,
                    configuracoesCiclos: opcoesCestos,
                    totais: {
                      ciclos: valorTotalCiclos,
                      motorista: taxaMotorista,
                      km: taxaKm,
                      app: taxaApp,
                      totalGeral: valorTotalPedido
                    }
                  };
                  onConfirmar(pacoteFinal);
                }}
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}