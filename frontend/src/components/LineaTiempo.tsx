import React from 'react';
import './LineaTiempo.css';

const LineaTiempo: React.FC = () => {
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <div className="marker-dot">
          <div className="marker-inner-dot"></div>
        </div>
        <div className="marker-line"></div>
      </div>
      <div className="timeline-content">
        <span className="timeline-year">2023</span>
        <h3 className="timeline-event-title">El inicio de la "Ruta 33"</h3>
        <p className="timeline-description">
          Alumnos del Instituto América plantan 200 árboles nativos en Rivadavia, dando inicio a uno de los primeros tramos locales bajo la guía de Red Solidaria.
        </p>
      </div>
    </div>
  );
};

export default LineaTiempo;