import api from '../../api.js';

export interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  lectura: string;
  imagen: string;
  cuerpo: string;
}

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Nueva ruta en el noreste argentino: el corredor biológico avanza en el Chaco',
    descripcion: 'Comunidades del NEA se organizan para conectar parches de monte nativo a lo largo del río Bermejo.',
    fecha: 'Mar 2024',
    lectura: '5 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `El corredor biológico del noreste argentino avanzó este mes con la incorporación de tres nuevas comunidades a lo largo del río Bermejo, en la provincia del Chaco. Más de 150 voluntarios participaron en jornadas de plantación de especies nativas como el quebracho colorado, el algarrobo negro y el palo santo.

La iniciativa, impulsada por la Red Verde SER, busca conectar los parches de monte nativo que quedaron aislados por la expansión agropecuaria de las últimas décadas. "Cada baldosa que plantamos es un paso más hacia un corredor continuo", explicó la coordinadora regional, Lucía Pereyra.

Durante el fin de semana se plantaron más de 800 ejemplares y se capacitó a docentes de tres escuelas rurales en técnicas de propagación de semillas nativas. El próximo encuentro está previsto para abril, con foco en la cuenca del río Pilcomayo.`
  },
  {
    id: 2,
    titulo: '"Corredor El Tinku llega a Chilecito, Mendoza"',
    descripcion: 'La comunidad de Luján de Cuyo plantó álamos y algarrobos en la nueva etapa del corredor cuyano.',
    fecha: 'Abr 2024',
    lectura: '4 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `El corredor El Tinku sumó este mes a la localidad de Chilecito dentro de su red de espacios verdes conectados. La jornada, que reunió a más de 80 vecinos, incluyó la plantación de álamos criollos y algarrobos blancos en los márgenes del canal principal de riego.

El proyecto apunta a recuperar la vegetación riparia que históricamente bordeaba los canales de la región, generando refugio para aves y pequeños mamíferos. "Queremos que los chicos de Chilecito crezcan con un río vivo", dijo el referente local, Marcos Giménez.

La organización también anunció la apertura de un vivero comunitario que proveerá plantines a las escuelas y clubes de la zona durante todo el año.`
  },
  {
    id: 3,
    titulo: '"Vergel El Edén del Mainumby en San Vicente, Bs. As."',
    descripcion: 'La organización amplía su presencia en 10 provincias con un nuevo espacio verde en el conurbano.',
    fecha: 'Sep 2024',
    lectura: '3 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `El Vergel El Edén del Mainumby inauguró sus puertas en San Vicente, sumando al conurbano bonaerense a la red de corredores verdes. El espacio, de casi media hectárea, fue recuperado de un baldío mediante el trabajo conjunto de vecinos, la municipalidad y la Red Verde SER.

En el lugar se plantaron más de 300 ejemplares de especies nativas del espinal pampeano: tala, espinillo, sauco y molle. El vergel también cuenta con un sector de huerta agroecológica manejada por familias del barrio.

Con esta incorporación, la Red Verde SER está presente en 10 provincias del país, con más de 80 espacios verdes activos.`
  },
  {
    id: 4,
    titulo: '"Jardín Bonaerense — Plaza ARA en Necochea"',
    descripcion: 'Aves y mamíferos nativos vuelven al biocorredor pampeano gracias a la recuperación de la plaza.',
    fecha: 'Nov 2024',
    lectura: '4 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `La Plaza ARA de Necochea completó su transformación en un jardín bonaerense con el agregado de las últimas 120 plantas nativas de costa atlántica. El proyecto, que comenzó hace dos años, ya registra la presencia de 14 especies de aves que no habían sido observadas en el área urbana en más de una década.

Entre los avistajes destacados se cuentan el hornero, la calandria real y el churrinche. Vecinos del barrio organizan recorridas guiadas los sábados para que familias y escuelas conozcan la biodiversidad local.

El municipio de Necochea comprometió recursos para extender el modelo a otras tres plazas del partido durante 2025.`
  },
  {
    id: 5,
    titulo: '"EP N°26 Antártida Argentina suma su jardín en Grand Bourg"',
    descripcion: 'Más de 60 instituciones se sumaron a la iniciativa verde durante el año escolar.',
    fecha: 'Oct 2024',
    lectura: '3 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `La Escuela Primaria N°26 Antártida Argentina de Grand Bourg inauguró su jardín nativo en el patio trasero, convirtiéndose en la institución número 60 en sumarse al programa Escuelas Verdes de la Red Verde SER.

Los alumnos de 4°, 5° y 6° grado participaron activamente en la preparación del suelo, la siembra y el trasplante de las especies elegidas: ceibo, jacarandá autóctono y tala. "Los chicos aprendieron que plantar es un acto político", destacó la directora del establecimiento.

El programa Escuelas Verdes ya cubre 8 distritos del conurbano y planea llegar a 100 instituciones antes de fin de año.`
  },
  {
    id: 6,
    titulo: '"Rotary Fray Bentos — Ruta Paul Harris llega desde Uruguay"',
    descripcion: 'El mes batió el récord con 340 voluntarios registrados en una jornada binacional.',
    fecha: 'Sep 2024',
    lectura: '5 min de lectura',
    imagen: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000&auto=format&fit=crop',
    cuerpo: `En una jornada histórica para la Red Verde SER, el club Rotary de Fray Bentos cruzó el río Uruguay para plantar junto a voluntarios argentinos en el corredor costero del Parque Nacional El Palmar. Fue la primera actividad binacional de la red y reunió a 340 participantes, batiendo el récord de asistencia.

Se plantaron 500 ejemplares de palma yatay, especie emblemática de la región y amenazada por la expansión ganadera. "El corredor no conoce fronteras", expresó el presidente del Rotary Club de Fray Bentos, Jorge Tabárez.

La experiencia abre la puerta a futuras colaboraciones con organizaciones de Brasil, Paraguay y Bolivia dentro del corredor sudamericano.`
  }
];

export async function obtenerNoticiasPublicadas(): Promise<Noticia[]> {
  const respuesta = await api.get('/api/noticias');
  const respuestaData: unknown = respuesta.data;
  const registros = Array.isArray(respuestaData)
    ? respuestaData
    : typeof respuestaData === 'object' && respuestaData !== null && 'data' in respuestaData && Array.isArray(respuestaData.data)
      ? respuestaData.data
      : [];

  return registros
    .filter((registro): registro is Record<string, unknown> => typeof registro === 'object' && registro !== null)
    .filter((registro) => registro.estado === 'publicada' || registro.aprobada === true)
    .map((registro, index) => ({
      id: Number(registro.id ?? registro.id_noticia ?? index),
      titulo: String(registro.titulo ?? ''),
      descripcion: String(registro.descripcion ?? registro.subtitulo ?? registro.resumen ?? ''),
      fecha: String(registro.fecha ?? registro.fecha_publicacion ?? ''),
      lectura: String(registro.lectura ?? '3 min de lectura'),
      imagen: String(registro.imagen ?? registro.url_foto ?? registro.foto ?? ''),
      cuerpo: String(registro.cuerpo ?? registro.contenido ?? registro.descripcion ?? ''),
    }));
}
