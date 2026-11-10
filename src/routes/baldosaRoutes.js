import express from 'express';
import { crearBaldosa, listarBaldosasAprobadas, listarTodasLasBaldosas, cambiarEstado, eliminarBaldosa } from '../controllers/baldosaController.js';
import upload from '../middlewares/multer.js';
import { requerirAdmin, requerirUsuario } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/', requerirUsuario, upload.single('imagen'), crearBaldosa);
router.get('/aprobadas', listarBaldosasAprobadas);
router.get('/todas', requerirAdmin, listarTodasLasBaldosas);
router.patch('/:id/estado', requerirAdmin, cambiarEstado);
router.delete('/:id', requerirAdmin, eliminarBaldosa);

export default router;


