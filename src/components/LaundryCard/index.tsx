import { MdStar, MdFavoriteBorder, MdFavorite, MdLocationOn } from 'react-icons/md';
import './laundryCard.css';

interface LaundryCardProps {
  id: number;
  nome: string;
  bairro: string;
  cidade: string;
  avaliacao: number;
  isFavorito: boolean;
  onAlternarFavorito: (id: number) => void;
  onSelecionar: (id: number) => void;
}

export function LaundryCard({ 
  id, 
  nome, 
  bairro, 
  cidade, 
  avaliacao, 
  isFavorito, 
  onAlternarFavorito,
  onSelecionar 
}: LaundryCardProps) {
  
  return (
    // O container principal é clicável para selecionar a lavanderia
    <div className="laundry-card" onClick={() => onSelecionar(id)}>
      
      {/* Lado Esquerdo: Informações */}
      <div className="laundry-info">
        <h3 className="laundry-name">{nome}</h3>
        
        <div className="laundry-location">
          <MdLocationOn className="location-icon" />
          <span>{bairro}, {cidade}</span>
        </div>

        <div className="laundry-rating">
          <MdStar className="star-icon" />
          <span>{avaliacao.toFixed(1)}</span>
        </div>
      </div>

      {/* Lado Direito: Botão de Favorito 
          O e.stopPropagation() impede que clicar no coração selecione a lavanderia e avance a tela */}
      <button 
        className={`heart-button ${isFavorito ? 'favorited' : ''}`}
        onClick={(e) => {
          e.stopPropagation(); 
          onAlternarFavorito(id);
        }}
      >
        {isFavorito ? <MdFavorite /> : <MdFavoriteBorder />}
      </button>

    </div>
  );
}