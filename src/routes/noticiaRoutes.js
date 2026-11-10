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
import { requerirAdmin } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/', listarNoticiasAprobadas);
router.get('/todas', requerirAdmin, listarTodasLasNoticias);
router.get('/pendientes', requerirAdmin, listarNoticiasPendientes);
router.get('/aprobadas', listarNoticiasAprobadas);
router.post('/', upload.single('foto'), publicarNoticia);
router.post('/mejorar-ia', mejorarNoticia);
router.patch('/:id/estado', requerirAdmin, cambiarEstadoNoticia);
router.put('/:id/estado', requerirAdmin, cambiarEstadoNoticia);
router.post('/:id/estado', requerirAdmin, cambiarEstadoNoticia);
router.put('/:id', requerirAdmin, editarNoticia);
router.delete('/:id', requerirAdmin, eliminarNoticia);

export default router;