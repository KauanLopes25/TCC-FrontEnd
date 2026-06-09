import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiPlus, FiMinus, FiX, FiBox } from 'react-icons/fi';
import { FaTshirt, FaSocks } from 'react-icons/fa';
import { GiTrousers } from 'react-icons/gi'; 

import { useCesto } from '../../hooks/useCesto';
import './montagemCesto.css'; 

interface MontagemCestoProps {
  onVoltar: () => void;
  onAvancar: (dadosDoCesto: any) => void;
}

export function MontagemCesto({ onVoltar, onAvancar }: MontagemCestoProps) {
  // 1. Puxando TUDO do nosso hook integrado
  const {
    cestos,
    idCestoAtivo,
    cestoAtivo,
    totalPecasAtivas,
    adicionarCesto,
    filtroCategoria,
    setFiltroCategoria,
    selecionarCesto,
    alterarQuantidadeRoupa,
    calcularTotalPecas,
    removerCesto,
    catalogoCompleto, 
    carregandoCatalogo,
    carregarRoupas,
    gerarPayloadDoPedido 
  } = useCesto();

  // 2. Estados LOCAIS da tela
  const [modoAdicionarRoupa, setModoAdicionarRoupa] = useState(false);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCor, setFiltroCor] = useState<string>('Todas');

  // 3. Dispara a busca das roupas na API assim que a tela abre
  useEffect(() => {
    carregarRoupas();
  }, [carregarRoupas]);

  const porcentagemProgresso = (totalPecasAtivas / cestoAtivo.limiteMaximo) * 100;
  const cestoVazioGlobal = cestos.reduce((acc, c) => acc + calcularTotalPecas(c), 0) === 0;

  // Lógica Segura: Usamos fk_roupas_id (o número real) e fixamos a cor 'Branca' para a visualização base
  const pecasBase = catalogoCompleto.filter(p => [1, 2, 3].includes(p.fk_roupas_id) && p.cor === 'Branca');

  // Lógica Segura: Itens da Adição Rápida
  const itensRapidos = catalogoCompleto
    .filter(c => [4, 1, 2].includes(c.fk_roupas_id) && c.cor === 'Branca') 
    .slice(0, 3); 

  // Lógica de Ouro: A chave agora é String ("1-branca"). 
  const itensExtrasNoCesto = Object.keys(cestoAtivo.itens)
    .filter(key => cestoAtivo.itens[key] > 0 && !pecasBase.find(p => p.id === key))
    .map(key => catalogoCompleto.find(c => c.id === key))
    .filter(Boolean) as any[]; 

  const listaParaExibir = [...pecasBase, ...itensExtrasNoCesto];

  const renderIcone = (nomeRoupa: string) => {
    if (!nomeRoupa) return <FiBox size={24} />;
    
    const nome = nomeRoupa.toLowerCase();
    
    if (nome.includes('camisa') || nome.includes('blusa') || nome.includes('jaqueta') || nome.includes('casaco') || nome.includes('camiseta') || nome.includes('moletom')) {
      return <FaTshirt size={24} />;
    }
    if (nome.includes('calça') || nome.includes('calca') || nome.includes('bermuda') || nome.includes('short') || nome.includes('saia')) {
      return <GiTrousers size={24} />;
    }
    if (nome.includes('meia')) {
      return <FaSocks size={24} />;
    }
    
    return <FiBox size={24} />; 
  };

  // Filtra o catálogo com base no texto digitado e na cor selecionada
// Filtra o catálogo com base no texto e na CATEGORIA selecionada
  const catalogoFiltrado = catalogoCompleto.filter((item) => {
    const bateTexto = item.nome.toLowerCase().includes(buscaTexto.toLowerCase());
    
    // Agora validamos a propriedade item.categoria que criamos no hook
    const bateCategoria = filtroCategoria === 'Todas' || item.categoria === filtroCategoria;
    
    return bateTexto && bateCategoria;
  });

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
          
          {carregandoCatalogo ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              <p>Carregando catálogo de roupas...</p>
            </div>
          ) : modoAdicionarRoupa ? (
            
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

              {/* AQUI ENTRA A NOSSA BARRA DE FILTROS */}
              <div className="filtros-catalogo" style={{ marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Buscar peça (ex: Camiseta, Calça)..." 
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
                />
                
               <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {['Todas', 'Superior', 'Inferior', 'Acessórios', 'Outros'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFiltroCategoria(cat)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: '1px solid #007bff',
                        background: filtroCategoria === cat ? '#007bff' : 'transparent',
                        color: filtroCategoria === cat ? '#fff' : '#007bff',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-catalogo-roupas">
                {catalogoFiltrado.map((item) => (
                  <div key={item.id} className={`card-catalogo-item ${totalPecasAtivas >= cestoAtivo.limiteMaximo ? 'desativado' : ''}`}>
                    <div className="icone-catalogo-wrapper" style={{ color: item.corHex }}>
                      {renderIcone(item.nome)}
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
                        setModoAdicionarRoupa(false); 
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

              {/* Seção Adicionar Rápido */}
              {itensRapidos.length > 0 && (
                <div className="secao-adicionar-rapido">
                  <span className="titulo-secao-rapida">Adicionar rápido</span>
                  <div className="grid-itens-rapidos">
                    {itensRapidos.map((item) => (
                      <div 
                        key={item.id} 
                        className={`card-item-rapido ${totalPecasAtivas >= cestoAtivo.limiteMaximo ? 'desativado' : ''}`}
                        onClick={() => {
                          if (totalPecasAtivas < cestoAtivo.limiteMaximo) {
                            alterarQuantidadeRoupa(item.id, 'somar');
                          }
                        }}
                      >
                        {/* Correção do ícone e cor no item rápido! */}
                        <div className="icone-rapido-wrapper" style={{ color: item.corHex }}>
                          {renderIcone(item.nome)}
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
              )}

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
            onClick={() => {
              const pacoteDeDados = gerarPayloadDoPedido();
              onAvancar(pacoteDeDados);
            }} 
            className="btn-confirmar-cesto"
            disabled={cestoVazioGlobal || carregandoCatalogo}
          >
            Confirmar cesto
          </button>
        </div>

      </div>
    </div>
  );
}