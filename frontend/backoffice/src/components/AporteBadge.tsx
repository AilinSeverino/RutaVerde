import React from 'react'
import './AporteBadge.css'

type Estado = 'pendiente' | 'publicada' | 'papelera' | 'aprobado' | 'rechazado' | 'activo' | 'suspendido'

interface Props {
  estado: Estado | string
}

const AporteBadge: React.FC<Props> = ({ estado }) => {
  return (
    <span className={`aporte-badge aporte-badge--${estado}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  )
}

export default AporteBadge
