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
        <h3 className="timeline-event-title">Hackaton FADU - UBA</h3>
        <p className="timeline-description">
          400 estudiantes de diseño de la UBA crean la identidad visual y sistemas de señalización open source para que cualquier persona pueda identificar su "baldosa verde".          
        </p>
      </div>
    </div>
  );
};

export default LineaTiempo;