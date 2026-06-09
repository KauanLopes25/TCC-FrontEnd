import React, { useState } from 'react';
import { FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi';
import { useCesto } from '../../hooks/useCesto';
import './MontagemCesto.css'; 

interface MontagemCestoProps {
  onVoltar: () => void;
  onAvancar: () => void;
}

export function MontagemCesto({ onVoltar, onAvancar }: MontagemCestoProps) {
  const {
    cestos,
    idCestoAtivo,
    cestoAtivo,
    totalPecasAtivas,
    adicionarCesto,
    selecionarCesto,
    alterarQuantidadeRoupa,
    calcularTotalPecas
  } = useCesto();

  // NOVO ESTADO: Controla se estamos na tela de ver as roupas do cesto ou buscando novas
  const [modoAdicionarRoupa, setModoAdicionarRoupa] = useState(false);

  const pecasBase = [
    { id: 1, nome: 'Camiseta' },
    { id: 2, nome: 'Calça' },
    { id: 3, nome: 'Cobertor' }
  ];

  const porcentagemProgresso = (totalPecasAtivas / cestoAtivo.limiteMaximo) * 100;

  return (
    <div className="cesto-etapa-container">
      <div className="card-grande-cesto">
        
        <div className="header-cesto">
          <h3>Selecione os cestos</h3>
        </div>

        <div className="grid-mini-cestos">
          {cestos.map((cesto, index) => {
            const totalPecas = calcularTotalPecas(cesto);
            const isAtivo = cesto.id === idCestoAtivo;

            return (
              <div 
                key={cesto.id} 
                className={`mini-card-cesto ${isAtivo ? 'ativo' : ''}`}
                onClick={() => {
                  selecionarCesto(cesto.id);
                  setModoAdicionarRoupa(false); // Volta pra visualização normal ao trocar de cesto
                }}
              >
                <div className="icone-cesto-wrapper">
                  <FiShoppingBag size={24} />
                </div>
                <div className="textos-mini-cesto">
                  <span className="titulo-cesto">Cesto {index + 1}</span>
                  <span className="quantidade-cesto">
                    {totalPecas} / {cesto.limiteMaximo} peças
                  </span>
                </div>
              </div>
            );
          })}

          <div className="mini-card-adicionar" onClick={adicionarCesto}>
            <FiPlus size={28} />
          </div>
        </div>

        {/* ÁREA DINÂMICA (Troca de conteúdo baseada no estado) */}
        <div className="secao-detalhes-cesto-ativo">
          
          {modoAdicionarRoupa ? (
            
            // CONTEÚDO 2: Tela de Adicionar Novas Roupas (Faremos no próximo passo)
            <div className="area-nova-roupa">
              <h4>Adicionar nova peça ao Cesto {cestos.findIndex(c => c.id === idCestoAtivo) + 1}</h4>
              <p style={{ color: '#666', margin: '20px 0' }}>[ Aqui vai entrar o catálogo completo de roupas e a barra de busca ]</p>
              
              <button 
                className="btn-navegacao-voltar" 
                onClick={() => setModoAdicionarRoupa(false)}
              >
                Cancelar e Voltar
              </button>
            </div>

          ) : (
            
            // CONTEÚDO 1: Visão padrão do Cesto Ativo
            <>
              <h4>Itens no Cesto {cestos.findIndex(c => c.id === idCestoAtivo) + 1}</h4>

              {/* 1. BARRINHA DE PROGRESSO (Movida para cima com marginBottom para não grudar na lista) */}
              <div className="container-progresso-cesto" style={{ marginBottom: '24px' }}>
                <div className="info-texto-progresso">
                  <span>Capacidade do cesto</span>
                  <span>{totalPecasAtivas} / {cestoAtivo.limiteMaximo} Peças</span>
                </div>
                <div className="barra-progresso-fundo">
                  <div 
                    className="barra-progresso-preenchimento" 
                    style={{ width: `${porcentagemProgresso}%` }}
                  ></div>
                </div>
                {totalPecasAtivas === cestoAtivo.limiteMaximo && (
                  <p className="aviso-cesto-cheio">Capacidade máxima deste cesto atingida!</p>
                )}
              </div>
              
              {/* 2. ITENS BASE */}
              <div className="lista-selecao-roupas">
                {pecasBase.map((roupa) => {
                  const quantidadeNoCesto = cestoAtivo.itens[roupa.id] || 0;

                  return (
                    <div key={roupa.id} className="linha-roupa-seletor">
                      <span className="nome-roupa-peca">{roupa.nome}</span>
                      
                      <div className="controles-contador">
                        <button 
                          type="button"
                          className="btn-contador"
                          onClick={() => alterarQuantidadeRoupa(roupa.id, 'subtrair')}
                          disabled={quantidadeNoCesto === 0}
                        >
                          <FiMinus size={14} />
                        </button>
                        
                        <span className="numero-contador">{quantidadeNoCesto}</span>
                        
                        <button 
                          type="button"
                          className="btn-contador"
                          onClick={() => alterarQuantidadeRoupa(roupa.id, 'somar')}
                          disabled={totalPecasAtivas >= cestoAtivo.limiteMaximo}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. BOTÃO PONTILHADO PARA ADICIONAR NOVAS ROUPAS */}
              <button 
                className="btn-adicionar-roupa-larga" 
                onClick={() => setModoAdicionarRoupa(true)}
              >
                <FiPlus size={20} />
                <span>Adicionar roupa</span>
              </button>
            </>
          )}

        </div>
      </div>

      <div className="botoes-navegacao-footer">
        <button onClick={onVoltar} className="btn-navegacao-voltar">Voltar</button>
        <button 
          onClick={onAvancar} 
          className="btn-navegacao-avancar"
          disabled={cestos.reduce((acc, c) => acc + calcularTotalPecas(c), 0) === 0}
        >
          Ir para Pagamento
        </button>
      </div>
    </div>
  );
}