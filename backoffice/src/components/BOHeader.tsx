import React from 'react'
import './BOHeader.css'

interface Props {
  titulo: string
}

const BOHeader: React.FC<Props> = ({ titulo }) => {
  return (
    <header className="bo-header">
      <span className="bo-header__titulo">{titulo}</span>
      <div className="bo-header__user">
        <div className="bo-header__user-info">
          <span className="bo-header__user-name">Administrador</span>
          <span className="bo-header__badge">Admin</span>
        </div>
        <div className="bo-header__avatar">A</div>
      </div>
    </header>
  )
}

export default BOHeader
