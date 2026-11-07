import express from 'express';
import multer from 'multer';
import {
	registrarUsuario,
	loginUsuario,
	confirmarCodigoUsuario,
	verificarSesionUsuario,
	cerrarSesionUsuario,
	cambiarNombre,
	cambiarFotoPerfil,
	verificarSesionBackoffice,
	cerrarSesionBackoffice,
	solicitarRecuperacionContrasenia,
	restablecerContrasenia
} from '../controllers/authController.js';
import { validarRegistro } from '../middlewares/authMiddleware.js';
import { requerirAdmin, requerirUsuario } from '../middlewares/adminAuthMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', loginUsuario);
router.post('/confirmar-codigo', confirmarCodigoUsuario);
router.get('/sesion', requerirUsuario, verificarSesionUsuario);
router.post('/logout', requerirUsuario, cerrarSesionUsuario);
router.post('/recuperar-contrasenia', solicitarRecuperacionContrasenia);
router.post('/restablecer-contrasenia', restablecerContrasenia);
router.get('/backoffice/session', requerirAdmin, verificarSesionBackoffice);
router.post('/backoffice/logout', requerirAdmin, cerrarSesionBackoffice);

// Perfil
router.put('/perfil/nombre', requerirUsuario, cambiarNombre);
router.put('/perfil/foto', requerirUsuario, upload.single('foto'), cambiarFotoPerfil);

export default router;

