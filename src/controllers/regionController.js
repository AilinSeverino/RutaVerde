import { getRegionesConPlantas, getRegionesPorPlanta } from '../services/regionService.js';

export const obtenerRegiones = async (req, res) => {
  try {
    const ecorregiones = await getRegionesConPlantas();
    return res.status(200).json({
      success: true,
      data: ecorregiones
    });
  } catch (error) {
    console.error('Error en obtenerRegiones:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener las ecorregiones: ' + error.message
    });
  }
};

export const obtenerRegionesPorPlanta = async (req, res) => {
  try {
    const nombrePlanta = req.query.planta || req.query.nombrePlanta || '';

    if (!nombrePlanta) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const regiones = await getRegionesPorPlanta(nombrePlanta);
    return res.status(200).json({
      success: true,
      data: regiones
    });
  } catch (error) {
    console.error('Error en obtenerRegionesPorPlanta:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener ecorregiones por planta: ' + error.message
    });
  }
};

export const getRegiones = async (req, res) => {
  try {
    const data = await getRegionesConPlantas();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Error en getRegiones:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};