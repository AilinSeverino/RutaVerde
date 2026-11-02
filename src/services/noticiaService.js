// src/services/noticiaService.js
import { supabase } from '../config/supabase.js';

export async function obtenerTodasLasNoticias() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .order('id_noticia', { ascending: false });

    if (error) return { success: false, error: error.message };

    const noticiasFormateadas = (data || []).map((n) => {
      let estadoTexto = 'pendiente';
      if (n.aprobada === true) estadoTexto = 'publicada';
      if (n.aprobada === false) estadoTexto = 'papelera';

      return {
        id: n.id_noticia,
        id_noticia: n.id_noticia,
        titulo: n.titulo,
        subtitulo: n.subtitulo,
        contenido: n.cuerpo,
        cuerpo: n.cuerpo,
        foto: n.url_foto,
        url_foto: n.url_foto,
        fecha: n.fecha_publicacion,
        estado: estadoTexto,
        aprobada: n.aprobada
      };
    });

    return { success: true, data: noticiasFormateadas };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- NUEVO: Obtener Noticias APROBADAS (Vista pública) ---
export async function obtenerNoticiasAprobadas() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .eq('aprobada', true)
      .order('fecha_publicacion', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- NUEVO: Obtener Noticias PENDIENTES (Backoffice) ---
export async function obtenerNoticiasPendientes() {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .select('*')
      .or('aprobada.is.null,aprobada.eq.false');

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- NUEVO: Aprobar o Rechazar Noticia (Backoffice) ---
export async function actualizarEstadoNoticia(idNoticia, aprobada) {
  try {
    const { data, error } = await supabase
      .from('Noticias')
      .update({ aprobada: aprobada })
      .eq('id_noticia', idNoticia)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data[0] };
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

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}