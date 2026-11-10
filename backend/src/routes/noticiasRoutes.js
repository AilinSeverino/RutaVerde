import { Router } from 'express';
import upload from '../middlewares/multer.js';
import { crearNoticia, obtenerNoticias, mejorarNoticia } from '../controllers/noticiasController.js';

const router = Router();

router.get('/', obtenerNoticias);
router.post('/', upload.single('foto'), crearNoticia);
router.post('/mejorar-ia', mejorarNoticia);

export default router;