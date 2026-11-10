import React from 'react';
import './Estadisticas.css';

const Estadisticas: React.FC = () => {
  const stats = [
    { numero: '104+', label: 'Colaboradores' },
    { numero: '10+', label: 'Provincias' },
    { numero: '8+', label: 'Ecorregiones' },
    { numero: '8+', label: 'Ecorregiones' },
    { numero: '5+', label: 'Países' }
  ];

  return (
    <section className="estadisticas">
      <div className="estadisticas-container">
        {stats.map((stat, index) => (
          <div key={index} className="estadistica-item">
            <span className="estadistica-numero">{stat.numero}</span>
            <span className="estadistica-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Estadisticas;