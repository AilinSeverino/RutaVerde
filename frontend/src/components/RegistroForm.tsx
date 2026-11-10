import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api.js';
import './RegistroForm.css';
import { useAuth } from '../context/AuthContext';

const RegistroForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [camposError, setCamposError] = useState<{
    nombre?: boolean; email?: boolean; contrasenia?: boolean; repetirContrasenia?: boolean; region?: boolean;
  }>({});

  // Estados para controlar la visibilidad de las contraseñas
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [mostrarRepetirContrasenia, setMostrarRepetirContrasenia] = useState(false);

  const limpiarCampo = (campo: string) =>
    setCamposError(p => ({ ...p, [campo]: false }));

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación local
    const errores: typeof camposError = {};
    if (!nombre.trim()) errores.nombre = true;
    if (!email.trim()) errores.email = true;
    if (!contrasenia.trim()) errores.contrasenia = true;
    if (!repetirContrasenia.trim()) errores.repetirContrasenia = true;
    if (!region) errores.region = true;

    if (Object.keys(errores).length > 0) {
      setCamposError(errores);
      setError('Por favor, completá todos los campos.');
      return;
    }

    // Validación de coincidencia de contraseñas
    if (contrasenia !== repetirContrasenia) {
      setCamposError({ contrasenia: true, repetirContrasenia: true });
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCamposError({});

    try {
      let idRegionNum = 1;
      if (region === 'chorotega') idRegionNum = 2;
      if (region === 'brunca') idRegionNum = 3;

      const respuesta = await api.post('/api/registro', {
        nombre,
        email,
        contrasenia,
        region: idRegionNum
      });

      if (respuesta.data.error) {
        setError(respuesta.data.error);
        if (respuesta.data.error.toLowerCase().includes('email') || respuesta.data.error.toLowerCase().includes('correo')) {
          setCamposError({ email: true });
        }
        return;
      }

      const usuarioData = respuesta.data?.usuario ?? respuesta.data;
      login({
        id: usuarioData?.id ?? 0,
        nombre: usuarioData?.nombre ?? nombre,
        email: usuarioData?.email ?? email,
        ...usuarioData,
      });
      navigate(location.state?.from ?? '/perfil');
    } catch (error: any) {
      const msg: string = error.response?.data?.error ?? error.message ?? '';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('correo')) {
        setError(msg || 'Ese correo ya está registrado.');
        setCamposError({ email: true });
      } else if (msg.toLowerCase().includes('contraseña') || msg.toLowerCase().includes('password')) {
        setError(msg || 'La contraseña no cumple los requisitos.');
        setCamposError({ contrasenia: true, repetirContrasenia: true });
      } else {
        setError(msg || 'Hubo un problema al crear tu cuenta. Intentá de nuevo.');
        setCamposError({ nombre: true, email: true, contrasenia: true, repetirContrasenia: true, region: true });
      }
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h1 className="registro-title">Crear cuenta</h1>
        <p className="registro-subtitle">Sumáte al corredor biológico</p>

        <hr className="divider" />

        <form className="registro-form" onSubmit={manejarRegistro}>
          {error && <p className="form-error-banner">{error}</p>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu nombre y apellido"
              value={nombre}
              className={camposError.nombre ? 'input-error' : ''}
              onChange={(e) => { setNombre(e.target.value); limpiarCampo('nombre'); }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              className={camposError.email ? 'input-error' : ''}
              onChange={(e) => { setEmail(e.target.value); limpiarCampo('email'); }}
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className={`password-input-wrapper ${camposError.contrasenia ? 'input-error' : ''}`}>
              <input
                type={mostrarContrasenia ? 'text' : 'password'}
                id="password"
                placeholder="Mínimo 8 caracteres"
                value={contrasenia}
                onChange={(e) => { setContrasenia(e.target.value); limpiarCampo('contrasenia'); }}
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

          {/* Campo Repetir Contraseña */}
          <div className="form-group">
            <label htmlFor="repeat-password">Repetir contraseña</label>
            <div className={`password-input-wrapper ${camposError.repetirContrasenia ? 'input-error' : ''}`}>
              <input
                type={mostrarRepetirContrasenia ? 'text' : 'password'}
                id="repeat-password"
                placeholder="Reingresá tu contraseña"
                value={repetirContrasenia}
                onChange={(e) => { setRepetirContrasenia(e.target.value); limpiarCampo('repetirContrasenia'); }}
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setMostrarRepetirContrasenia(!mostrarRepetirContrasenia)}
                aria-label={mostrarRepetirContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarRepetirContrasenia ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select
              id="region"
              value={region}
              className={camposError.region ? 'input-error' : ''}
              onChange={(e) => { setRegion(e.target.value); limpiarCampo('region'); }}
            >
              <option value="" disabled>Seleccioná tu región</option>
              <option value="central">Región Central</option>
              <option value="chorotega">Región Chorotega</option>
              <option value="brunca">Región Brunca</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">Registrarse</button>
        </form>

        <div className="registro-footer">
          <button
            type="button"
            onClick={() => navigate('/ingresar', { state: location.state })}
            className="login-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}
          >
            ¿Ya tenés cuenta? Iniciá sesión &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;