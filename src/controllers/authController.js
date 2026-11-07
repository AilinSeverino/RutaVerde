import * as authService from '../services/authService.js';
import { enviarCodigoVerificacion, enviarCodigoRecuperacion } from '../services/emailService.js';
import {
  crearSesionAdmin,
  crearSesionUsuario,
  extraerTokenAdmin,
  extraerTokenUsuario,
  revocarSesionUsuario,
  revocarSesionAdmin
} from '../middlewares/adminAuthMiddleware.js';

const opcionesCookieAdmin = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 8 * 60 * 60 * 1000
};

export async function verificarSesionBackoffice(req, res) {
  return res.status(200).json({ success: true, usuario: req.usuario });
}

export async function verificarSesionUsuario(req, res) {
  return res.status(200).json({ success: true, usuario: req.usuario });
}

export async function cerrarSesionUsuario(req, res) {
  revocarSesionUsuario(extraerTokenUsuario(req));
  res.clearCookie('rv_user_session', opcionesCookieAdmin);
  res.clearCookie('rv_admin_session', opcionesCookieAdmin);
  return res.status(200).json({ success: true });
}

export async function cerrarSesionBackoffice(req, res) {
  revocarSesionAdmin(extraerTokenAdmin(req));
  res.clearCookie('rv_admin_session', opcionesCookieAdmin);
  res.clearCookie('rv_user_session', opcionesCookieAdmin);
  return res.status(200).json({ success: true });
}

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
    const { email, contrasenia, password } = req.body;
    const clave = contrasenia || password;

    if (!email || !clave) {
      return res.status(400).json({ success: false, error: 'Email y contraseña requeridos.' });
    }

    const resultado = await authService.solicitarLogin(email, clave);

    if (!resultado.success) {
      return res.status(401).json({ success: false, error: resultado.error });
    }

    if (!resultado.requiereCodigo) {
      const sessionToken = crearSesionUsuario(resultado.usuario);
      res.cookie('rv_user_session', sessionToken, opcionesCookieAdmin);
      return res.status(200).json({
        success: true,
        requiereCodigo: false,
        usuario: resultado.usuario
      });
    }

    const mailResult = await enviarCodigoVerificacion(email, resultado.usuario.nombreC, resultado.codigo);

    if (!mailResult.success) {
      return res.status(502).json({ success: false, error: mailResult.error || 'No se pudo enviar el código de verificación.' });
    }

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

export async function solicitarRecuperacionContrasenia(req, res) {
  try {
    const resultado = await authService.solicitarRecuperacionContrasenia(req.body.email);

    if (!resultado.success) {
      return res.status(500).json({ success: false, error: resultado.error });
    }

    if (resultado.usuario) {
      const envio = await enviarCodigoRecuperacion(
        resultado.usuario.email,
        resultado.usuario.nombreC,
        resultado.codigo
      );

      if (!envio.success && process.env.NODE_ENV !== 'production') {
        return res.status(502).json({ success: false, error: envio.error });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Si el correo está registrado, recibirás un código de recuperación.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function restablecerContrasenia(req, res) {
  try {
    const { email, codigo, nuevaContrasenia } = req.body;
    const resultado = await authService.restablecerContrasenia(email, codigo, nuevaContrasenia);

    if (!resultado.success) {
      return res.status(400).json({ success: false, error: resultado.error });
    }

    return res.status(200).json({ success: true, message: 'La contraseña se actualizó correctamente.' });
  } catch (error) {
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

    if (Number(resultado.usuario.id_rol) === 1) {
      const sessionToken = crearSesionAdmin(resultado.usuario);
      res.cookie('rv_admin_session', sessionToken, opcionesCookieAdmin);
      res.cookie('rv_user_session', sessionToken, opcionesCookieAdmin);
    }

    return res.status(200).json({
      success: true,
      data: resultado.usuario,
      backoffice: Number(resultado.usuario.id_rol) === 1,
      message: 'Inicio de sesión verificado con éxito.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export const cambiarNombre = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario;
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
    const idUsuario = req.usuario?.id_usuario;

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