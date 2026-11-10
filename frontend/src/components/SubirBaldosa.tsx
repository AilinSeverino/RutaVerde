import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../context/AuthContext';
import './SubirBaldosa.css';
import './SubirNoticiaModal.css';

interface SubirBaldosaProps {
  onRegisterClick?: () => void;
}

interface Region {
  id_region: number;
  nombre: string;
}

interface Aviso {
  tipo: 'success' | 'error';
  titulo: string;
  mensaje: string;
}

const TAMANO_MIN = 1;
const TAMANO_MAX = 10000; // cm (100 m)

// Devuelve un mensaje de error, o '' si el tamaño es válido
const validarTamano = (valor: string): string => {
  const limpio = valor.trim();
  if (!limpio) return 'Ingresá el tamaño de la baldosa.';
  if (!/^\d+$/.test(limpio)) return 'Usá solo números enteros, sin comas ni letras.';
  const numero = Number(limpio);
  if (numero < TAMANO_MIN) return `El tamaño mínimo es ${TAMANO_MIN} cm.`;
  if (numero > TAMANO_MAX) return `El tamaño máximo es ${TAMANO_MAX} cm.`;
  return '';
};

const SubirBaldosa: React.FC<SubirBaldosaProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isLoggedIn, authLoading } = useAuth();

  // Estados del formulario
  const [planta, setPlanta] = useState('');
  const [region, setRegion] = useState('');
  const [regionesFiltradas, setRegionesFiltradas] = useState<Region[]>([]);
  const [plantaBuscada, setPlantaBuscada] = useState('');
  // "Buscando" mientras el texto escrito todavía no tiene resultado
  const cargandoRegiones = planta.trim() !== '' && planta.trim() !== plantaBuscada;

  const [tamano, setTamano] = useState('');
  const [tamanoTocado, setTamanoTocado] = useState(false);
  const errorTamano = validarTamano(tamano);
  const [comentarios, setComentarios] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [nombreImagen, setNombreImagen] = useState('Ningún archivo seleccionado');
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (!aviso || aviso.tipo === 'success') return;
    const timer = window.setTimeout(() => setAviso(null), 5000);
    return () => window.clearTimeout(timer);
  }, [aviso]);

  // Buscar ecorregiones asociadas a la planta mientras se escribe (con pausa de 400 ms)
  useEffect(() => {
    const termino = planta.trim();

    if (!termino) return;

    let cancelado = false;

    const timer = window.setTimeout(async () => {
      try {
        const respuesta = await api.get(`/api/regiones/por-planta?planta=${encodeURIComponent(termino)}`);
        if (cancelado) return;
        const datos = respuesta.data?.data || respuesta.data || [];
        const lista: Region[] = Array.isArray(datos) ? datos : [];

        setRegionesFiltradas(lista);
        // Si solo pertenece a 1 región, la selecciona automáticamente
        setRegion(lista.length === 1 ? String(lista[0].id_region) : '');
      } catch (error: any) {
        if (cancelado) return;
        console.error('Error al pedir las regiones por planta:', error.response?.data || error.message);
        setRegionesFiltradas([]);
        setRegion('');
      } finally {
        if (!cancelado) setPlantaBuscada(termino);
      }
    }, 400);

    return () => {
      cancelado = true;
      window.clearTimeout(timer);
    };
  }, [planta]);

  const handlePlantaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setPlanta(valor);
    if (!valor.trim()) {
      setRegionesFiltradas([]);
      setRegion('');
      setPlantaBuscada('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagenArchivo(file);
      setNombreImagen(file.name);
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subiendo || !isLoggedIn) return;

    setTamanoTocado(true);
    if (validarTamano(tamano)) {
      setAviso({
        tipo: 'error',
        titulo: 'Tamaño inválido',
        mensaje: validarTamano(tamano)
      });
      return;
    }

    if (!planta || !region || !tamano || !imagenArchivo) {
      setAviso({
        tipo: 'error',
        titulo: 'Faltan datos',
        mensaje: 'Completá los campos obligatorios y seleccioná una imagen.'
      });
      return;
    }

    try {
      setAviso(null);
      setSubiendo(true);
      const formData = new FormData();
      formData.append('nombrePlanta', planta);
      formData.append('idRegion', region);
      formData.append('tamanio', tamano);
      formData.append('comentarios', comentarios);
      formData.append('imagen', imagenArchivo);

      const respuesta = await api.post('/api/baldosas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (respuesta.status === 201 || respuesta.status === 200 || respuesta.data?.success) {
        setAviso({
          tipo: 'success',
          titulo: '¡Baldosa subida con éxito!',
          mensaje: 'Tu aporte quedó guardado y está pendiente de aprobación.'
        });
        setPlanta('');
        setRegion('');
        setRegionesFiltradas([]);
        setTamano('');
        setTamanoTocado(false);
        setComentarios('');
        setImagenArchivo(null);
        setNombreImagen('Ningún archivo seleccionado');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Error al subir la baldosa:", error.response?.data?.error || error.message);
      setAviso({
        tipo: 'error',
        titulo: 'No se pudo subir la baldosa',
        mensaje: error.response?.data?.error || 'Hubo un problema al subir el aporte. Probá de nuevo.'
      });
    } finally {
      setSubiendo(false);
    }
  };

  if (authLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Subir baldosa</h1>
          <p className="login-subtitle">Para subir un aporte necesitás tener una cuenta</p>
          <hr className="divider" />
          <div className="login-form">
            <button type="button" className="btn-login-submit" onClick={() => navigate('/ingresar', { state: { from: '/aportes' } })}>
              Iniciar sesión
            </button>
            <button type="button" className="btn-login-submit" onClick={() => navigate('/registrarse', { state: { from: '/aportes' } })}>
              Registrarme
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {aviso?.tipo === 'error' && (
        <div className={`aporte-aviso aporte-aviso--${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'} aria-live="polite">
          <span className="aporte-aviso__icono" aria-hidden="true">!</span>
          <div className="aporte-aviso__texto">
            <strong>{aviso.titulo}</strong>
            <p>{aviso.mensaje}</p>
          </div>
          <button type="button" className="aporte-aviso__cerrar" aria-label="Cerrar aviso" onClick={() => setAviso(null)}>
            ×
          </button>
        </div>
      )}
      {aviso?.tipo === 'success' && (
        <div className="pu-modal-overlay" onClick={() => setAviso(null)} role="dialog" aria-modal="true">
          <div className="pu-modal pu-modal-noticia" onClick={(event) => event.stopPropagation()}>
            <div className="pu-modal-header">
              <h2 className="pu-modal-title">Aporte enviado</h2>
              <button className="pu-modal-close" onClick={() => setAviso(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className="pu-noticia-enviada">
              <p className="pu-noticia-enviada-icon">✅</p>
              <p className="pu-noticia-enviada-titulo">¡Baldosa subida con éxito!</p>
              <p className="pu-noticia-enviada-sub">{aviso.mensaje}</p>
              <button className="pu-modal-btn-save" style={{ marginTop: '1.5rem' }} onClick={() => setAviso(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="login-card">
        <h1 className="login-title">Subir baldosa</h1>
        <p className="login-subtitle">Sumáte al corredor biológico</p>
        
        <hr className="divider" />

        <form className="login-form" onSubmit={manejarEnvio}>
          
          {/* 1. Nombre de la Planta Nativa */}
          <div className="form-group">
            <label htmlFor="planta">Planta Nativa</label>
            <input
              type="text"
              id="planta"
              value={planta}
              onChange={handlePlantaChange}
              placeholder="Ingresá el nombre de la planta (ej: Ceibo)"
              required
            />
          </div>

          {/* 2. Desplegable de Regiones Filtradas */}
          <div className="form-group">
            <label htmlFor="region">Ecorregión</label>
            <select 
              id="region" 
              value={region} 
              onChange={(e) => setRegion(e.target.value)} 
              disabled={!planta.trim() || cargandoRegiones || regionesFiltradas.length === 0}
              required
            >
              <option value="" disabled>
                {!planta.trim()
                  ? 'Escribí una planta para ver sus ecorregiones'
                  : cargandoRegiones
                  ? 'Buscando ecorregiones...'
                  : regionesFiltradas.length === 0
                  ? 'No encontramos esa planta. Revisá cómo está escrita'
                  : 'Seleccioná la ecorregión'}
              </option>
              {regionesFiltradas.map((reg) => (
                <option key={reg.id_region} value={reg.id_region}>
                  {reg.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Tamaño */}
          <div className="form-group">
            <label htmlFor="tamano">Tamaño (cm)</label>
            <input
              id="tamano"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={`Ingresá el tamaño de la baldosa en centímetros (${TAMANO_MIN} a ${TAMANO_MAX})`}
              value={tamano}
              maxLength={String(TAMANO_MAX).length}
              onChange={(e) => {
                setTamano(e.target.value.replace(/\D/g, ''));
                setTamanoTocado(true);
              }}
              onBlur={() => setTamanoTocado(true)}
              aria-invalid={tamanoTocado && !!errorTamano}
              aria-describedby="tamano-error"
              required
            />
            {tamanoTocado && errorTamano && (
              <span id="tamano-error" className="campo-error" role="alert">{errorTamano}</span>
            )}
          </div>

          {/* 4. Comentarios e Imagen */}
          <div className="form-group textarea-group">
            <label htmlFor="comentarios" className="sr-only">Comentarios</label>
            <div className="textarea-container">
              <textarea 
                id="comentarios" 
                placeholder="Comentarios..." 
                rows={4}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              ></textarea>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="sr-only" 
              />
              
              <div className="upload-icon-container" onClick={handleUploadClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="#333"/>
                </svg>
                <span className="upload-text" style={{ marginLeft: '8px', fontSize: '12px', color: '#555' }}>
                  {nombreImagen}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={subiendo}>
            {subiendo ? 'Subiendo...' : 'Subir baldosa'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubirBaldosa;