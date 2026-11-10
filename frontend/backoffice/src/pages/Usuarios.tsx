import React, { useState } from 'react'
import { useBackoffice } from '../context/BackofficeContext'
import AporteBadge from '../components/AporteBadge'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import './Usuarios.css'

type FiltroRol = 'todos' | 'admin' | 'usuario'

interface PendingConfirm {
  mensaje: string
  accion: () => void
  variante?: 'danger' | 'warning'
}

const Usuarios: React.FC = () => {
  const { usuarios, toggleActivoUsuario, cambiarRolUsuario, eliminarUsuario } = useBackoffice()

  const [filtro, setFiltro] = useState<FiltroRol>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null)

  const tabs = [
    { key: 'todos', label: 'Todos', count: usuarios.length },
    { key: 'admin', label: 'Admins', count: usuarios.filter(u => u.id_rol === 1).length },
    { key: 'usuario', label: 'Usuarios', count: usuarios.filter(u => u.id_rol === 2).length },
  ] as const

  const filtrados = usuarios
    .filter(u => filtro === 'todos' || (filtro === 'admin' ? u.id_rol === 1 : u.id_rol === 2))
    .filter(u => busqueda === '' ||
      u.nombreC.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
    )

  const doConfirm = (pending: PendingConfirm) => setConfirm(pending)

  const handleConfirmar = () => {
    if (confirm) { confirm.accion(); setConfirm(null) }
  }

  return (
    <div>
      <h1 className="usuarios__heading">Usuarios</h1>

      <div className="usuarios__toolbar">
        <input
          className="usuarios__search"
          type="text"
          placeholder="Buscar por nombre o email…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="usuarios__tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`usuarios__tab${filtro === t.key ? ' usuarios__tab--active' : ''}`}
            onClick={() => setFiltro(t.key)}
          >
            {t.label}
            <span className="usuarios__tab-badge">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="usuarios__table">
        <div className="usuarios__table-header">
          <span></span>
          <span>Nombre</span>
          <span>Email</span>
          <span>Registro</span>
          <span>Rol</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            icono="👥"
            titulo="No hay usuarios aquí"
            descripcion="No se encontraron usuarios con ese criterio."
          />
        ) : (
          filtrados.map(u => (
            <div key={u.id} className="usuario-row">
              <div className="usuario-row__avatar">
                {u.fotoPerfil ? (
                  <img src={u.fotoPerfil} alt={u.nombreC} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  u.nombreC.charAt(0).toUpperCase()
                )}
              </div>

              <div className="usuario-row__nombre">{u.nombreC}</div>
              <div className="usuario-row__email">{u.email}</div>
              <div className="usuario-row__fecha">{u.fechaR}</div>

              <select
                className="usuario-row__rol-select"
                value={u.id_rol}
                onChange={e => doConfirm({
                  mensaje: `¿Cambiar el rol de ${u.nombreC}?`,
                  accion: () => cambiarRolUsuario(u.id, Number(e.target.value)),
                  variante: 'warning',
                })}
              >
                <option value={1}>Admin</option>
                <option value={2}>Usuario</option>
              </select>

              <AporteBadge estado={u.activo ? 'activo' : 'suspendido'} />

              <div className="usuario-row__actions">
                <button
                  className={`usuario-row__btn ${u.activo ? 'usuario-row__btn--toggle-activo' : 'usuario-row__btn--toggle-inactivo'}`}
                  onClick={() => doConfirm({
                    mensaje: u.activo
                      ? `¿Suspender a ${u.nombreC}?`
                      : `¿Reactivar a ${u.nombreC}?`,
                    accion: () => toggleActivoUsuario(u.id),
                    variante: u.activo ? 'danger' : 'warning',
                  })}
                >
                  {u.activo ? '🔒 Suspender' : '🔓 Reactivar'}
                </button>
                <button
                  className="usuario-row__btn usuario-row__btn--eliminar"
                  onClick={() => doConfirm({
                    mensaje: `¿Eliminar a ${u.nombreC}? Esta acción no se puede deshacer.`,
                    accion: () => eliminarUsuario(u.id),
                    variante: 'danger',
                  })}
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirm && (
        <ConfirmModal
          mensaje={confirm.mensaje}
          variante={confirm.variante}
          onConfirmar={handleConfirmar}
          onCancelar={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

export default Usuarios
