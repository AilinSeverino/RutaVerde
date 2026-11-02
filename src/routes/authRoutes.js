import express from 'express';
import multer from 'multer';
import { registrarUsuario, loginUsuario, confirmarCodigoUsuario, cambiarNombre, cambiarFotoPerfil } from '../controllers/authController.js';
import { validarRegistro } from '../middlewares/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', loginUsuario);
router.post('/confirmar-codigo', confirmarCodigoUsuario);
router.put('/cambiar-nombre', cambiarNombre);
router.put('/cambiar-foto', upload.single('foto'), cambiarFotoPerfil);

export default router;

