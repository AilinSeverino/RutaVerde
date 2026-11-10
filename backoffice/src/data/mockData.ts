import type { NoticiaBO, AporteBO, UsuarioBO } from '../types'

export const mockNoticias: NoticiaBO[] = [
  {
    id: 1,
    titulo: 'Los corredores biológicos de la Patagonia se recuperan',
    descripcion: 'Investigadores del CONICET reportaron avances significativos en la restauración de los corredores biológicos que conectan los bosques patagónicos.',
    cuerpo: `Los corredores biológicos de la Patagonia están mostrando señales alentadoras de recuperación según el último informe del CONICET publicado esta semana. Estos corredores son franjas de vegetación nativa que conectan parches de bosques aislados, permitiendo el movimiento de fauna y el intercambio genético entre poblaciones.

Durante los últimos tres años, el equipo liderado por la Dra. Valeria Moreno monitoreó más de 400 kilómetros de corredores en las provincias de Neuquén, Río Negro y Chubut. Los resultados muestran un aumento del 23% en la diversidad de especies de aves y un retorno notable del huemul (Hippocamelus bisulcus) a zonas donde había desaparecido hace más de una década.

"Lo que estamos viendo es una respuesta positiva de los ecosistemas cuando se reducen las presiones antrópicas y se trabaja en conjunto con las comunidades locales", explicó la investigadora. El programa combina restauración activa con plantación de especies nativas, control de especies exóticas invasoras y trabajo de sensibilización con productores ganaderos de la región.

La iniciativa cuenta con el apoyo de la Administración de Parques Nacionales y varias ONGs conservacionistas que han aportado financiamiento y voluntarios para las tareas de campo.`,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    fecha: '2025-07-10',
    autor: 'Redacción RutaVerde',
    estado: 'pendiente',
  },
  {
    id: 2,
    titulo: 'Nueva especie de orquídea descubierta en la Selva Misionera',
    descripcion: 'Botánicos argentinos hallaron una especie desconocida de orquídea en el corazón de la Selva Paranaense, destacando la riqueza de este ecosistema único.',
    cuerpo: `Un equipo de botánicos del Instituto Darwinion y de la Universidad Nacional de Misiones anunció el hallazgo de una nueva especie de orquídea en el interior de la Reserva de Biosfera Yabotí. La planta, que fue denominada provisoriamente Epidendrum rutaverde, presenta flores de un característico color violeta con manchas amarillas y fue encontrada durante una expedición de relevamiento florístico en áreas poco exploradas de la selva.

La Selva Paranaense, también conocida como Selva Misionera, es considerada uno de los ecosistemas más ricos en biodiversidad de América del Sur. Comparte características con la Mata Atlántica brasileña y alberga una extraordinaria diversidad de plantas, insectos, aves y mamíferos, muchos de ellos en algún grado de amenaza.

"Este descubrimiento nos recuerda cuánto queda por conocer de nuestra propia naturaleza", señaló el Dr. Javier Casco, coordinador del proyecto. "Y también cuánto tenemos que proteger, porque muchas de estas especies podrían desaparecer antes de que las conozcamos."

La nueva especie será formalmente descripta en la revista Botanical Journal of the Linnean Society. Los investigadores planean volver a la zona para estudiar su biología reproductiva y evaluar el tamaño de la población silvestre.`,
    imagen: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=400',
    fecha: '2025-07-08',
    autor: 'Ana Fernández',
    estado: 'pendiente',
  },
  {
    id: 3,
    titulo: 'El gran yaguareté del Iberá: símbolo de una reintroducción exitosa',
    descripcion: 'A cinco años del programa de reintroducción, los yaguaretés del Iberá consolidan su presencia en los Esteros, generando esperanza para la biodiversidad argentina.',
    cuerpo: `Cinco años han pasado desde que los primeros yaguaretés (Panthera onca) pisaron nuevamente los Esteros del Iberá en la provincia de Corrientes, y los resultados superan las expectativas más optimistas del proyecto. Rewilding Argentina, junto a Parques Nacionales y el gobierno provincial, celebra hoy una población de más de 20 individuos, incluyendo crías nacidas en libertad.

El yaguareté es el felino más grande de América y fue extirpado del territorio correntino a mediados del siglo XX por la caza y la pérdida de hábitat. Su reintroducción forma parte de una visión más amplia de restauración ecológica que incluye también al oso hormiguero gigante, el tapir, el pecarí labiado y el lobo de crin.

"Ver a una madre yaguareté enseñándole a cazar a sus cachorros en el mismo lugar donde nuestros abuelos los exterminaron es algo que no tiene precio", reflexionó Sofía Heinonen, directora de Rewilding Argentina. "Estamos reconstruyendo algo que se perdió, y eso nos da esperanza para el futuro."

El parque Iberá atrae hoy a miles de visitantes que llegan específicamente para observar los yaguaretés en su ambiente natural, generando un impacto económico positivo para las comunidades locales y demostrando que la conservación y el desarrollo son compatibles.`,
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    fecha: '2025-07-05',
    autor: 'Carlos Mendoza',
    estado: 'pendiente',
  },
  {
    id: 4,
    titulo: 'Humedales bonaerenses: un tesoro en peligro',
    descripcion: 'Los humedales del delta del Paraná y la costa bonaerense enfrentan amenazas crecientes por el avance inmobiliario y la contaminación. Organizaciones ambientales exigen protección urgente.',
    cuerpo: `Los humedales de la provincia de Buenos Aires constituyen uno de los ecosistemas más valiosos y al mismo tiempo más amenazados del país. Estas zonas de transición entre ambientes terrestres y acuáticos albergan una biodiversidad extraordinaria y cumplen funciones ecosistémicas fundamentales como la purificación del agua, la regulación de inundaciones y el secuestro de carbono.

Sin embargo, el avance de los emprendimientos inmobiliarios sobre el delta del Paraná y la costa del Río de la Plata está destruyendo estos ecosistemas a un ritmo alarmante. Organizaciones como la Fundación Ambiente y Recursos Naturales (FARN) y la Asociación Argentina de Abogados Ambientalistas han presentado recursos judiciales para detener obras que no cuentan con la evaluación de impacto ambiental requerida por ley.

La Ley de Humedales, un proyecto que lleva años siendo debatido sin lograr aprobación definitiva en el Congreso Nacional, volvió a ganar protagonismo en las últimas semanas tras una serie de incendios en el delta que afectaron miles de hectáreas de vegetación nativa.

Expertos advierten que sin una protección legal efectiva, Argentina podría perder en pocas décadas ecosistemas que tardaron miles de años en formarse y que son irreemplazables tanto desde el punto de vista ecológico como cultural.`,
    imagen: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400',
    fecha: '2025-06-28',
    autor: 'Redacción RutaVerde',
    estado: 'publicada',
  },
  {
    id: 5,
    titulo: 'Árboles nativos: guía para forestar tu jardín con especies argentinas',
    descripcion: 'Te presentamos las mejores especies arbóreas nativas para plantar en jardines urbanos y periurbanos de distintas regiones del país.',
    cuerpo: `Forestar con plantas nativas es una de las acciones más efectivas que podemos hacer individualmente para apoyar la biodiversidad local. Las plantas nativas co-evolucionaron con los animales y microorganismos de cada región, por lo que ofrecen refugio, alimento y hábitat a una mayor diversidad de especies que las plantas exóticas ornamentales.

En la región del NOA (Noroeste Argentino), el palo borracho (Ceiba speciosa) y el jacarandá (Jacaranda mimosifolia) son opciones ideales que ofrecen sombra generosa y flores espectaculares. En la zona del litoral, el lapacho rosado (Handroanthus impetiginosus) es uno de los árboles más hermosos y valorados, mientras que en la Patagonia el ñire (Nothofagus antarctica) y el maitén (Maytenus boaria) son perfectos para jardines en zonas frías.

Para zonas urbanas de la región pampeana, el tala (Celtis tala), el espinillo (Vachellia caven) y el ceibo (Erythrina crista-galli), flor nacional argentina, son excelentes alternativas que además requieren menos agua que muchas especies exóticas cultivadas habitualmente.

Al elegir especies nativas para tu jardín, lo más importante es respetar la procedencia regional: preferí plantas producidas en viveros locales que garanticen que las semillas provienen de poblaciones silvestres cercanas a tu zona.`,
    imagen: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    fecha: '2025-06-20',
    autor: 'Lucía Paredes',
    estado: 'publicada',
  },
  {
    id: 6,
    titulo: 'La vuelta del cóndor: recuperación de una especie emblemática',
    descripcion: 'El cóndor andino (Vultur gryphus), símbolo de la Argentina y de los Andes, muestra signos de recuperación gracias a programas de cría en cautiverio y reintroducción.',
    cuerpo: `El cóndor andino (Vultur gryphus) es el ave voladora más grande del mundo y uno de los símbolos más poderosos de la Argentina y de toda la cordillera de los Andes. Durante décadas, esta especie sufrió una dramática disminución de sus poblaciones por la caza, el envenenamiento accidental con cebos destinados a predadores, y la pérdida de sus hábitats de anidación.

Pero hoy hay motivos para el optimismo. El programa de conservación del cóndor andino, que coordina el Ministerio de Ambiente de la Nación junto a organizaciones de varios países andinos, reportó un aumento sostenido de la población en los últimos años. En Argentina, se estima que existen actualmente entre 600 y 800 individuos, distribuidos principalmente en las provincias de Mendoza, San Juan, Neuquén y Río Negro.

Un hito especialmente emocionante fue el nacimiento de un pichón en el Parque Nacional Nahuel Huapi, el primero registrado en esa área en más de 30 años. "Es una señal de que el ecosistema está recuperando su salud", señaló el guarda fauna Rodrigo Villar, quien lleva 15 años monitoreando la especie en la región.

El programa incluye también un trabajo de educación ambiental con comunidades rurales que en el pasado veían al cóndor como una amenaza para su ganado, cambiando esa percepción hacia una de orgullo y custodia de una especie única.`,
    imagen: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=400',
    fecha: '2025-06-15',
    autor: 'Martín Gómez',
    estado: 'publicada',
  },
  {
    id: 7,
    titulo: 'Debate sobre la minería en zonas de glaciares',
    descripcion: 'El proyecto minero en la alta cordillera vuelve a generar controversia ante la proximidad de glaciares protegidos por la Ley de Glaciares.',
    cuerpo: `El debate sobre la compatibilidad entre la actividad minera y la protección de los glaciares volvió a primer plano esta semana, luego de que una empresa multinacional presentara un proyecto de exploración en la alta cordillera mendocina, a escasos kilómetros de glaciares protegidos por la Ley 26.639 de Presupuestos Mínimos para la Preservación de los Glaciares y el Ambiente Periglacial.

Organizaciones ambientalistas y comunidades locales se movilizaron para exigir la suspensión inmediata del proyecto, alegando que las actividades de exploración afectarían el ambiente periglacial y eventualmente la calidad y disponibilidad del agua de las poblaciones de piedemonte que dependen del deshielo glaciar.

Desde la empresa, sus representantes argumentan que el proyecto se ajusta a la normativa vigente y que cuenta con una evaluación de impacto ambiental aprobada por las autoridades provinciales. Sin embargo, organizaciones como Greenpeace Argentina cuestionan la rigurosidad de ese proceso y piden una revisión independiente.

El conflicto pone en tensión dos modelos de desarrollo: el extractivismo minero como motor económico en provincias con pocas alternativas productivas, y la conservación de los glaciares como reservas de agua dulce estratégicas en un contexto de cambio climático acelerado.`,
    imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    fecha: '2025-05-30',
    autor: 'Editorial',
    estado: 'papelera',
  },
  {
    id: 8,
    titulo: 'Basura en las sierras: el drama de los residuos en áreas naturales',
    descripcion: 'El turismo masivo sin conciencia ambiental está dejando su marca en las sierras cordobesas y otras áreas naturales del país.',
    cuerpo: `Las sierras de Córdoba son uno de los destinos turísticos más populares de Argentina, recibiendo millones de visitantes cada año que llegan atraídos por sus paisajes de quebradas, ríos cristalinos y bosque serrano. Sin embargo, este flujo turístico trae consigo una problemática que preocupa cada vez más a residentes, guardaparques y ambientalistas: la generación masiva de residuos en zonas naturales.

Los domingos de verano, algunas de las playas de río más frecuentadas de las sierras quedan tapizadas de plásticos, latas, vidrios y restos de alimentos que los visitantes dejan abandonados. Esto no solo afecta la estética del paisaje sino que tiene consecuencias graves para la fauna local: se han registrado casos de animales silvestres atrapados en bolsas de plástico o intoxicados por ingerir residuos.

Grupos de voluntarios ambientalistas, como la red de Guardianes de las Sierras, organizan limpiezas semanales en los puntos más afectados, pero reconocen que la solución de fondo requiere cambios culturales y políticas públicas más firmes. "Juntamos más basura de la que alcanzamos a sacar", lamenta Florencia Ríos, una de las coordinadoras del grupo.

Algunas municipalidades comenzaron a implementar sistemas de control de acceso y cobro de estacionamiento para financiar guardas y servicios de recolección, con resultados mixtos. La clave, según los especialistas, sigue siendo la educación ambiental desde la infancia.`,
    imagen: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    fecha: '2025-05-15',
    autor: 'Redacción RutaVerde',
    estado: 'papelera',
  },
]

export const mockAportes: AporteBO[] = [
  {
    id: 1,
    usuario: 'María González',
    planta: 'Ceibo (Erythrina crista-galli)',
    region: 'Buenos Aires',
    tamano: 'Grande (más de 5m)',
    comentarios: 'Hermoso ceibo a orillas del Río de la Plata, en plena floración. Parece ser un ejemplar muy antiguo, su tronco es enorme.',
    imagen: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400',
    fecha: '2025-07-12',
    estado: 'pendiente',
  },
  {
    id: 2,
    usuario: 'Pedro Ibáñez',
    planta: 'Lapacho rosado (Handroanthus impetiginosus)',
    region: 'Misiones',
    tamano: 'Mediano (2-5m)',
    comentarios: 'Encontré este lapacho en el borde de la selva. Está floreciendo a destiempo, en pleno julio. Muy llamativo.',
    imagen: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=400',
    fecha: '2025-07-09',
    estado: 'pendiente',
  },
  {
    id: 3,
    usuario: 'Sofía Varela',
    planta: 'Araucaria (Araucaria araucana)',
    region: 'Neuquén',
    tamano: 'Grande (más de 5m)',
    comentarios: 'Araucaria milenaria en el camino al volcán Lanín. Imponente. Hay varias más en la zona que también merecen ser registradas.',
    imagen: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
    fecha: '2025-07-06',
    estado: 'pendiente',
  },
  {
    id: 4,
    usuario: 'Tomás Ríos',
    planta: 'Palo borracho (Ceiba speciosa)',
    region: 'Salta',
    tamano: 'Grande (más de 5m)',
    comentarios: 'Majestuoso palo borracho en el centro de la plaza principal. Estamos gestionando con la municipalidad para que sea declarado árbol histórico.',
    imagen: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400',
    fecha: '2025-06-25',
    estado: 'aprobado',
  },
  {
    id: 5,
    usuario: 'Laura Castillo',
    planta: 'Caldén (Prosopis caldenia)',
    region: 'La Pampa',
    tamano: 'Mediano (2-5m)',
    comentarios: 'Caldén en el bosque nativo de La Pampa. Esta especie está muy presionada por el desmonte. El árbol tiene frutos abundantes este año.',
    imagen: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
    fecha: '2025-06-18',
    estado: 'aprobado',
  },
  {
    id: 6,
    usuario: 'Diego Herrera',
    planta: 'Especie desconocida',
    region: 'Chaco',
    tamano: 'Pequeño (menos de 2m)',
    comentarios: 'No pude identificar esta planta. Las fotos no son claras y la descripción es muy vaga.',
    imagen: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    fecha: '2025-06-10',
    estado: 'rechazado',
  },
]

export const mockUsuarios: UsuarioBO[] = [
  {
    id: 1,
    nombreC: 'Administrador RutaVerde',
    email: 'admin@rutaverde.com.ar',
    fechaR: '2024-01-15',
    id_rol: 1,
    activo: true,
  },
  {
    id: 2,
    nombreC: 'María González',
    email: 'maria.gonzalez@gmail.com',
    fechaR: '2024-03-22',
    id_rol: 2,
    activo: true,
  },
  {
    id: 3,
    nombreC: 'Pedro Ibáñez',
    email: 'pedro.ibanez@hotmail.com',
    fechaR: '2024-05-10',
    id_rol: 2,
    activo: true,
  },
  {
    id: 4,
    nombreC: 'Sofía Varela',
    email: 'sofia.varela@yahoo.com',
    fechaR: '2024-07-30',
    id_rol: 2,
    activo: false,
  },
  {
    id: 5,
    nombreC: 'Carlos Moderador',
    email: 'carlos.mod@rutaverde.com.ar',
    fechaR: '2024-02-01',
    id_rol: 1,
    activo: true,
  },
]
