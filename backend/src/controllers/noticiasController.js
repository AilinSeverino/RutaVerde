import * as noticiasService from '../services/noticiasService.js';
import { mejorarNoticiaService } from '../services/iaService.js';

export async function crearNoticia (req, res) {
  try {
    const { titulo, subtitulo, cuerpo } = req.body;
    const id_usuario = req.usuario?.id || req.body.id_usuario;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ error: 'El título es obligatorio.' });
    }

    if (!cuerpo || !cuerpo.trim()) {
      return res.status(400).json({ error: 'El cuerpo de la noticia es obligatorio.' });
    }

    if (!id_usuario) {
      return res.status(400).json({
        error: 'El id_usuario es obligatorio.'
      });
    }

    const nuevaNoticia = await noticiasService.crearNoticia({
      titulo,
      subtitulo,
      cuerpo,
      id_usuario,
      file: req.file
    });

    return res.status(201).json({
      mensaje: 'Noticia publicada con éxito',
      noticia: nuevaNoticia
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export async function obtenerNoticias (req, res){
  try {
    const noticias = await noticiasService.obtenerNoticias();
    return res.json(noticias);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const mejorarNoticia = async (req, res) => {
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
};