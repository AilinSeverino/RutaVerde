import express from 'express';
import { listarUsuarios, actualizarUsuario, cambiarRolUsuario, eliminarUsuario } from '../controllers/usuarioController.js';
import { requerirAdmin } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.use(requerirAdmin);
router.get('/', listarUsuarios);
router.patch('/:id', actualizarUsuario);
router.patch('/:id/rol', cambiarRolUsuario);
router.delete('/:id', eliminarUsuario);

export default router;