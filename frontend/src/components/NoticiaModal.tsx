import React, { useEffect } from 'react';
import type { Noticia } from '../data/noticias';
import './NoticiaModal.css';

interface NoticiaModalProps {
  noticia: Noticia;
  onClose: () => void;
}

const NoticiaModal: React.FC<NoticiaModalProps> = ({ noticia, onClose }) => {
  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <img src={noticia.imagen} alt={noticia.titulo} className="modal-imagen" />
        <div className="modal-body">
          <p className="modal-meta">{noticia.fecha} · {noticia.lectura}</p>
          <h2 className="modal-titulo">{noticia.titulo}</h2>
          <p className="modal-descripcion">{noticia.descripcion}</p>
          <div className="modal-cuerpo">
            {noticia.cuerpo.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticiaModal;
