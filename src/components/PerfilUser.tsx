import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noticias } from '../data/noticias';
import type { Noticia } from '../data/noticias';
import NoticiaModal from './NoticiaModal';
import SubirNoticiaModal from './SubirNoticiaModal';
import api from '../../api';
import './PerfilUser.css';

interface EditModalProps { onClose: () => void; }

const EditModal: React.FC<EditModalProps> = ({ onClose }) => {
  const { usuario, updateUsuario } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  // Extraemos los datos reales soportando usuario.data o usuario directo
  const datosUsuario = usuario?.data || usuario;

  const [form, setForm] = useState({
    nombre: datosUsuario?.nombreC || datosUsuario?.nombre || '',
    ubicacion: datosUsuario?.ubicacion || '',
    fotoPerfil: datosUsuario?.fotoPerfil || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArchivoFoto(file);

    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, fotoPerfil: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Obtenemos el ID de usuario desde AuthContext o localStorage
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
      const datosStorage = usuarioGuardado.data || usuarioGuardado;
      const idUsuario = datosUsuario?.id_usuario || datosUsuario?.id || datosStorage?.id_usuario || datosStorage?.id;

      if (!idUsuario) {
        alert('Error: No se encontró la sesión del usuario.');
        return;
      }

      let nuevoNombreC = datosUsuario?.nombreC || datosUsuario?.nombre;
      let nuevaFoto = datosUsuario?.fotoPerfil;

      const nombreForm = form.nombre.trim();
      const nombreActual = (datosUsuario?.nombreC || datosUsuario?.nombre || '').trim();

      // 2. Si el nombre cambió, realizamos la petición enviando idUsuario
      if (nombreForm && nombreForm !== nombreActual) {
        const resNombre = await api.put('/api/perfil/nombre', {
          idUsuario: Number(idUsuario), // Enviamos 'idUsuario' coincidiendo con el backend
          nombre: nombreForm
        });

        if (resNombre.data?.data?.nombreC || resNombre.data?.nombre) {
          nuevoNombreC = resNombre.data?.data?.nombreC || resNombre.data?.nombre || nombreForm;
        } else {
          nuevoNombreC = nombreForm;
        }
      }

      if (archivoFoto) {
        const formData = new FormData();
        formData.append('id_usuario', String(idUsuario));
        formData.append('foto', archivoFoto);

        const resFoto = await api.put('/api/perfil/foto', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (resFoto.data?.fotoPerfil) {
          nuevaFoto = resFoto.data.fotoPerfil;
        }
      }

      // 3. Armamos el objeto con los datos actualizados
      const usuarioActualizado = {
        ...usuario,
        nombreC: nuevoNombreC,
        fotoPerfil: nuevaFoto,
        data: {
          ...(usuario?.data || {}),
          nombreC: nuevoNombreC,
          fotoPerfil: nuevaFoto
        }
      };

      // 4. Guardamos en localStorage y actualizamos el estado global
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      updateUsuario(usuarioActualizado);

      onClose();
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Hubo un problema al guardar los cambios.');
    }
  };

  return (
    <div className="pu-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pu-modal" onClick={e => e.stopPropagation()}>
        <div className="pu-modal-header">
          <h2 className="pu-modal-title">Editar perfil</h2>
          <button className="pu-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form className="pu-modal-form" onSubmit={handleGuardar}>
          <div className="pu-modal-foto-section">
            <div className="pu-modal-foto-preview" onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}>
              {form.fotoPerfil ? <img src={form.fotoPerfil} alt="Foto" /> : (
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
              )}
              <div className="pu-modal-foto-overlay"><span>Cambiar</span></div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
          </div>
          <div className="pu-modal-field"><label>Nombre</label><input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" /></div>
          <div className="pu-modal-field"><label>Ubicación</label><input name="ubicacion" type="text" value={form.ubicacion} onChange={handleChange} placeholder="Ciudad, Provincia" /></div>
          <div className="pu-modal-actions">
            <button type="button" className="pu-modal-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="pu-modal-btn-save">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Componente principal ──
const PerfilUser: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalNoticia, setModalNoticia] = useState(false);
  const [noticiaAbierta, setNoticiaAbierta] = useState<Noticia | null>(null);

  if (!usuario) return null;

  const datos = usuario.data || usuario;

  const nombre = datos.nombreC || datos.data?.nombreC || 'Usuario Ruta Verde';
  const email = datos.email || '';
  const fotoPerfil = datos.fotoPerfil || datos.data?.fotoPerfil || usuario.fotoPerfil || '';
  const ubicacion = datos.ubicacion || '';

  const handleNoticiaClick = (noti: Noticia) => {
    setNoticiaAbierta(noti);
  };

  const handleNoticiaClose = () => {
    setNoticiaAbierta(null);
    navigate('/newsletter');
  };

  return (
    <div className="pu-page">
      <div className="pu-banner" />

      <div className="pu-body">
        <div className="pu-top-row">
          <div className="pu-avatar-wrap">
            {fotoPerfil ? (
              <img
                src={fotoPerfil}
                alt={nombre}
                className="pu-avatar-img"
                onError={() => console.error("Error al cargar la imagen con la URL:", fotoPerfil)}
              />
            ) : (
              <div className="pu-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>
          <div className="pu-acciones">
            <button className="pu-btn-editar" onClick={() => setModalPerfil(true)}>
              Editar Perfil
            </button>
            <button className="pu-btn-logout" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>

        <h1 className="pu-nombre">{nombre}</h1>
        {datos.descripcion && <p className="pu-descripcion">{datos.descripcion}</p>}
        <div className="pu-meta">
          {ubicacion && <span className="pu-meta-item">📍 {ubicacion}</span>}
          {email && <span className="pu-meta-item">✉️ {email}</span>}
        </div>

        <div className="pu-section-noticia">
          <div className="pu-section-noticia-header">
            <div>
              <h2 className="pu-section-title">Subir Noticia</h2>
              <p className="pu-section-sub">¡Escribí una noticia para que el resto del mundo vea!</p>
            </div>
            <button className="pu-btn-plus" onClick={() => setModalNoticia(true)} aria-label="Subir noticia">+</button>
          </div>
        </div>

        <div className="pu-section-recomendadas">
          <h2 className="pu-section-title">Noticias recomendadas</h2>
          <div className="pu-noticias-grid">
            {noticias.slice(0, 3).map(noti => (
              <article key={noti.id} className="pu-noticia-card" onClick={() => handleNoticiaClick(noti)}>
                <div className="pu-noticia-img-wrap">
                  <img src={noti.imagen} alt={noti.titulo} className="pu-noticia-img" />
                  <span className="pu-noticia-fecha">{noti.fecha}</span>
                </div>
                <div className="pu-noticia-body">
                  <h3 className="pu-noticia-titulo">{noti.titulo}</h3>
                  <p className="pu-noticia-desc">{noti.descripcion}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {modalPerfil && <EditModal onClose={() => setModalPerfil(false)} />}
      {modalNoticia && <SubirNoticiaModal onClose={() => setModalNoticia(false)} />}
      {noticiaAbierta && <NoticiaModal noticia={noticiaAbierta} onClose={handleNoticiaClose} />}
    </div>
  );
};

export default PerfilUser;