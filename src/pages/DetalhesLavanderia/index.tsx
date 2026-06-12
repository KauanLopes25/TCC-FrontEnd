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

        <div className="banner-lavanderia" style={{ backgroundImage: `url('/capa-padrao.jpg')` }}></div>
        
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

          <div className="cards-bottom-row">
            
            <div className="card-pequeno">
              <div className="header-card-icone-pequeno">
                <FiDroplet size={18} color="#3ba1f2" />
                <h4>Lavagem</h4>
              </div>
              <p className="preco-texto">R$ {Number(dados.preco_padrao_lavagem || 0).toFixed(2)}</p>
              <p className="tempo-texto">Tempo: {dados.tempo_padrao_lavagem} min</p>
            </div>

            <div className="card-pequeno">
              <div className="header-card-icone-pequeno">
                <FiWind size={18} color="#3ba1f2" />
                <h4>Secagem</h4>
              </div>
              <p className="preco-texto">R$ {Number(dados.preco_padrao_secagem || 0).toFixed(2)}</p>
              <p className="tempo-texto">Tempo: {dados.tempo_secagem} min</p>
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