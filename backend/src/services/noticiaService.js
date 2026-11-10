// src/services/noticiaService.js
import { supabase, getSupabaseAdmin } from '../config/supabase.js';

function resumir(texto, max = 160) {
  const limpio = String(texto || '').replace(/\s+/g, ' ').trim();
  return limpio.length > max ? `${limpio.slice(0, max).trim()}…` : limpio;
}

function normalizarNoticia(n) {
  const aprobada = n?.aprobada === true || n?.aprobada === 'true' || n?.aprobada === 1 || n?.aprobada === '1';

  return {
    id: n?.id_noticia ?? n?.id,
    id_noticia: n?.id_noticia ?? n?.id,
    titulo: n?.titulo ?? '',
    subtitulo: n?.subtitulo ?? '',
    contenido: n?.cuerpo ?? n?.contenido ?? '',
    cuerpo: n?.cuerpo ?? n?.contenido ?? '',
    descripcion: resumir(n?.cuerpo ?? n?.contenido ?? ''),
    autor: n?.autor ?? 'Ruta Verde',
    imagen: n?.url_foto ?? n?.foto ?? '',
    foto: n?.url_foto ?? n?.foto ?? null,
    url_foto: n?.url_foto ?? n?.foto ?? null,
    fecha: n?.fecha_publicacion ?? n?.fecha ?? null,
    fecha_publicacion: n?.fecha_publicacion ?? n?.fecha ?? null,
    estado: aprobada ? 'publicada' : 'pendiente',
    aprobada
  };
}

export async function obtenerTodasLasNoticias() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .order('id_noticia', { ascending: false });

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      data: (data || []).map(normalizarNoticia)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Obtener Noticias APROBADAS (Vista pública) ---
export async function obtenerNoticiasAprobadas() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .eq('aprobada', true)
      .order('fecha_publicacion', { ascending: false });

    if (error) return { success: false, error: error.message };
    return {
      success: true,
      data: (data || []).map(normalizarNoticia)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Obtener Noticias PENDIENTES (Backoffice) ---
export async function obtenerNoticiasPendientes() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .or('aprobada.is.null,aprobada.eq.false');

    if (error) return { success: false, error: error.message };
    return {
      success: true,
      data: (data || []).map(normalizarNoticia)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Aprobar o Rechazar Noticia (Backoffice) ---
export async function actualizarEstadoNoticia(idNoticia, aprobada) {
  try {
    const valorAprobada = aprobada === true || aprobada === 'true' || aprobada === 1 || aprobada === '1';

    const { data, error } = await getSupabaseAdmin()
      .from('Noticias')
      .update({ aprobada: valorAprobada })
      .eq('id_noticia', idNoticia)
      .select();

    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'No se encontró la noticia.' };

    return { success: true, data: normalizarNoticia(data[0]) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Editar Noticia (Backoffice) ---
export async function editarNoticia(idNoticia, campos) {
  try {
    // Solo columnas reales de la tabla (el backoffice manda también campos derivados)
    const payload = {};

    if (campos.titulo !== undefined) payload.titulo = String(campos.titulo).trim();
    if (campos.cuerpo !== undefined) payload.cuerpo = String(campos.cuerpo).trim();
    if (campos.contenido !== undefined) payload.cuerpo = String(campos.contenido).trim();

    if (Object.keys(payload).length === 0) {
      return { success: false, error: 'No hay campos válidos para editar.' };
    }

    const { data, error } = await getSupabaseAdmin()
      .from('Noticias')
      .update(payload)
      .eq('id_noticia', idNoticia)
      .select();

    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: false, error: 'No se encontró la noticia.' };

    return { success: true, data: normalizarNoticia(data[0]) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Eliminar Noticia (Backoffice) ---
export async function eliminarNoticia(idNoticia) {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('Noticias')
      .delete()
      .eq('id_noticia', idNoticia)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data && data[0] ? normalizarNoticia(data[0]) : null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function crearNoticia(titulo, contenido, archivoFoto) {
  try {
    if (!titulo || !titulo.trim()) {
      return { success: false, error: 'El título es obligatorio.' };
    }

    if (!contenido || !contenido.trim()) {
      return { success: false, error: 'El contenido es obligatorio.' };
    }

    let urlImagen = null;

    if (archivoFoto) {
      const nombreArchivo = `${Date.now()}_${archivoFoto.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { error: storageError } = await supabase.storage
        .from('imagenes_noticias')
        .upload(nombreArchivo, archivoFoto.buffer, {
          contentType: archivoFoto.mimetype,
          upsert: false
        });

      if (storageError) {
        return { success: false, error: `Error al subir imagen: ${storageError.message}` };
      }

      const { data: urlData } = supabase.storage
        .from('imagenes_noticias')
        .getPublicUrl(nombreArchivo);

      urlImagen = urlData?.publicUrl || null;
    }

    const { data, error } = await supabase
      .from('Noticias')
      .insert([
        {
          titulo: titulo.trim(),
          cuerpo: contenido.trim(),
          url_foto: urlImagen,
          fecha_publicacion: new Date().toISOString(),
          aprobada: false
        }
      ])
      .select();

    if (error) {
      return { success: false, error: `Error en BD: ${error.message}` };
    }

    return { success: true, data: normalizarNoticia(data[0]) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}