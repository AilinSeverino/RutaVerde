import React, { useState, useEffect } from 'react'
import type { AporteBO } from '../types'
import { useBackoffice } from '../context/BackofficeContext'
import AporteBadge from '../components/AporteBadge'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import './Aportes.css'

type Tab = 'pendiente' | 'aprobado' | 'rechazado'

interface PendingConfirm {
  mensaje: string
  accion: () => void
  variante?: 'danger' | 'warning'
}

interface AporteDetailModalProps {
  aporte: AporteBO
  onClose: () => void
}

const AporteDetailModal: React.FC<AporteDetailModalProps> = ({ aporte, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="aporte-detail-overlay" onClick={onClose}>
      <div className="aporte-detail-modal" onClick={e => e.stopPropagation()}>
        {aporte.imagen && (
          <img src={aporte.imagen} alt={aporte.planta} className="aporte-detail-modal__img" />
        )}
        <div className="aporte-detail-modal__body">
          <h2 className="aporte-detail-modal__title">{aporte.planta}</h2>
          <div className="aporte-detail-modal__fields">
            <div className="aporte-detail-modal__field">
              <label>Usuario</label>
              <span>{aporte.usuario}</span>
            </div>
            <div className="aporte-detail-modal__field">
              <label>Región</label>
              <span>{aporte.region}</span>
            </div>
            <div className="aporte-detail-modal__field">
              <label>Tamaño</label>
              <span>{aporte.tamano}</span>
            </div>
            <div className="aporte-detail-modal__field">
              <label>Fecha</label>
              <span>{aporte.fecha}</span>
            </div>
            <div className="aporte-detail-modal__field">
              <label>Estado</label>
              <AporteBadge estado={aporte.estado} />
            </div>
          </div>
          <div className="aporte-detail-modal__comentarios">
            <strong>Comentarios:</strong>
            <p>{aporte.comentarios}</p>
          </div>
        </div>
        <div className="aporte-detail-modal__footer">
          <button className="aporte-detail-modal__close" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

const Aportes: React.FC = () => {
  const { aportes, aprobarAporte, rechazarAporte, eliminarAporte } = useBackoffice()

  const [tab, setTab] = useState<Tab>('pendiente')
  const [detalle, setDetalle] = useState<AporteBO | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null)

  const tabs = [
    { key: 'pendiente', label: 'Pendientes', count: aportes.filter(a => a.estado === 'pendiente').length },
    { key: 'aprobado', label: 'Aprobados', count: aportes.filter(a => a.estado === 'aprobado').length },
    { key: 'rechazado', label: 'Rechazados', count: aportes.filter(a => a.estado === 'rechazado').length },
  ] as const

  const filtrados = aportes.filter(a => a.estado === tab)

  const doConfirm = (pending: PendingConfirm) => setConfirm(pending)

  const handleConfirmar = () => {
    if (confirm) { confirm.accion(); setConfirm(null) }
  }

  return (
    <div>
      <h1 className="aportes__heading">Aportes / Baldosas</h1>

      <div className="aportes__tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`aportes__tab${tab === t.key ? ' aportes__tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="aportes__tab-badge">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="aportes__table">
        <div className="aportes__table-header">
          <span>Foto</span>
          <span>Planta / Lugar</span>
          <span>Info</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            icono="🌿"
            titulo="No hay aportes aquí"
            descripcion="Esta sección está vacía."
          />
        ) : (
          filtrados.map(a => (
            <div key={a.id} className="aporte-row">
              {a.imagen ? (
                <img src={a.imagen} alt="" className="aporte-row__img" />
              ) : (
                <div className="aporte-row__img-placeholder">🌿</div>
              )}

              <div className="aporte-row__main">
                <div className="aporte-row__planta">{a.planta}</div>
                <div className="aporte-row__meta">{a.region} · {a.fecha}</div>
              </div>

              <div className="aporte-row__info">
                <div><strong>Por:</strong> {a.usuario}</div>
                <div><strong>Tamaño:</strong> {a.tamano}</div>
              </div>

              <AporteBadge estado={a.estado} />

              <div className="aporte-row__actions">
                <button className="aporte-row__btn aporte-row__btn--ver" onClick={() => setDetalle(a)}>Ver</button>
                {a.estado !== 'aprobado' && (
                  <button className="aporte-row__btn aporte-row__btn--aprobar" onClick={() => doConfirm({
                    mensaje: `¿Aprobar el aporte de ${a.usuario}?`,
                    accion: () => aprobarAporte(a.id),
                    variante: 'warning',
                  })}>Aprobar</button>
                )}
                {a.estado !== 'rechazado' && (
                  <button className="aporte-row__btn aporte-row__btn--rechazar" onClick={() => doConfirm({
                    mensaje: `¿Rechazar el aporte de ${a.usuario}?`,
                    accion: () => rechazarAporte(a.id),
                    variante: 'danger',
                  })}>Rechazar</button>
                )}
                <button className="aporte-row__btn aporte-row__btn--eliminar" onClick={() => doConfirm({
                  mensaje: `¿Eliminar el aporte de ${a.usuario}? Esta acción no se puede deshacer.`,
                  accion: () => eliminarAporte(a.id),
                  variante: 'danger',
                })}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {detalle && <AporteDetailModal aporte={detalle} onClose={() => setDetalle(null)} />}
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

export default Aportes
