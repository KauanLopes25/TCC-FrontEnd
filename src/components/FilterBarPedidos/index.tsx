import React from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import './filterBarPedidos.css' // Vamos criar este CSS abaixo

interface FilterBarPedidosProps {
  valorBusca: string;
  aoMudarBusca: (valor: string) => void;
  statusAtivo: string | null; // 'andamento', 'entregue', 'cancelado' ou null
  aoMudarStatus: (status: string) => void;
  aoAbrirModalData: () => void;
  dataSelecionada: string | null; // Para mostrar se tem filtro de data ativo
}

export function FilterBarPedidos({
  valorBusca,
  aoMudarBusca,
  statusAtivo,
  aoMudarStatus,
  aoAbrirModalData,
  dataSelecionada
}: FilterBarPedidosProps) {

  // Facilita a renderização das classes ativas
  const getBotaoClass = (status: string) => {
    return statusAtivo === status ? 'btn-filtro-pedido ativo' : 'btn-filtro-pedido';
  };

  return (
    <div className="filter-bar-pedidos-container">
      
      {/* 1. INPUT DE BUSCA (Número do Pedido) */}
      <div className="search-input-wrapper">
        <FiSearch size={20} color="#999999" />
        <input
          type="text"
          placeholder="Buscar número do pedido (Ex: #1042)"
          value={valorBusca}
          onChange={(e) => aoMudarBusca(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 2. GRUPO DE FILTROS RÁPIDOS */}
      <div className="filtros-pedidos-grupo">
        <button 
          className={getBotaoClass('andamento')} 
          onClick={() => aoMudarStatus('andamento')}
        >
          Em andamento
        </button>
        <button 
          className={getBotaoClass('entregue')} 
          onClick={() => aoMudarStatus('entregue')}
        >
          Entregue
        </button>
        <button 
          className={getBotaoClass('cancelado')} 
          onClick={() => aoMudarStatus('cancelado')}
        >
          Cancelado
        </button>

        <div className="divisor-filtros"></div>

        {/* BOTÃO DO MODAL DE DATA */}
        <button 
          className={`btn-filtro-data ${dataSelecionada ? 'data-ativa' : ''}`}
          onClick={aoAbrirModalData}
        >
          <FiCalendar size={16} />
          {dataSelecionada ? dataSelecionada : 'Data'}
        </button>
      </div>

    </div>
  );
}