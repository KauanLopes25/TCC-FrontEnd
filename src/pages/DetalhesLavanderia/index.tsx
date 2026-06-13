import React from 'react';
import { useLavanderiaDetalhes } from '../../hooks/useDetalhesLavanderia';
import { BackButton } from '../../components/BackButton';
import { FilterBar } from '../../components/FilterBar';
import { FiMapPin, FiClock, FiInfo, FiDroplet, FiWind } from 'react-icons/fi';

import './DetalhesLavanderia.css'; 

interface DetalhesLavanderiaProps {
  idLavanderia: number | null;
  onVoltar: () => void;
  onAvancar: () => void;
}

export function DetalhesLavanderia({ idLavanderia, onVoltar, onAvancar }: DetalhesLavanderiaProps) {
  const { dados, carregando, erro } = useLavanderiaDetalhes(idLavanderia);

  if (carregando) return <p style={{ textAlign: 'center', padding: '40px' }}>Carregando detalhes da lavanderia...</p>;
  if (erro) return <p style={{ textAlign: 'center', color: 'red' }}>{erro}</p>;
  if (!dados) return null;

  return (
    <div className="detalhes-container">
      
      <div className="conteudo-principal-lavanderia">
        
        <div className="header-actions-row">
          <BackButton onClick={onVoltar} /> 
          
          <div className="filtros-bloqueados-wrapper">
            <FilterBar 
              valorBusca={dados.cidade || ''} 
              aoMudarBusca={() => {}} 
              filtrosAtivos={[]} 
              aoClicarFiltro={() => {}} 
            />
          </div>
        </div>

        {/* 1. BANNER FIXO: Imagem de alta qualidade de uma lavanderia */}
        <div 
          className="banner-lavanderia" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>
        
        <div className="perfil-row">
          <img 
            src={dados.foto_url || dados.logo || 'https://via.placeholder.com/150?text=Sem+Foto'} 
            alt={dados.nome} 
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} 
          />
          <div className="titulo-info">
            <h2>{dados.nome}</h2>
            <span className="avaliacao">⭐ {dados.media_avaliacao || '0'}</span>
          </div>
        </div>

        <div className="cards-layout">
          
          <div className="cards-top-row">
            
            <div className="card-principal flex-row">
              
              <div className="metade-card">
                <div className="header-card-icone">
                  <div className="icone-quadrado">
                    <FiMapPin size={22} color="#3ba1f2" />
                  </div>
                  <div className="titulos-wrapper">
                    <h3>Localização</h3>
                    <span className="subtitle">endereço e área de atendimento</span>
                  </div>
                </div>
                
                <div className="dados-view compactado">
                  <p className="destaque-logradouro">{dados.logradouro}{dados.numero && `, ${dados.numero}`}</p>
                  <p>{dados.bairro} - {dados.cidade}/{dados.uf} {dados.complemento && ` - ${dados.complemento}`}</p>
                  <p>CEP: {dados.cep}</p>
                </div>
              </div>

              <div className="divisor-vertical"></div>

              <div className="metade-card">
                <div className="header-card-icone">
                  <div className="icone-quadrado">
                    <FiClock size={22} color="#3ba1f2" />
                  </div>
                  <div className="titulos-wrapper">
                    <h3>Tempo estimado</h3>
                    <span className="subtitle">coleta+lavagem+devolução</span>
                  </div>
                </div>
                
                <div className="dados-view centralizado-vertical">
                  <p className="tempo-destaque">{dados.tempo_padrao_lavagem} min</p>
                </div>
              </div>
            </div>

            <div className="card-principal">
              <div className="header-card-icone margin-bottom-fix">
                <div className="icone-quadrado">
                  <FiInfo size={22} color="#3ba1f2" />
                </div>
                <div className="titulos-wrapper">
                  <h3>Sobre a Lavanderia</h3>
                  <span className="subtitle">mensagem do estabelecimento</span>
                </div>
              </div>
              <div className="dados-view sobre-texto compactado">
                <p>{dados.descricao || 'Nenhuma mensagem informada pela lavanderia.'}</p>
              </div>
            </div>

          </div>

          {/* 2. NOVO LAYOUT DA PARTE INFERIOR: Mapa Interativo Falso + Preços */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'stretch' }}>
            
            {/* O MAPA: Iframe do Google Maps centralizado na região */}
            <div style={{ flex: 1.5, borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', minHeight: '200px', backgroundColor: '#f1f5f9' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14631.545809714896!2d-46.9069811!3d-23.536561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf06b3a0172e9d%3A0xcb99211c4794101e!2sJandira%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1716500000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Atendimento"
              ></iframe>
            </div>

            {/* OS CARDS DE SERVIÇO: Agrupados na direita */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card-pequeno" style={{ margin: 0 }}>
                <div className="header-card-icone-pequeno">
                  <FiDroplet size={18} color="#3ba1f2" />
                  <h4>Lavagem</h4>
                </div>
                <p className="preco-texto">R$ {Number(dados.preco_padrao_lavagem || 0).toFixed(2)}</p>
                <p className="tempo-texto">Tempo: {dados.tempo_padrao_lavagem} min</p>
              </div>

              <div className="card-pequeno" style={{ margin: 0 }}>
                <div className="header-card-icone-pequeno">
                  <FiWind size={18} color="#3ba1f2" />
                  <h4>Secagem</h4>
                </div>
                <p className="preco-texto">R$ {Number(dados.preco_padrao_secagem || 0).toFixed(2)}</p>
                <p className="tempo-texto">Tempo: {dados.tempo_secagem} min</p>
              </div>
            </div>

          </div>

        </div>

        <div className="footer-acoes">
          <button className="btn-solicitar-grande" onClick={onAvancar}>
            Solicitar nova entrega
          </button>
        </div>

      </div>
    </div>
  );
}