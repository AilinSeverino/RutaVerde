import express from 'express';
import { crearBaldosa, listarBaldosasAprobadas, listarTodasLasBaldosas, cambiarEstado, eliminarBaldosa } from '../controllers/baldosaController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload.single('imagen'), crearBaldosa);
router.get('/aprobadas', listarBaldosasAprobadas);
router.get('/todas', listarTodasLasBaldosas);
router.patch('/:id/estado', cambiarEstado);
router.delete('/:id', eliminarBaldosa);

export default router;


