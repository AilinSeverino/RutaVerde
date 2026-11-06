import express from 'express';
import {
  publicarNoticia,
  listarTodasLasNoticias,
  mejorarNoticia,
  listarNoticiasPendientes,
  listarNoticiasAprobadas,
  cambiarEstadoNoticia,
  editarNoticia,
  eliminarNoticia
} from '../controllers/noticiaController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/', listarTodasLasNoticias);
router.get('/todas', listarTodasLasNoticias);
router.get('/pendientes', listarNoticiasPendientes);
router.get('/aprobadas', listarNoticiasAprobadas);
router.post('/', upload.single('foto'), publicarNoticia);
router.post('/mejorar-ia', mejorarNoticia);
router.patch('/:id/estado', cambiarEstadoNoticia);
router.put('/:id/estado', cambiarEstadoNoticia);
router.post('/:id/estado', cambiarEstadoNoticia);
router.put('/:id', editarNoticia);
router.delete('/:id', eliminarNoticia);

export default router;