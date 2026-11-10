import React, { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import './InicioForm.css';

const RecuperarContrasenia: React.FC = () => {
  const [pasoCodigo, setPasoCodigo] = useState(false);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [completado, setCompletado] = useState(false);

  const solicitarCodigo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setCargando(true);

    try {
      await api.post('/api/recuperar-contrasenia', { email: email.trim() });
      setPasoCodigo(true);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'No se pudo enviar el correo. Probá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const guardarContrasenia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(codigo)) {
      setError('Ingresá el código de 6 dígitos que recibiste.');
      return;
    }

    if (nuevaContrasenia.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(nuevaContrasenia)) {
      setError('La contraseña debe tener al menos 8 caracteres, una letra y un número.');
      return;
    }

    if (nuevaContrasenia !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await api.post('/api/restablecer-contrasenia', {
        email: email.trim(),
        codigo,
        nuevaContrasenia
      });
      setCompletado(true);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'No se pudo cambiar la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {completado ? (
          <>
            <h1 className="login-title">Contraseña actualizada</h1>
            <p className="login-subtitle">Ya podés iniciar sesión con tu nueva contraseña.</p>
            <Link className="btn-login-submit" to="/ingresar" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Volver al inicio de sesión
            </Link>
          </>
        ) : (
          <>
            <h1 className="login-title">Recuperar contraseña</h1>
            <p className="login-subtitle">
              {pasoCodigo
                ? `Ingresá el código enviado a ${email} y elegí una contraseña nueva.`
                : 'Te enviaremos un código para crear una contraseña nueva.'}
            </p>
            <hr className="divider" />

            {error && <p className="form-error-banner">{error}</p>}

            {!pasoCodigo ? (
              <form className="login-form" onSubmit={solicitarCodigo}>
                <div className="form-group">
                  <label htmlFor="recuperar-email">Correo electrónico</label>
                  <input
                    id="recuperar-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <button className="btn-login-submit" type="submit" disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar código'}
                </button>
              </form>
            ) : (
              <form className="login-form" onSubmit={guardarContrasenia}>
                <div className="form-group">
                  <label htmlFor="recuperar-codigo">Código de 6 dígitos</label>
                  <input
                    id="recuperar-codigo"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={codigo}
                    onChange={(event) => setCodigo(event.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nueva-contrasenia">Nueva contraseña</label>
                  <input
                    id="nueva-contrasenia"
                    type="password"
                    autoComplete="new-password"
                    value={nuevaContrasenia}
                    onChange={(event) => setNuevaContrasenia(event.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmar-contrasenia">Repetir contraseña</label>
                  <input
                    id="confirmar-contrasenia"
                    type="password"
                    autoComplete="new-password"
                    value={confirmacion}
                    onChange={(event) => setConfirmacion(event.target.value)}
                    required
                  />
                </div>
                <button className="btn-login-submit" type="submit" disabled={cargando}>
                  {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
              </form>
            )}

            <p className="login-register-text" style={{ marginTop: '1.5rem' }}>
              <Link to="/ingresar">Volver al inicio de sesión</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasenia;
