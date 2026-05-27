import { Header } from '../../components/Header';
import { Background } from '../../components/Background';
import './welcome.css';
import { CarrosselLateral } from '../../components/CarrosselLateral';
import img1 from '../../assets/images/Maquina de lavar.png'
import img2 from '../../assets/images/hero.png';
import img3 from '../../assets/images/Maquina de lavar.png';

export function Welcome() {

    const minhasImagens = [
    img1, img2, img3
  ];
  return (
    <div className="welcome-page">
      <Header />
      
      <main className="hero-section">
        <div className="hero-content">
          <h1>SEMPRELIMPA <br/></h1>
          <p>
            Está sem tempo para lavar roupa?
          </p>
          <p>
            Deixe com a gente! Coletamos, lavamos e entregamos sua roupa limpinha na sua porta.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Conhecer Serviços</button>
            <button className="btn-secondary">Ver Unidades</button>
          </div>
        </div>

        <div className="hero-image">
         <CarrosselLateral imagens={minhasImagens}></CarrosselLateral>
        </div>
      </main>

      {/* <section id="servicos" className="info-section">
        <h2>Nossos Serviços</h2>
        <div className="services-grid">
            <div className="service-card">Lavagem Seca</div>
            <div className="service-card">Passadoria</div>
            <div className="service-card">Delivery</div>
        </div>
      </section> */}
    </div>
  );
}