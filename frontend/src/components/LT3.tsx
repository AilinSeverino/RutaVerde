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
        <span className="timeline-year">2025</span>
        <h3 className="timeline-event-title">Inauguración Reserva El Potrero</h3>
        <p className="timeline-description">
          Se inaugura una "baldosa" clave en Gualeguaychú con la plantación de 710 árboles nativos, consolidando el corredor biológico en el litoral argentino.          
        </p>
      </div>
    </div>
  );
};

export default LineaTiempo;