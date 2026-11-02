import express from 'express';
import { crearBaldosa, listarBaldosasAprobadas, listarTodasLasBaldosas, cambiarEstado } from '../controllers/baldosaController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload.single('imagen'), crearBaldosa);
router.get('/aprobadas', listarBaldosasAprobadas);
router.patch('/:id/estado', cambiarEstado);
router.get('/todas', listarTodasLasBaldosas); // <-- Resuelve /api/baldosas/todas

export default router;


