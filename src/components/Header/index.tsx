import { Link } from 'react-router-dom';
import { MdLocalLaundryService } from 'react-icons/md';
import './styles.css';

export function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <MdLocalLaundryService size={32} color="#3ba1f2" />
          <h1>SempreLimpa</h1>
        </div>

        <nav className="nav-menu">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/cadastro" className="btn-signup">Cadastre-se</Link>
        </div>
      </div>
    </header>
  );
}