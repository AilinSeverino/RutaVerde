import { useEffect, useState } from 'react';
import Header from '../components/Header';
import InicioNews from '../components/InicioNews';
import GrillaNews from '../components/GrillaNews';
import { noticias as noticiasHardcodeadas, obtenerNoticiasPublicadas } from '../data/noticias';
import type { Noticia } from '../data/noticias';

export default function Newsletter() {
  const [noticias, setNoticias] = useState<Noticia[]>(noticiasHardcodeadas);

  useEffect(() => {
    let cancelado = false;

    obtenerNoticiasPublicadas()
      .then((publicadas) => {
        if (cancelado) return;

        const titulosVistos = new Set<string>();
        const combinadas = [
          ...publicadas,
          ...noticiasHardcodeadas.map((noticia) => ({ ...noticia, id: -noticia.id }))
        ].filter((noticia) => {
          const titulo = noticia.titulo.trim().toLowerCase();
          if (titulosVistos.has(titulo)) return false;
          titulosVistos.add(titulo);
          return true;
        });

        setNoticias(combinadas);
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
