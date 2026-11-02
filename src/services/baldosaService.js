import { supabase } from '../config/supabase.js';

export async function obtenerTodasLasBaldosas() {
  try {
    const { data, error } = await supabase
      .from('Baldosa')
      .select(`
        id_baldosa,
        tamanio,
        comentarios,
        url_imagen,
        nombrePlanta,
        id_region,
        aprobada,
        Usuarios ( nombreC, email )
      `)
      .order('id_baldosa', { ascending: false });

    if (error) return { success: false, error: error.message };

    const aportesFormateados = data.map(b => {
      let estadoTexto = 'pendiente';

      if (b.aprobada === true) {
        estadoTexto = 'aprobado';
      } else if (b.aprobada === false) {
        estadoTexto = 'pendiente';
      }

      return {
        id: b.id_baldosa,
        id_baldosa: b.id_baldosa,
        planta: b.nombrePlanta || 'Sin nombre',
        nombrePlanta: b.nombrePlanta,
        foto: b.url_imagen,
        url_imagen: b.url_imagen,
        tamanio: b.tamanio,
        comentarios: b.comentarios,
        estado: estadoTexto,
        aprobada: b.aprobada,
        usuario: b.Usuarios?.nombreC || 'Anónimo',
        emailUsuario: b.Usuarios?.email || ''
      };
    });

    return { success: true, data: aportesFormateados };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function obtenerBaldosasAprobadas() {
  try {
    const { data, error } = await supabase
      .from('Baldosa')
      .select(`
        id_baldosa,
        tamanio,
        comentarios,
        url_imagen,
        nombrePlanta,
        id_region,
        aprobada,
        Usuarios ( nombreC, email )
      `)
      .eq('aprobada', true);

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function obtenerBaldosasPendientes() {
  try {
    const { data, error } = await supabase
      .from('Baldosa')
      .select(`
        id_baldosa,
        tamanio,
        comentarios,
        url_imagen,
        nombrePlanta,
        id_region,
        aprobada,
        Usuarios ( nombreC, email )
      `)
      .or('aprobada.is.null,aprobada.eq.false')
      .order('id_baldosa', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function actualizarEstadoBaldosa(idBaldosa, aprobada) {
  try {
    const { data, error } = await supabase
      .from('Baldosa')
      .update({ aprobada: aprobada })
      .eq('id_baldosa', idBaldosa)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function subirBaldosa(plantaEntrada, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
  try {
    if (!plantaEntrada) {
      return { success: false, error: 'La planta es obligatoria.' };
    }
    if (!archivoImagen) {
      return { success: false, error: 'La imagen es obligatoria.' };
    }

    let query = supabase.from('Plantas_Nativas').select('id_planta, nombre');

    if (!isNaN(Number(plantaEntrada))) {
      query = query.eq('id_planta', parseInt(plantaEntrada));
    } else {
      const nombreNormalizado = plantaEntrada.trim();
      query = query.ilike('nombre', nombreNormalizado);
    }

    const { data: plantasEncontradas, error: errorBusqueda } = await query.limit(1);

    if (errorBusqueda) {
      return { success: false, error: `Error buscando la planta: ${errorBusqueda.message}` };
    }

    const plantaValida = plantasEncontradas?.[0] || null;

    if (!plantaValida) {
      return {
        success: false,
        error: `No se pudo registrar. La planta "${plantaEntrada}" no existe en el listado.`
      };
    }

    const nombrePlanta = plantaValida.nombre;

    const nombreLimpio = archivoImagen.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const nombreArchivo = `${Date.now()}_${nombreLimpio}`;
    const nombreBucket = 'imagenes_baldosas';

    const { error: storageError } = await supabase.storage
      .from(nombreBucket)
      .upload(nombreArchivo, archivoImagen.buffer, {
        contentType: archivoImagen.mimetype,
        upsert: false
      });

    if (storageError) {
      return { success: false, error: `Error al subir imagen al Storage: ${storageError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from(nombreBucket)
      .getPublicUrl(nombreArchivo);

    const urlImagen = urlData?.publicUrl;
    if (!urlImagen) {
      return { success: false, error: 'No se pudo obtener la URL pública de la imagen.' };
    }

    const { data: dbData, error: dbError } = await supabase
      .from('Baldosa')
      .insert([
        {
          id_region: parseInt(idRegion),
          tamanio: Number(tamanio),
          comentarios: comentarios ? comentarios.trim() : null,
          url_imagen: urlImagen,
          id_usuario: idUsuario ? parseInt(idUsuario) : null,
          nombrePlanta: nombrePlanta.trim(),
          aprobada: false
        }
      ])
      .select();

    if (dbError) {
      return { success: false, error: `Error al guardar la baldosa en BD: ${dbError.message}` };
    }

    return { success: true, data: dbData[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}