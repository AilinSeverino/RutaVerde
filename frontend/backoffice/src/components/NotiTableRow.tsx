import React from 'react'
import type { NoticiaBO } from '../types'
import AporteBadge from './AporteBadge'
import './NotiTableRow.css'

interface Props {
  noticia: NoticiaBO
  onAprobar?: () => void
  onRechazar?: () => void
  onPapelera?: () => void
  onRestaurar?: () => void
  onEliminar?: () => void
  onPreview?: () => void
}

const NotiTableRow: React.FC<Props> = ({
  noticia,
  onAprobar,
  onRechazar,
  onPapelera,
  onRestaurar,
  onEliminar,
  onPreview,
}) => {
  return (
    <div className="noti-row">
      {noticia.imagen ? (
        <img src={noticia.imagen} alt="" className="noti-row__img" />
      ) : (
        <div className="noti-row__img-placeholder">📰</div>
      )}

      <div className="noti-row__info">
        <div className="noti-row__titulo">{noticia.titulo}</div>
        <div className="noti-row__meta">{noticia.fecha} · {noticia.autor}</div>
      </div>

      <AporteBadge estado={noticia.estado} />

      <div className="noti-row__actions">
        {onPreview && (
          <button className="noti-row__btn noti-row__btn--preview" onClick={onPreview}>
            Ver
          </button>
        )}
        {noticia.estado === 'pendiente' && (
          <>
            {onAprobar && <button className="noti-row__btn noti-row__btn--aprobar" onClick={onAprobar}>Aprobar</button>}
            {onRechazar && <button className="noti-row__btn noti-row__btn--rechazar" onClick={onRechazar}>Rechazar</button>}
          </>
        )}
        {noticia.estado === 'publicada' && (
          <>
            {onPapelera && <button className="noti-row__btn noti-row__btn--papelera" onClick={onPapelera}>Papelera</button>}
          </>
        )}
        {noticia.estado === 'papelera' && (
          <>
            {onRestaurar && <button className="noti-row__btn noti-row__btn--restaurar" onClick={onRestaurar}>Restaurar</button>}
            {onEliminar && <button className="noti-row__btn noti-row__btn--eliminar" onClick={onEliminar}>Eliminar</button>}
          </>
        )}
      </div>
    </div>
  )
}

export default NotiTableRow
