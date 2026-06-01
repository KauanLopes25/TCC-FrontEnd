import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Background } from '../../components/Background'; // Importe o seu componente
import './styles.css';

export function DashboardLayout() {
  return (
    // 1. Envelopamos tudo com o seu Background
    <Background>
      
      <div className="dashboard-layout">
        <Sidebar />
        
        {/* 2. O PULO DO GATO: Removemos o backgroundColor cinza daqui! */}
        <main className="dashboard-content" style={{ padding: 0, backgroundColor: 'transparent' }}>
          
          <Outlet />

        </main>
      </div>
      
    </Background>
  );
}