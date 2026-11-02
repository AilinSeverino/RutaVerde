import api from '../../api.js';

export interface Ecorregion {
  id: string;
  nombre: string;
  paises: string;
  resumen: string;
  bioma: string;
  contribuciones: number;
}

export async function obtenerEcorregiones(): Promise<Ecorregion[]> {
  try {
    const respuesta = await api.get('/api/ecoregiones');

    const data = respuesta.data;

    return (Array.isArray(data) ? data : []).map((item: any) => ({
      id: item.id || '',
      nombre: item.nombre || '',
      paises: item.paises || 'América Latina',
      resumen: item.resumen || item.descripcion || 'Sin descripción disponible.',
      bioma: item.bioma || 'Ecorregión',
      contribuciones: item.contribuciones || 0,
    }));
  } catch (error) {
    console.error('❌ Error al conectar con /api/ecoregiones:', error);
    return [];
  }
}