import React from 'react';
import './MapaInteractivo.css';
import Mapa from './Mapa';

const MapaInteractivo: React.FC = () => {
  return (
    <section className="mapa-interactivo">
      <div className="mapa-container">
        <div className="mapa-header">
          <h2 className="mapa-title">Mapa interactivo</h2>
          <p className="mapa-subtitle">
            Visualizá dónde se realizan plantaciones y cómo podés participar.
          </p>
        </div>

        <div className="map-visual">
          <Mapa />
        </div>
      </div>
    </section>
  );
};

export default MapaInteractivo;