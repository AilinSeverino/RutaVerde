import React, { useState } from 'react';
import { noticias as noticiasEjemplo } from '../data/noticias';
import type { Noticia } from '../data/noticias';
import NoticiaModal from './NoticiaModal';
import './InicioNews.css';

interface InicioNewsProps {
  noticias?: Noticia[];
}

const InicioNews: React.FC<InicioNewsProps> = ({ noticias = noticiasEjemplo }) => {
  const destacada = noticias[0];
  const [abierta, setAbierta] = useState(false);

  if (!destacada) return null;

  return (
    <>
      <section className="inicio-news">
        <div className="inicio-news-container">
          <div className="inicio-news-content">
            <p className="inicio-news-badge">DESTACADA</p>
            <h1 className="inicio-news-title">{destacada.titulo}</h1>
            <p className="inicio-news-description">{destacada.descripcion}</p>
            <p className="inicio-news-meta">{destacada.fecha} · {destacada.lectura}</p>
            <button className="btn-leer-nota" onClick={() => setAbierta(true)}>
              Leer nota →
            </button>
          </div>
        </div>
      </section>

      {abierta && (
        <NoticiaModal noticia={destacada} onClose={() => setAbierta(false)} />
      )}
    </>
  );
};

export default InicioNews;
