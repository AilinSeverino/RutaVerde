import * as noticiaService from '../services/noticiaService.js';
import { mejorarNoticiaService } from '../services/iaService.js';

export async function listarTodasLasNoticias(req, res) {
  try {
    const resu = await noticiaService.obtenerTodasLasNoticias();
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function publicarNoticia(req, res) {
  try {
    const tituloRecibido = req.body.titulo ?? req.body.title ?? '';
    const contenidoRecibido = req.body.contenido ?? req.body.descripcion ?? req.body.cuerpo ?? '';
    const titulo = String(tituloRecibido || '').trim();
    const contenido = String(contenidoRecibido || '').trim();
    const archivoFoto = req.file;

    if (!titulo) {
      return res.status(400).json({ success: false, error: 'El título es obligatorio.' });
    }

    if (!contenido) {
      return res.status(400).json({ success: false, error: 'El contenido es obligatorio.' });
    }

    const resultado = await noticiaService.crearNoticia(titulo, contenido, archivoFoto);

    if (resultado.success) {
      return res.status(201).json(resultado);
    }

    return res.status(400).json(resultado);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function mejorarNoticia(req, res) {
  try {
    const { titulo, descripcion } = req.body;

    if (!descripcion || descripcion.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'La descripción es obligatoria para poder mejorar la noticia.'
      });
    }

    const noticiaMejorada = await mejorarNoticiaService(titulo || '', descripcion);

    return res.status(200).json({
      success: true,
      mensaje: 'Noticia mejorada exitosamente',
      data: noticiaMejorada
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function listarNoticiasPendientes(req, res) {
  try {
    const resu = await noticiaService.obtenerNoticiasPendientes();
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function listarNoticiasAprobadas(req, res) {
  try {
    const resu = await noticiaService.obtenerNoticiasAprobadas();
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function cambiarEstadoNoticia(req, res) {
  try {
    const { id } = req.params;
    const value = req.body ?? {};
    console.log('--- PATCH noticia estado ---');
    console.log('id:', id);
    console.log('body:', JSON.stringify(value));
    const rawEstado = value.aprobada ?? value.aprobado ?? value.estado ?? value.status ?? value.value;

    if (rawEstado === undefined || rawEstado === null || rawEstado === '') {
      return res.status(400).json({ success: false, error: 'Falta el valor de aprobada.' });
    }

    const estadoTexto = String(rawEstado).trim().toLowerCase();
    const aprobada =
      rawEstado === true ||
      rawEstado === 'true' ||
      rawEstado === 'TRUE' ||
      rawEstado === 1 ||
      rawEstado === '1' ||
      estadoTexto === 'aprobada' ||
      estadoTexto === 'aprobado' ||
      estadoTexto === 'approved' ||
      estadoTexto === 'publicada' ||
      estadoTexto === 'published';

    const resu = await noticiaService.actualizarEstadoNoticia(id, aprobada);
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function editarNoticia(req, res) {
  try {
    const { id } = req.params;
    const campos = req.body || {};
    const resu = await noticiaService.editarNoticia(id, campos);
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function eliminarNoticia(req, res) {
  try {
    const { id } = req.params;
    const resu = await noticiaService.eliminarNoticia(id);
    return res.status(resu.success ? 200 : 400).json(resu);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}