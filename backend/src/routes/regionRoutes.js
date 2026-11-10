import { Router } from 'express';
import {
  obtenerRegiones,
  obtenerRegionesPorPlanta,
  getRegiones
} from '../controllers/regionController.js';

const router = Router();

router.get('/regiones-db', obtenerRegiones);
router.get('/regiones/por-planta', obtenerRegionesPorPlanta);
router.get('/regiones', getRegiones);

export default router;