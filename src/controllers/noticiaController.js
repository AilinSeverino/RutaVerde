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
    const { titulo, contenido } = req.body;
    const archivoFoto = req.file;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ success: false, error: 'El título es obligatorio.' });
    }

    if (!contenido || !contenido.trim()) {
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