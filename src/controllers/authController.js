import * as authService from '../services/authService.js';
import { enviarCodigoVerificacion } from '../services/emailService.js';

export async function registrarUsuario(req, res) {
  try {
    const { nombre, email, contrasenia, region } = req.body;
    const resultado = await authService.registro(nombre, email, contrasenia, region);

    if (resultado.success) {
      return res.status(201).json(resultado);
    }

    return res.status(400).json(resultado);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function loginUsuario(req, res) {
  try {
    console.log('--- 1. Datos recibidos del frontend ---', req.body);
    const { email, contrasenia, password } = req.body;
    const clave = contrasenia || password;

    if (!email || !clave) {
      return res.status(400).json({ success: false, error: 'Email y contraseña requeridos.' });
    }

    const resultado = await authService.solicitarLogin(email, clave);
    console.log('--- 2. Resultado de solicitarLogin ---', resultado);

    if (!resultado.success) {
      return res.status(401).json({ success: false, error: resultado.error });
    }

    console.log('--- 3. Intentando enviar correo a:', email);
    const mailResult = await enviarCodigoVerificacion(email, resultado.usuario.nombreC, resultado.codigo);
    console.log('--- 4. Resultado del envío de correo ---', mailResult);

    return res.status(200).json({
      success: true,
      requiereCodigo: true,
      message: 'Se ha enviado un código de verificación a tu correo.'
    });
  } catch (error) {
    console.error('--- ERROR INESPERADO EN LOGIN ---', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function confirmarCodigoUsuario(req, res) {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ success: false, error: 'Email y código requeridos.' });
    }

    const resultado = await authService.verificarCodigoLogin(email, codigo);

    if (!resultado.success) {
      return res.status(400).json({ success: false, error: resultado.error });
    }

    return res.status(200).json({
      success: true,
      data: resultado.usuario,
      message: 'Inicio de sesión verificado con éxito.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export const cambiarNombre = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || req.body.id_usuario;
    const { nombre } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta el ID del usuario.' });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    }

    const resultado = await authService.actualizarNombreUsuario(idUsuario, nombre);

    if (!resultado.success) {
      return res.status(404).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: 'Nombre actualizado con éxito',
      nombre: resultado.data.nombreC
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cambiarFotoPerfil = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || req.body.id_usuario;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta el ID del usuario.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Debes seleccionar una imagen.' });
    }

    const resultado = await authService.subirFotoPerfil(idUsuario, req.file);

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: 'Foto de perfil actualizada con éxito',
      fotoPerfil: resultado.fotoPerfil
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};