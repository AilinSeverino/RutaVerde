import React, { useState } from 'react';
import { noticias as noticiasEjemplo } from '../data/noticias';
import type { Noticia } from '../data/noticias';
import NoticiaModal from './NoticiaModal';
import './GrillaNews.css';

interface GrillaNewsProps {
  noticias?: Noticia[];
}

const GrillaNews: React.FC<GrillaNewsProps> = ({ noticias = noticiasEjemplo }) => {
  const [noticiaAbierta, setNoticiaAbierta] = useState<Noticia | null>(null);

  return (
    <>
      <section className="grilla-news">
        <div className="grilla-news-container">
          <h2 className="grilla-news-titulo">Más noticias</h2>
          <div className="grilla-news-grid">
            {noticias.length === 0 ? (
              <p>Todavía no hay noticias publicadas.</p>
            ) : noticias.map((noti) => (
              <article
                key={noti.id}
                className="grilla-card"
                onClick={() => setNoticiaAbierta(noti)}
              >
                <div className="grilla-card-img-wrap">
                  <img src={noti.imagen} alt={noti.titulo} className="grilla-card-img" />
                </div>
                <div className="grilla-card-body">
                  <p className="grilla-card-meta">{noti.fecha}</p>
                  <h3 className="grilla-card-titulo">{noti.titulo}</h3>
                  <p className="grilla-card-desc">{noti.descripcion}</p>
                  <span className="grilla-card-leer">Leer →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {noticiaAbierta && (
        <NoticiaModal
          noticia={noticiaAbierta}
          onClose={() => setNoticiaAbierta(null)}
        />
      )}
    </>
  );
};

export default GrillaNews;
