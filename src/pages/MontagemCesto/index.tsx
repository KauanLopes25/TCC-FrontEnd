import React, { useState } from 'react';
import { FiShoppingBag, FiPlus, FiMinus, FiX, FiTag, FiBox } from 'react-icons/fi';
// 1. Importando ícones específicos de roupas
import { FaTshirt, FaSocks } from 'react-icons/fa';
import { GiTrousers } from 'react-icons/gi'; 

import { useCesto } from '../../hooks/useCesto';
import './montagemCesto.css'; 

interface MontagemCestoProps {
  onVoltar: () => void;
  onAvancar: () => void;
}

// Catálogo simulando o que virá do Banco de Dados
const catalogoCompleto = [
  { id: 1, nome: 'Camiseta', cor: 'Branca', tipo: 'camisa' },
  { id: 2, nome: 'Calça', cor: 'Jeans Azul', tipo: 'calca' },
  { id: 3, nome: 'Cobertor', cor: 'Estampado', tipo: 'outro' },
  { id: 4, nome: 'Meias', cor: 'Colorida', tipo: 'meia' },
  { id: 5, nome: 'Bermuda', cor: 'Preta', tipo: 'calca' },
  { id: 6, nome: 'Saia', cor: 'Vermelha', tipo: 'calca' },
  { id: 7, nome: 'Camisa Polo', cor: 'Azul Escuro', tipo: 'camisa' },
  { id: 8, nome: 'Blusa de Frio', cor: 'Cinza', tipo: 'camisa' },
];

export function MontagemCesto({ onVoltar, onAvancar }: MontagemCestoProps) {
  const {
    cestos,
    idCestoAtivo,
    cestoAtivo,
    totalPecasAtivas,
    adicionarCesto,
    selecionarCesto,
    alterarQuantidadeRoupa,
    calcularTotalPecas,
    removerCesto
  } = useCesto();

  const [modoAdicionarRoupa, setModoAdicionarRoupa] = useState(false);

  // Selecionando as peças base para ficarem sempre visíveis
  const pecasBase = catalogoCompleto.filter(p => [1, 2, 3].includes(p.id));

  // Itens da Adição Rápida
  const itensRapidos = [
    { ...catalogoCompleto.find(c => c.id === 4)! }, // Meias
    { ...catalogoCompleto.find(c => c.id === 1)! }, // Camiseta
    { ...catalogoCompleto.find(c => c.id === 2)! }, // Calça
  ];

  const porcentagemProgresso = (totalPecasAtivas / cestoAtivo.limiteMaximo) * 100;
  const cestoVazioGlobal = cestos.reduce((acc, c) => acc + calcularTotalPecas(c), 0) === 0;

  // LÓGICA DE OURO: Junta as peças base com as roupas extras que o usuário adicionou pelo catálogo
  const itensExtrasNoCesto = Object.keys(cestoAtivo.itens)
    .map(Number)
    .filter(id => cestoAtivo.itens[id] > 0 && !pecasBase.find(p => p.id === id))
    .map(id => catalogoCompleto.find(c => c.id === id)!);

  const listaParaExibir = [...pecasBase, ...itensExtrasNoCesto];

  // Função para renderizar o ícone de acordo com o tipo da roupa
  const renderIcone = (tipo: string) => {
    switch(tipo) {
      case 'camisa': return <FaTshirt size={24} />;
      case 'calca': return <GiTrousers size={24} />;
      case 'meia': return <FaSocks size={24} />;
      default: return <FiBox size={24} />;
    }
  };

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
                  setModoAdicionarRoupa(false); 
                }}
              >
                {cestos.length > 1 && (
                  <button 
                    type="button"
                    className="btn-remover-cesto"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      removerCesto(cesto.id);
                    }}
                  >
                    <FiX size={12} />
                  </button>
                )}

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

        <div className="secao-detalhes-cesto-ativo">
          
          {modoAdicionarRoupa ? (
            
            // ==========================================
            // TELA DO CATÁLOGO DE ROUPAS
            // ==========================================
            <div className="area-nova-roupa">
              <div className="header-catalogo">
                <div>
                  <h4>Catálogo de Roupas</h4>
                  <p>Adicionando ao Cesto {cestos.findIndex(c => c.id === idCestoAtivo) + 1}</p>
                </div>
                <button 
                  className="btn-fechar-catalogo" 
                  onClick={() => setModoAdicionarRoupa(false)}
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid-catalogo-roupas">
                {catalogoCompleto.map((item) => (
                  <div key={item.id} className={`card-catalogo-item ${totalPecasAtivas >= cestoAtivo.limiteMaximo ? 'desativado' : ''}`}>
                    <div className="icone-catalogo-wrapper">
                      {renderIcone(item.tipo)}
                    </div>
                    
                    <div className="info-catalogo-roupa">
                      <span className="nome-catalogo-roupa">{item.nome}</span>
                      <span className="cor-catalogo-roupa">{item.cor}</span>
                    </div>

                    <button 
                      className="btn-add-catalogo-roupa"
                      disabled={totalPecasAtivas >= cestoAtivo.limiteMaximo}
                      onClick={() => {
                        alterarQuantidadeRoupa(item.id, 'somar');
                        setModoAdicionarRoupa(false); // Dispara a roupa e volta pra tela inicial
                      }}
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ) : (
            
            // ==========================================
            // TELA INICIAL DO CESTO
            // ==========================================
            <>
              <h4>Itens no Cesto {cestos.findIndex(c => c.id === idCestoAtivo) + 1}</h4>

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
              
              <div className="lista-selecao-roupas">
                {/* Agora usamos a lista unificada (Base + Extras que o usuário escolheu) */}
                {listaParaExibir.map((roupa) => {
                  const quantidadeNoCesto = cestoAtivo.itens[roupa.id] || 0;

                  return (
                    <div key={roupa.id} className="linha-roupa-seletor">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="nome-roupa-peca">{roupa.nome}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{roupa.cor}</span>
                      </div>
                      
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

              <div className="secao-adicionar-rapido">
                <span className="titulo-secao-rapida">Adicionar rápido</span>
                <div className="grid-itens-rapidos">
                  {itensRapidos.map((item, i) => (
                    <div 
                      key={i} 
                      className={`card-item-rapido ${totalPecasAtivas >= cestoAtivo.limiteMaximo ? 'desativado' : ''}`}
                      onClick={() => {
                        if (totalPecasAtivas < cestoAtivo.limiteMaximo) {
                          alterarQuantidadeRoupa(item.id, 'somar');
                        }
                      }}
                    >
                      <div className="icone-rapido-wrapper">
                        {renderIcone(item.tipo)}
                      </div>
                      <div className="textos-rapidos">
                        <span className="nome-rapido">{item.nome}</span>
                        <span className="detalhe-rapido">{item.cor}</span>
                      </div>
                      <div className="btn-add-rapido">
                        <FiPlus size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="btn-adicionar-roupa-larga" 
                onClick={() => setModoAdicionarRoupa(true)}
              >
                <FiPlus size={20} />
                <span>Ver todas as roupas</span>
              </button>
            </>
          )}

        </div>

        <div className="footer-interno-cesto">
          <button onClick={onVoltar} className="btn-voltar-interno">Voltar etapa</button>
          <button 
            onClick={onAvancar} 
            className="btn-confirmar-cesto"
            disabled={cestoVazioGlobal}
          >
            Confirmar cesto
          </button>
        </div>

      </div>

    </div>
  );
}