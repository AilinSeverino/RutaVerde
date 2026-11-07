import { randomBytes } from 'node:crypto';
import { supabase } from '../config/supabase.js';

const userSessions = new Map();
const sessionDurationMs = 8 * 60 * 60 * 1000;

export function crearSesionUsuario(usuario) {
  const now = Date.now();

  for (const [token, session] of userSessions) {
    if (session.expiresAt <= now) userSessions.delete(token);
  }

  const token = randomBytes(32).toString('base64url');
  userSessions.set(token, {
    id_usuario: usuario.id_usuario,
    expiresAt: now + sessionDurationMs
  });

  return token;
}

export function crearSesionAdmin(usuario) {
  if (Number(usuario.id_rol) !== 1) {
    throw new Error('Solo una cuenta administradora puede iniciar sesión en el backoffice.');
  }

  return crearSesionUsuario(usuario);
}

function leerCookie(req, nombre) {
  const cookie = (req.headers.cookie || '')
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${nombre}=`));

  return cookie ? decodeURIComponent(cookie.slice(nombre.length + 1)) : null;
}

export function extraerTokenAdmin(req) {
  const cookieToken = leerCookie(req, 'rv_admin_session');
  if (cookieToken) return cookieToken;

  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

export function extraerTokenUsuario(req) {
  return leerCookie(req, 'rv_user_session');
}

export function revocarSesionUsuario(token) {
  if (token) userSessions.delete(token);
}

export const revocarSesionAdmin = revocarSesionUsuario;

async function verificarSesion(req, res, next, token, adminOnly) {
  const session = token ? userSessions.get(token) : null;

  if (!session) {
    return res.status(401).json({ success: false, error: 'Iniciá sesión para continuar.' });
  }

  if (session.expiresAt <= Date.now()) {
    userSessions.delete(token);
    return res.status(401).json({ success: false, error: 'La sesión expiró. Iniciá sesión nuevamente.' });
  }

  const { data: usuario, error } = await supabase
    .from('Usuarios')
    .select('id_usuario, id_rol, email, nombreC')
    .eq('id_usuario', session.id_usuario)
    .maybeSingle();

  if (error) {
    return res.status(503).json({ success: false, error: 'No se pudo verificar el acceso administrador.' });
  }

  if (!usuario) {
    userSessions.delete(token);
    return res.status(401).json({ success: false, error: 'La sesión ya no es válida.' });
  }

  if (adminOnly && Number(usuario.id_rol) !== 1) {
    userSessions.delete(token);
    return res.status(403).json({ success: false, error: 'Se requiere una cuenta administradora.' });
  }

  req.usuario = usuario;
  return next();
}

export function requerirUsuario(req, res, next) {
  return verificarSesion(req, res, next, extraerTokenUsuario(req), false);
}

export function requerirAdmin(req, res, next) {
  return verificarSesion(req, res, next, extraerTokenAdmin(req), true);
}
