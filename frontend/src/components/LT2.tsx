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
        <span className="timeline-year">2024</span>
        <h3 className="timeline-event-title">Encuentro en River Plate</h3>
        <p className="timeline-description">
          Juan Carr convoca a docentes y voluntarios en el Club River Plate para formalizar el proyecto. Se establece la meta de plantar 22 árboles por cada niño que nace.          
        </p>
      </div>
    </div>
  );
};

export default LineaTiempo;