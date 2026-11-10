import React, { useState } from 'react'
import type { NoticiaBO } from '../types'
import { useBackoffice } from '../context/BackofficeContext'
import NotiTableRow from '../components/NotiTableRow'
import ConfirmModal from '../components/ConfirmModal'
import NoticiaPreviewModal from '../components/NoticiaPreviewModal'
import EmptyState from '../components/EmptyState'
import './Noticias.css'

type Tab = 'pendiente' | 'publicada' | 'papelera'

interface PendingConfirm {
  mensaje: string
  accion: () => void
  variante?: 'danger' | 'warning'
}

const Noticias: React.FC = () => {
  const { noticias, aprobarNoticia, rechazarNoticia, despublicarNoticia, restaurarNoticia, eliminarNoticia } = useBackoffice()

  const [tab, setTab] = useState<Tab>('pendiente')
  const [busqueda, setBusqueda] = useState('')
  const [preview, setPreview] = useState<NoticiaBO | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null)

  const tabs = [
    { key: 'pendiente', label: 'Pendientes', count: noticias.filter(n => n.estado === 'pendiente').length },
    { key: 'publicada', label: 'Publicadas', count: noticias.filter(n => n.estado === 'publicada').length },
    { key: 'papelera', label: 'Papelera', count: noticias.filter(n => n.estado === 'papelera').length },
  ] as const

  const filtradas = noticias
    .filter(n => n.estado === tab)
    .filter(n => busqueda === '' || n.titulo.toLowerCase().includes(busqueda.toLowerCase()))

  const doConfirm = (pending: PendingConfirm) => setConfirm(pending)

  const handleConfirmar = () => {
    if (confirm) {
      confirm.accion()
      setConfirm(null)
    }
  }

  return (
    <div>
      <h1 className="noticias__heading">Noticias</h1>

      <div className="noticias__tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`noticias__tab${tab === t.key ? ' noticias__tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="noticias__tab-badge">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="noticias__search-row">
        <input
          className="noticias__search"
          type="text"
          placeholder="Buscar por título…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="noticias__table">
        <div className="noticias__table-header">
          <span></span>
          <span>Título</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {filtradas.length === 0 ? (
          <EmptyState
            icono="📰"
            titulo="No hay noticias aquí"
            descripcion="Esta sección está vacía."
          />
        ) : (
          filtradas.map(n => (
            <NotiTableRow
              key={n.id}
              noticia={n}
              onPreview={() => setPreview(n)}
              onAprobar={() => doConfirm({
                mensaje: `¿Aprobar la noticia "${n.titulo}"?`,
                accion: () => aprobarNoticia(n.id),
                variante: 'warning',
              })}
              onRechazar={() => doConfirm({
                mensaje: `¿Enviar a papelera "${n.titulo}"?`,
                accion: () => rechazarNoticia(n.id),
                variante: 'danger',
              })}
              onPapelera={() => doConfirm({
                mensaje: `¿Despublicar "${n.titulo}" y mover a papelera?`,
                accion: () => despublicarNoticia(n.id),
                variante: 'warning',
              })}
              onRestaurar={() => doConfirm({
                mensaje: `¿Restaurar "${n.titulo}" como pendiente?`,
                accion: () => restaurarNoticia(n.id),
                variante: 'warning',
              })}
              onEliminar={() => doConfirm({
                mensaje: `¿Eliminar permanentemente "${n.titulo}"? Esta acción no se puede deshacer.`,
                accion: () => eliminarNoticia(n.id),
                variante: 'danger',
              })}
            />
          ))
        )}
      </div>

      {preview && <NoticiaPreviewModal noticia={preview} onClose={() => setPreview(null)} />}
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

export default Noticias
