// src/components/Header.tsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, usuario } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section" style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <img src="/svg/Logo.svg" alt="logo" />
          </div>
          <img className="logo-text" src="/svg/LogoFrase.svg" />
        </Link>

        <nav className="nav-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
          <NavLink to="/mapa" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Mapa</NavLink>
          <NavLink to="/newsletter" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Newsletter</NavLink>
          <NavLink to="/aportes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Aportes</NavLink>
          <NavLink to="/historia" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Historia</NavLink>
        </nav>

        <div className="auth-section">
          {isLoggedIn ? (
            <NavLink
              to="/perfil"
              className={({ isActive }) => `user-avatar-btn ${isActive ? 'active' : ''}`}
              aria-label="Ir a mi perfil"
            >
              {usuario?.fotoPerfil ? (
                <img
                  src={usuario.fotoPerfil}
                  alt={usuario.nombre}
                  className="user-avatar-img"
                />
              ) : (
                <svg
                  className="user-avatar-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
            </NavLink>
          ) : (
            <button
              className="user-anon-btn"
              onClick={() => navigate('/ingresar')}
              aria-label="Ingresar o registrarse"
            >
              <svg
                className="user-anon-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
