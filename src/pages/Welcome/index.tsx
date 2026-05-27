import { Header } from '../../components/Header';
import { Background } from '../../components/Background';
import './welcome.css';

export function Welcome() {
  return (
    <div className="welcome-page">
      <Header />
      
      <main className="hero-section">
        <div className="hero-content">
          <h1>Sua roupa limpa, <br/><span>sem esforço.</span></h1>
          <p>
            A plataforma que conecta você à lavanderia ideal. 
            Praticidade, qualidade e rapidez em um só lugar.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Conhecer Serviços</button>
            <button className="btn-secondary">Ver Unidades</button>
          </div>
        </div>

        <div className="hero-image">
          {/* Pode usar a mesma imagem da máquina ou uma ilustração */}
          <img src="/assets/maquina.jpg" alt="Máquina de lavar moderna" />
        </div>
      </main>

      <section id="servicos" className="info-section">
        <h2>Nossos Serviços</h2>
        <div className="services-grid">
            <div className="service-card">Lavagem Seca</div>
            <div className="service-card">Passadoria</div>
            <div className="service-card">Delivery</div>
        </div>
      </section>
    </div>
  );
}