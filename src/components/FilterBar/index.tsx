

import { MdSearch, MdOutlineAttachMoney, MdOutlinePlace, MdOutlineStarBorder, MdFavoriteBorder } from 'react-icons/md';
import './filterBar.css';

interface FilterBarProps {
  valorBusca: string;
  aoMudarBusca: (texto: string) => void;
  
  // MUDANÇA 3: A interface agora exige um Array de strings
  filtrosAtivos: string[]; 
  
  aoClicarFiltro: (nomeDoFiltro: string) => void;
}

export function FilterBar({ 
  valorBusca, 
  aoMudarBusca, 
  filtrosAtivos, // Recebendo o Array
  aoClicarFiltro 
}: FilterBarProps) {
  
  const renderizarBotaoFiltro = (nome: string, label: string, Icone: any) => {
    
    // MUDANÇA 4: O botão fica azul se o nome dele existir dentro do Array
    const isAtivo = filtrosAtivos.includes(nome);
    
    return (
      <button 
        className={`filter-chip ${isAtivo ? 'active' : ''}`}
        onClick={() => aoClicarFiltro(nome)}
      >
        <Icone className="filter-icon" />
        {label}
      </button>
    );
  };

  return (
    <div className="filter-bar-container">
      
      {/* 1. O INPUT DE BUSCA */}
      <div className="search-wrapper">
        <MdSearch className="search-icon" />
        <input 
          type="text" 
          className="search-input"
          placeholder="Buscar lavanderia por nome..." 
          value={valorBusca}
          onChange={(e) => aoMudarBusca(e.target.value)}
        />
      </div>

      {/* 2. OS BOTÕES DE FILTRO (Scrolláveis no mobile) */}
      <div className="filter-chips-wrapper">
        {renderizarBotaoFiltro('preco', 'Preço', MdOutlineAttachMoney)}
        {renderizarBotaoFiltro('distancia', 'Distância', MdOutlinePlace)}
        {renderizarBotaoFiltro('avaliacao', 'Avaliação', MdOutlineStarBorder)}
        {renderizarBotaoFiltro('favoritos', 'Favoritos', MdFavoriteBorder)}
      </div>

    </div>
  );
}