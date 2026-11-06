import express from 'express';
import multer from 'multer';
import { registrarUsuario, loginUsuario, confirmarCodigoUsuario, cambiarNombre, cambiarFotoPerfil } from '../controllers/authController.js';
import { validarRegistro } from '../middlewares/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', loginUsuario);
router.post('/confirmar-codigo', confirmarCodigoUsuario);

// Perfil
router.put('/perfil/nombre', cambiarNombre);
router.put('/perfil/foto', upload.single('foto'), cambiarFotoPerfil);

export default router;

