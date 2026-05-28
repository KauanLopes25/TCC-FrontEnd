import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCarrossel } from '../../hooks/useCarrossel';
import './carrossel.css';

interface CarrosselLateralProps {
  imagens: string[];
}

export function CarrosselLateral({ imagens }: CarrosselLateralProps) {
  const { imagemAtiva, proximaImagem, imagemAnterior, setImagemAtiva } = useCarrossel(imagens.length);

  return (
    <div className="carrossel-container">
      
      <div 
        className="carrossel-track" 
        style={{ transform: `translateX(-${imagemAtiva * 100}%)` }}
      >
        {imagens.map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index}`} className="carrossel-slide" />
        ))}
      </div>

      {/* Setas de Navegação */}
      <button className="carrossel-btn left" onClick={imagemAnterior}>
        <FiChevronLeft size={24} />
      </button>
      <button className="carrossel-btn right" onClick={proximaImagem}>
        <FiChevronRight size={24} />
      </button>

      {/* Bolinhas (Dots) indicadoras na parte de baixo */}
      <div className="carrossel-dots">
        {imagens.map((_, index) => (
          <button 
            key={index}
            className={`dot ${imagemAtiva === index ? 'active' : ''}`}
            onClick={() => setImagemAtiva(index)}
          />
        ))}
      </div>
    </div>
  );
}