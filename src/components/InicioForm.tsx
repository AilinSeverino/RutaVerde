import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InicioForm.css';
import api from '../../api.js';
import { useAuth } from '../context/AuthContext';

interface InicioFormProps {
  onRegisterClick?: () => void;
}

const InicioForm: React.FC<InicioFormProps> = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const volverA: string = location.state?.from ?? '/';
  const { login } = useAuth();

  // Estados para Login
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const [camposError, setCamposError] = useState<{ email?: boolean; contrasenia?: boolean; codigo?: boolean }>({});
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  // Estados para Verificación 2FA
  const [pasoCodigo, setPasoCodigo] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);

  // Paso 1: Solicitar Login y envío de correo
  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCamposError({});

    const errores: { email?: boolean; contrasenia?: boolean } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      errores.email = true;
    }

    if (!contrasenia || contrasenia.length < 6) {
      errores.contrasenia = true;
    }

    if (Object.keys(errores).length > 0) {
      setCamposError(errores);
      if (errores.email && errores.contrasenia) {
        setError('Completá el correo y la contraseña correctamente.');
      } else if (errores.email) {
        setError('Ingresá un correo electrónico válido.');
      } else {
        setError('La contraseña debe tener al menos 6 caracteres.');
      }
      return;
    }

    try {
      setCargando(true);
      const respuesta = await api.post('/api/login', { email, contrasenia });

      // Si el backend solicita confirmación de código
      if (respuesta.data?.requiereCodigo) {
        setPasoCodigo(true);
      } else {
        completarLogin(respuesta.data?.usuario ?? respuesta.data);
      }
    } catch (err: any) {
      const mensajeError = err.response?.data?.error || 'La contraseña es incorrecta. Revisá e intentá de nuevo.';
      setError(mensajeError);
      setCamposError({ contrasenia: true });
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: Confirmar Código enviado al mail
  const manejarConfirmarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCamposError({});

    if (!codigo.trim() || codigo.trim().length < 6) {
      setCamposError({ codigo: true });
      setError('Ingresá un código válido de 6 dígitos.');
      return;
    }

    try {
      setCargando(true);
      const respuesta = await api.post('/api/confirmar-codigo', { email, codigo: codigo.trim() });

      if (respuesta.data?.success) {
        completarLogin(respuesta.data.data);
      } else {
        setError(respuesta.data?.error || 'El código ingresado es incorrecto.');
        setCamposError({ codigo: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'El código ingresado es incorrecto o expiro.');
      setCamposError({ codigo: true });
    } finally {
      setCargando(false);
    }
  };

  // Función aux para guardar sesión en React Context e ingresar
  const completarLogin = (usuarioData: any) => {
    if (Number(usuarioData?.id_rol) === 1) {
      window.location.assign('http://localhost:5174');
      return;
    }

    login({
      id: usuarioData?.id ?? usuarioData?.id_usuario ?? 0,
      nombre: usuarioData?.nombre ?? usuarioData?.nombreC ?? email.split('@')[0],
      email: usuarioData?.email ?? email,
      ...usuarioData,
    });
    navigate(volverA);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {!pasoCodigo ? (
          /* VISTA 1: FORMULARIO DE LOGIN REGULAR */
          <>
            <h1 className="login-title">¡Bienvenido de vuelta!</h1>
            <p className="login-subtitle">Ingresá a tu cuenta de Ruta Verde</p>
            <hr className="divider" />

            <form className="login-form" onSubmit={manejarLogin}>
              {error && <p className="form-error-banner">{error}</p>}

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  value={email}
                  className={camposError.email ? 'input-error' : ''}
                  onChange={(e) => { setEmail(e.target.value); setCamposError(p => ({ ...p, email: false })); }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={mostrarContrasenia ? 'text' : 'password'}
                    id="password"
                    placeholder="contraseña"
                    autoComplete="current-password"
                    value={contrasenia}
                    className={camposError.contrasenia ? 'input-error' : ''}
                    onChange={(e) => { setContrasenia(e.target.value); setCamposError(p => ({ ...p, contrasenia: false })); }}
                  />
                  <button
                    type="button"
                    className="btn-toggle-password"
                    onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                    aria-label={mostrarContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {mostrarContrasenia ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <a href="/recuperar">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-login-submit" disabled={cargando}>
                {cargando ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="login-footer-divider">
              <hr className="footer-line" />
              <span className="footer-text">o</span>
            </div>

            <p className="login-register-text">
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                className="btn-register-outline"
                onClick={() => onRegisterClick ? onRegisterClick() : navigate('/registrarse', { state: location.state })}
              >
                Crear una cuenta
              </button>
            </p>
          </>
        ) : (
          /* VISTA 2: INGRESO DEL CÓDIGO DE CONFIRMACIÓN RECIBIDO POR EMAIL */
          <>
            <h1 className="login-title">Código de confirmación</h1>
            <p className="login-subtitle">
              Te enviamos un código de 6 dígitos a <strong>{email}</strong>
            </p>
            <hr className="divider" />

            <form className="login-form" onSubmit={manejarConfirmarCodigo}>
              {error && <p className="form-error-banner">{error}</p>}

              <div className="form-group">
                <label htmlFor="codigo">Código de 6 dígitos</label>
                <input
                  type="text"
                  id="codigo"
                  placeholder="123456"
                  maxLength={6}
                  value={codigo}
                  className={camposError.codigo ? 'input-error' : ''}
                  onChange={(e) => { setCodigo(e.target.value); setCamposError(p => ({ ...p, codigo: false })); }}
                  style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
                />
              </div>

              <button type="submit" className="btn-login-submit" disabled={cargando}>
                {cargando ? 'Verificando...' : 'Confirmar e Ingresar'}
              </button>

              <button
                type="button"
                className="btn-register-outline"
                onClick={() => { setPasoCodigo(false); setError(''); }}
                style={{ marginTop: '12px', width: '100%' }}
              >
                Volver a ingresar datos
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InicioForm;