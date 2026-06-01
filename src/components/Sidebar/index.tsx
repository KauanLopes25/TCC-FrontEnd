import { NavLink } from 'react-router-dom';
import { MdHomeFilled, MdLocalLaundryService, MdReceiptLong, MdPerson } from 'react-icons/md';
import './sidebar.css';

export function Sidebar() {
  // No futuro, puxaremos isso do AuthContext que conversamos
  const usuarioFalso = {
    nome: "Guilherme Viana",
    email: "guilherme@email.com",
    foto: "https://ui-avatars.com/api/?name=Guilherme+Viana&background=3ba1f2&color=fff"
  };

  return (
    <aside className="sidebar-container">
      
      {/* 1. TOPO: Título da Plataforma */}
      <div className="sidebar-header">
        <h2>Sempre Limpa</h2>
      </div>

      {/* 2. MEIO: Navegação (O NavLink cuida do 'estaAtivo' sozinho) */}
      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdHomeFilled className="nav-icon" />
          <span>Início</span>
        </NavLink>

        <NavLink to="/lavanderias" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdLocalLaundryService className="nav-icon" />
          <span>Lavanderias</span>
        </NavLink>

        <NavLink to="/pedidos" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdReceiptLong className="nav-icon" />
          <span>Pedidos</span>
        </NavLink>

        <NavLink to="/perfil" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdPerson className="nav-icon" />
          <span>Perfil</span>
        </NavLink>
      </nav>

      {/* 3. BASE: Perfil do Usuário */}
      <div className="sidebar-footer">
        <div className="profile-info">
          <img src={usuarioFalso.foto} alt="Foto de perfil" className="profile-avatar" />
          <div className="profile-text">
            <span className="profile-name">{usuarioFalso.nome}</span>
            <span className="profile-email">{usuarioFalso.email}</span>
          </div>
        </div>
      </div>

    </aside>
  );
}