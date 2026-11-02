import { supabase } from '../config/supabase.js';

export const getRegionesConPlantas = async () => {
  try {
    const { data: regiones, error } = await supabase
      .from('Regiones')
      .select(`
        id_region,
        nombre,
        paises,
        descripcion,
        bioma
      `)
      .order('nombre', { ascending: true })
      .range(0, 9999);

    if (error) throw new Error(error.message);

    if (!Array.isArray(regiones)) return [];

    const resultado = [];

    for (const region of regiones) {
      let conteoBaldosas = 0;

      const { count, error: countError } = await supabase
        .from('Baldosa')
        .select('id_baldosa', { count: 'exact', head: true })
        .eq('id_region', region.id_region);

      if (!countError && typeof count === 'number') {
        conteoBaldosas = count;
      }

      let plantas = [];

      const { data: relaciones, error: plantasError } = await supabase
        .from('Region_Planta')
        .select('id_planta')
        .eq('id_region', region.id_region);

      if (!plantasError && Array.isArray(relaciones) && relaciones.length > 0) {
        const ids = relaciones.map((r) => r.id_planta).filter(Boolean);

        if (ids.length > 0) {
          const { data: plantasData } = await supabase
            .from('Plantas_Nativas')
            .select('id_planta, nombre, descripcion, url_imagen')
            .in('id_planta', ids);

          plantas = plantasData || [];
        }
      }

      resultado.push({
        id_region: region.id_region,
        id: region.id_region,
        nombre: region.nombre,
        paises: region.paises,
        descripcion: region.descripcion,
        resumen: region.descripcion,
        bioma: region.bioma,
        contribuciones: conteoBaldosas,
        arboles: conteoBaldosas,
        plantas
      });
    }

    return resultado;
  } catch (error) {
    console.error('Error en getRegionesConPlantas:', error.message);
    throw error;
  }
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