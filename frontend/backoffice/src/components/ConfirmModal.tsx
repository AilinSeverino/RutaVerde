import React, { useEffect } from 'react'
import './ConfirmModal.css'

interface Props {
  mensaje: string
  onConfirmar: () => void
  onCancelar: () => void
  variante?: 'danger' | 'warning'
}

const ConfirmModal: React.FC<Props> = ({ mensaje, onConfirmar, onCancelar, variante = 'danger' }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancelar])

  return (
    <div className="confirm-overlay" onClick={onCancelar}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className={`confirm-modal__icon confirm-modal__icon--${variante}`}>
          {variante === 'danger' ? '⚠️' : '❓'}
        </div>
        <p className="confirm-modal__mensaje">{mensaje}</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${variante}`}
            onClick={onConfirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
