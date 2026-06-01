import { Background } from '../../components/Background';
import { Sidebar } from '../../components/Sidebar';
import './home.css';

export function Home() {
  return (
    <Background>
      
      {/* LADO DIREITO: O Conteúdo Dinâmico */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Olá, Guilherme! 👋</h1>
          <p>Acompanhe suas lavagens e histórico de pedidos.</p>
        </header>

        {/* Aqui dentro colocaremos os cards de total e a lista de recentes logo em seguida */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #ccc' }}>
          <p style={{ textAlign: 'center', color: '#888' }}>Área reservada para os 3 últimos pedidos</p>
        </div>

      </main>
    </Background>
  );
}