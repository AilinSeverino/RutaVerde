import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="inicio">
      <div className="inicio-container">
        <div className="inicio-content">
          <p className="inicio-subtitle">Iniciativa ·{' '}
            <a href="https://www.instagram.com/redsolidaria/" target="_blank" rel="noopener noreferrer" className="inicio-subtitle-link">Red Solidaria</a>
          </p>
          <h1 className="inicio-title">Tu guía para plantar el cambio</h1>
          <p className="inicio-description">
            Conectamos comunidades para crear un corredor biológico a lo largo del continente con especies nativas.
          </p>
          <p className="inicio-description">
            Cada aporte cuenta: subí tu baldosa verde en la pestaña Aportes y sumá un tramo al corredor para combatir el cambio climático.
          </p>
          <div className="inicio-botones">
            <button className="btn-explorar" onClick={() => navigate('/mapa')}>Explorar mapa</button>
            <button className="btn-explorar" onClick={() => navigate('/aportes')}>Sumá tu aporte</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inicio;
