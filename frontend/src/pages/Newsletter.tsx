import { useEffect, useState } from 'react';
import Header from '../components/Header';
import InicioNews from '../components/InicioNews';
import GrillaNews from '../components/GrillaNews';
import { obtenerNoticiasPublicadas } from '../data/noticias';
import type { Noticia } from '../data/noticias';

export default function Newsletter() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    let cancelado = false;

    obtenerNoticiasPublicadas()
      .then((publicadas) => {
        if (!cancelado) setNoticias(publicadas);
      })
      .catch((error) => console.error('Error al cargar noticias publicadas:', error));

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <>
      <Header />
      <InicioNews noticias={noticias} />
      <GrillaNews noticias={noticias} />
    </>
  );
}