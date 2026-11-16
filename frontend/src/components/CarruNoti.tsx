import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Noticia from './Noticia';
import NoticiaModal from './NoticiaModal';
import { obtenerNoticiasPublicadas } from '../data/noticias';
import type { Noticia as NoticiaType } from '../data/noticias';
import './CarruNoti.css';

const CarruNoti: React.FC = () => {
  const [noticiaAbierta, setNoticiaAbierta] = useState<NoticiaType | null>(null);
  const [noticiasReales, setNoticiasReales] = useState<NoticiaType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    obtenerNoticiasPublicadas()
      .then((publicadas) => {
        if (!cancelado) setNoticiasReales(publicadas);
      })
      .catch((error) => console.error('Error al cargar noticias en inicio:', error));

    return () => {
      cancelado = true;
    };
  }, []);

  const primeras3 = noticiasReales.slice(0, 3);

  return (
    <>
      <section className="carru-noti">
        <div className="carru-noti-container">
          <h2 className="carru-noti-headline">Noticias</h2>
          {primeras3.length === 0 ? (
            <p>No hay noticias subidas aún</p>
          ) : (
            <div className="carru-noti-grid">
              {primeras3.map((noti) => (
                <Noticia
                  key={noti.id}
                  titulo={noti.titulo}
                  imagen={noti.imagen}
                  enlace="#"
                  onClick={() => setNoticiaAbierta(noti)}
                />
              ))}
            </div>
          )}
          <p className="carru-noti-subir">
            ¿Tenés una noticia sobre el corredor?{' '}
            <button
              type="button"
              className="carru-noti-subir-btn"
              onClick={() => navigate('/perfil')}
            >
              Compartila
            </button>
          </p>
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

export default CarruNoti;