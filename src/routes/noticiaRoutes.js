import express from 'express';
import { publicarNoticia, listarTodasLasNoticias, mejorarNoticia } from '../controllers/noticiaController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/', listarTodasLasNoticias);
router.post('/', upload.single('foto'), publicarNoticia);
router.post('/mejorar-ia', mejorarNoticia);

export default router;