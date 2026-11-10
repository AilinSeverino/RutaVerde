import React from 'react';
import './HistoLand.css';

const HistoLand: React.FC = () => {
  return (
    <section className="histoland">
      <div className="histoland-container">
        <h2 className="histoland-title">Nuestra historia</h2>
        <p className="histoland-description">
          Ruta Verde es una iniciativa de la{' '}
          <a href="https://www.instagram.com/redsolidaria/" target="_blank" rel="noopener noreferrer" className="histoland-link">Red Solidaria</a>
          {' '}que busca movilizar a la comunidad para crear un corredor biológico a lo largo del continente.
        </p>
        
      </div>
    </section>
  );
};

export default HistoLand;