import React, { useEffect } from 'react'
import type { NoticiaBO } from '../types'
import AporteBadge from './AporteBadge'
import './NoticiaPreviewModal.css'

interface Props {
  noticia: NoticiaBO
  onClose: () => void
}

const NoticiaPreviewModal: React.FC<Props> = ({ noticia, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="noticia-preview-overlay" onClick={onClose}>
      <div className="noticia-preview-modal" onClick={e => e.stopPropagation()}>
        {noticia.imagen && (
          <img src={noticia.imagen} alt={noticia.titulo} className="noticia-preview-modal__img" />
        )}
        <div className="noticia-preview-modal__body">
          <div className="noticia-preview-modal__meta">
            <AporteBadge estado={noticia.estado} />
            <span className="noticia-preview-modal__fecha">{noticia.fecha}</span>
            <span className="noticia-preview-modal__autor">por {noticia.autor}</span>
          </div>
          <h2 className="noticia-preview-modal__titulo">{noticia.titulo}</h2>
          <p className="noticia-preview-modal__descripcion">{noticia.descripcion}</p>
          <div className="noticia-preview-modal__cuerpo">{noticia.cuerpo}</div>
        </div>
        <div className="noticia-preview-modal__footer">
          <button className="noticia-preview-modal__close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoticiaPreviewModal
