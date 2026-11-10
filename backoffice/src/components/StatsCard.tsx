import React from 'react'
import './StatsCard.css'

interface Props {
  titulo: string
  valor: number | string
  color?: string
  icono?: string
}

const StatsCard: React.FC<Props> = ({ titulo, valor, color, icono }) => {
  return (
    <div className="stats-card" style={{ borderTopColor: color ?? 'var(--green-primary)' }}>
      {icono && <span className="stats-card__icon">{icono}</span>}
      <span className="stats-card__valor">{valor}</span>
      <span className="stats-card__titulo">{titulo}</span>
    </div>
  )
}

export default StatsCard
