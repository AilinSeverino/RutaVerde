import React from 'react'
import './EmptyState.css'

interface Props {
  icono?: string
  titulo?: string
  descripcion?: string
}

const EmptyState: React.FC<Props> = ({
  icono = '📭',
  titulo = 'Sin resultados',
  descripcion = 'No hay elementos para mostrar en esta sección.',
}) => {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icono}</span>
      <span className="empty-state__titulo">{titulo}</span>
      <span className="empty-state__descripcion">{descripcion}</span>
    </div>
  )
}

export default EmptyState
