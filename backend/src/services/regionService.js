import { supabase } from '../config/supabase.js';

export const getRegionesConPlantas = async () => {
  const { data: regiones, error } = await supabase
    .from('Regiones')
    .select(`
      id_region,
      nombre,
      paises,
      descripcion,
      bioma,
      Baldosa ( id_baldosa, aprobada ),
      Region_Planta (
        Plantas_Nativas ( id_planta, nombre, descripcion, url_imagen )
      )
    `)
    .order('nombre', { ascending: true })
    .range(0, 9999);

  if (error) {
    console.error('Error en getRegionesConPlantas:', error.message);
    throw new Error(error.message);
  }

  return (regiones || []).map((region) => {
    const contribuciones = Array.isArray(region.Baldosa)
      ? region.Baldosa.filter((baldosa) => baldosa.aprobada === true).length
      : 0;
    const plantas = Array.isArray(region.Region_Planta)
      ? region.Region_Planta.map((relacion) => relacion.Plantas_Nativas).filter(Boolean)
      : [];

    return {
      id_region: region.id_region,
      id: region.id_region,
      nombre: region.nombre,
      paises: region.paises,
      descripcion: region.descripcion,
      resumen: region.descripcion,
      bioma: region.bioma,
      contribuciones,
      arboles: contribuciones,
      plantas
    };
  });
};

export const getRegionesPorPlanta = async (nombrePlanta) => {
  if (!nombrePlanta || !nombrePlanta.trim()) return [];

  const termino = `%${nombrePlanta.trim()}%`;

  const { data: plantas, error: errorPlanta } = await supabase
    .from('Plantas_Nativas')
    .select('id_planta, nombre')
    .ilike('nombre', termino);

  if (errorPlanta || !plantas || plantas.length === 0) return [];

  const ids = plantas.map((p) => p.id_planta);

  const { data: relaciones, error: errorRel } = await supabase
    .from('Region_Planta')
    .select('id_region')
    .in('id_planta', ids);

  if (errorRel || !relaciones) return [];

  const idsRegiones = [...new Set(relaciones.map((r) => r.id_region).filter(Boolean))];

  if (idsRegiones.length === 0) return [];

  const { data: regiones, error: errorReg } = await supabase
    .from('Regiones')
    .select('id_region, nombre, paises, bioma')
    .in('id_region', idsRegiones);

  if (errorReg || !regiones) return [];

  return regiones;
};