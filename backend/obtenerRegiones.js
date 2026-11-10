// obtenerRegiones.js
import { supabase } from './src/config/supabase.js'; // Ajusta si tu import es './supabase.js'

export async function obtenerRegiones() {
  try {
    const { data, error } = await supabase
      .from('Regiones')
      .select('*');

    if (error) {
      console.error("Error al consultar la tabla Regiones:", error.message);
      return [];
    }

    return data; // Devolvemos el Array directamente
  } catch (err) {
    console.error("Error inesperado:", err.message);
    return [];
  }
} // Se eliminó la '}' sobrante de la línea 18