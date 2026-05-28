import { useNavigate } from 'react-router-dom';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

// Dados e Textos
import { textosWelcome } from '../../utils/textosWelcome';

// Componentes
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CarrosselLateral } from '../../components/CarrosselLateral';
import { Button } from '../../components/Button';
import { ServiceCard } from '../../components/ServiceCard';

// Ícones e Estilos
import { MdCheckCircle } from 'react-icons/md';
import './welcome.css';

// Imagens
import img1 from '../../assets/images/Maquina de lavar.png';
import img2 from '../../assets/images/hero.png';
import img3 from '../../assets/images/Maquina de lavar.png';

const IMAGENS_CARROSSEL = [img1, img2, img3];

export function Welcome() {
  const navigate = useNavigate();
  const { rolarPara } = useSmoothScroll();
  const t = textosWelcome; 

  return (
    <div className="welcome-page">
      <Header />
      
      <main className="hero-section">
        <div className="hero-content">
          <h1>{t.hero.titulo} <br/></h1>
          <p>{t.hero.subtitulo}</p>
          <p>{t.hero.descricao}</p>
          
          <div className="hero-btns">
            <Button variant="primary" onClick={() => navigate('/login')}>
              {t.hero.btnPrimario}
            </Button>
            <Button variant="secondary" onClick={() => rolarPara('servicos')}>
              {t.hero.btnSecundario}
            </Button>
          </div>
          
          <div className="hero-stats">
            {t.estatisticas.map((stat, index) => (
              <div key={stat.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="stat-item">
                  <h3>{stat.valor}</h3>
                  <p>{stat.texto}</p>
                </div>
                {index !== t.estatisticas.length - 1 && <div className="stat-divider"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image">
         <CarrosselLateral imagens={IMAGENS_CARROSSEL} />
        </div>
      </main>

      <section id="servicos" className="info-section">
       <div className="section-header">
          <span className="badge-azul">{t.comoFunciona.badge}</span>
          <h2>{t.comoFunciona.titulo}</h2>
          <p>{t.comoFunciona.subtitulo}</p>
        </div>
        
        <div className="services-grid">
          {t.comoFunciona.passos.map((passo) => (
            <ServiceCard 
              key={passo.id}
              numero={passo.id}
              icone={passo.icone}
              titulo={passo.titulo}
              descricao={passo.desc}
            />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-image-wrapper">
          <div className="mission-image-container">
            <img src={img2} alt="Nossa missão" className="mission-img" />
            
            <div className="review-card-overlay">
              <div className="stars">{t.missao.review.estrelas}</div>
              <p>{t.missao.review.texto}</p>
              <span className="review-author">{t.missao.review.autor}</span>
            </div>
          </div>
        </div>

        <div className="mission-content">
          <span className="badge-azul">{t.missao.badge}</span>
          <h2>{t.missao.titulo}</h2>
          
          {t.missao.paragrafos.map((paragrafo, index) => (
            <p key={index}>{paragrafo}</p>
          ))}

          <ul className="mission-checklist">
            {t.missao.checklist.map((item, index) => (
              <li key={index}>
                <MdCheckCircle className="check-icon" /> {item}
              </li>
            ))}
          </ul>

          <div className="mission-btns">
            <Button variant="primary" onClick={() => navigate('/login')}>
              {t.missao.btnPrimario}
            </Button>
            <Button variant="secondary" onClick={() => rolarPara('contato')}>
              {t.missao.btnSecundario}
            </Button>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}