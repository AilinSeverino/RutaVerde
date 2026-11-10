import React from 'react';
import './Noticia.css';

interface NoticiaProps {
  imagen: string;
  titulo: string;
  enlace: string;
  onClick?: () => void;
}

const Noticia: React.FC<NoticiaProps> = ({ imagen, titulo, enlace, onClick }) => {
  return (
    <article className="noticia-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="noticia-image-container">
        <img src={imagen} alt={titulo} className="noticia-image" />
      </div>
      <div className="noticia-content">
        <h3 className="noticia-title">{titulo}</h3>
        <a
          href={enlace}
          className="noticia-link"
          onClick={(e) => { if (onClick) e.preventDefault(); }}
        >
          Leer más <span className="arrow">→</span>
        </a>
      </div>
    </article>
  );
};

export default Noticia;