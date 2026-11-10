import { useState } from 'react'
import './Configuracion.css'

interface Config {
  nombreSitio: string
  descripcionSitio: string
  emailContacto: string
  autoModeracion: boolean
  nivelModeracion: string
  notifNuevaNoticia: boolean
  notifNuevoAporte: boolean
  notifNuevoUsuario: boolean
}

const defaultConfig: Config = {
  nombreSitio: 'Ruta Verde',
  descripcionSitio: 'Plataforma de naturaleza y biodiversidad argentina',
  emailContacto: 'contacto@rutaverde.com.ar',
  autoModeracion: false,
  nivelModeracion: 'moderado',
  notifNuevaNoticia: true,
  notifNuevoAporte: true,
  notifNuevoUsuario: false,
}

const Configuracion: React.FC = () => {
  const [config, setConfig] = useState<Config>(defaultConfig)
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; msg: string } | null>(null)

  const set = <K extends keyof Config>(key: K, val: Config[K]) => {
    setConfig(prev => ({ ...prev, [key]: val }))
    setFeedback(null)
  }

  const handleGuardar = () => {
    // Validation
    if (!config.nombreSitio.trim() || !config.emailContacto.trim()) {
      setFeedback({ tipo: 'error', msg: 'Por favor completá todos los campos obligatorios.' })
      return
    }
    // Simulate save
    setTimeout(() => setFeedback(null), 3000)
    setFeedback({ tipo: 'success', msg: '✓ Configuración guardada correctamente.' })
  }

  return (
    <div>
      <h1 className="config__heading">Configuración</h1>

      {/* Sitio */}
      <div className="config__card">
        <div className="config__card-title">🌍 Sitio</div>
        <div className="config__field">
          <label className="config__label">Nombre del sitio</label>
          <input
            className="config__input"
            type="text"
            value={config.nombreSitio}
            onChange={e => set('nombreSitio', e.target.value)}
          />
        </div>
        <div className="config__field">
          <label className="config__label">Descripción</label>
          <textarea
            className="config__textarea"
            value={config.descripcionSitio}
            onChange={e => set('descripcionSitio', e.target.value)}
          />
        </div>
        <div className="config__field">
          <label className="config__label">Email de contacto</label>
          <input
            className="config__input"
            type="email"
            value={config.emailContacto}
            onChange={e => set('emailContacto', e.target.value)}
          />
        </div>
      </div>

      {/* Moderación */}
      <div className="config__card">
        <div className="config__card-title">🛡️ Moderación</div>

        <div className="config__toggle-row">
          <div>
            <div className="config__toggle-label">Moderación automática</div>
            <div className="config__toggle-desc">Aprobar contenidos automáticamente sin revisión manual</div>
          </div>
          <label className="config__toggle">
            <input
              type="checkbox"
              checked={config.autoModeracion}
              onChange={e => set('autoModeracion', e.target.checked)}
            />
            <span className="config__toggle-slider"></span>
          </label>
        </div>

        <div className="config__field" style={{ marginTop: '1rem' }}>
          <label className="config__label">Nivel de moderación</label>
          <select
            className="config__select"
            value={config.nivelModeracion}
            onChange={e => set('nivelModeracion', e.target.value)}
          >
            <option value="estricto">Estricto — Revisar todo</option>
            <option value="moderado">Moderado — Revisar contenido nuevo</option>
            <option value="permisivo">Permisivo — Solo contenido flaggeado</option>
          </select>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="config__card">
        <div className="config__card-title">🔔 Notificaciones</div>

        <div className="config__toggle-row">
          <div>
            <div className="config__toggle-label">Nueva noticia enviada</div>
            <div className="config__toggle-desc">Notificar cuando un usuario envíe una noticia para revisión</div>
          </div>
          <label className="config__toggle">
            <input
              type="checkbox"
              checked={config.notifNuevaNoticia}
              onChange={e => set('notifNuevaNoticia', e.target.checked)}
            />
            <span className="config__toggle-slider"></span>
          </label>
        </div>

        <div className="config__toggle-row">
          <div>
            <div className="config__toggle-label">Nuevo aporte recibido</div>
            <div className="config__toggle-desc">Notificar cuando llegue un nuevo aporte/baldosa pendiente</div>
          </div>
          <label className="config__toggle">
            <input
              type="checkbox"
              checked={config.notifNuevoAporte}
              onChange={e => set('notifNuevoAporte', e.target.checked)}
            />
            <span className="config__toggle-slider"></span>
          </label>
        </div>

        <div className="config__toggle-row">
          <div>
            <div className="config__toggle-label">Nuevo usuario registrado</div>
            <div className="config__toggle-desc">Notificar cuando se registre un usuario nuevo</div>
          </div>
          <label className="config__toggle">
            <input
              type="checkbox"
              checked={config.notifNuevoUsuario}
              onChange={e => set('notifNuevoUsuario', e.target.checked)}
            />
            <span className="config__toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="config__save-row">
        <button className="config__save-btn" onClick={handleGuardar}>
          Guardar cambios
        </button>
        {feedback && (
          <span className={`config__feedback config__feedback--${feedback.tipo}`}>
            {feedback.msg}
          </span>
        )}
      </div>
    </div>
  )
}

export default Configuracion
