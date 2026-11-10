import React from 'react'
import { useBackoffice } from '../context/BackofficeContext'
import StatsCard from '../components/StatsCard'
import NotiTableRow from '../components/NotiTableRow'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const { noticias, aportes, usuarios, actividadReciente } = useBackoffice()

  const pendientes = noticias.filter(n => n.estado === 'pendiente').length
  const publicadas = noticias.filter(n => n.estado === 'publicada').length
  const aportePend = aportes.filter(a => a.estado === 'pendiente').length

  const noticiasPendientes = noticias.filter(n => n.estado === 'pendiente').slice(0, 3)

  const actIcons: Record<string, string> = {
    noticia: '📰',
    aporte: '🌿',
    usuario: '👤',
  }

  return (
    <div>
      <h1 className="dashboard__heading">Panel de administración</h1>
      <p className="dashboard__sub">Bienvenido al backoffice de Ruta Verde</p>

      <div className="dashboard__stats">
        <StatsCard titulo="Noticias pendientes" valor={pendientes} color="#D97706" icono="⏳" />
        <StatsCard titulo="Noticias publicadas" valor={publicadas} color="var(--green-primary)" icono="✅" />
        <StatsCard titulo="Aportes pendientes" valor={aportePend} color="#3182CE" icono="🌿" />
        <StatsCard titulo="Usuarios registrados" valor={usuarios.length} color="#7C3AED" icono="👥" />
      </div>

      <div className="dashboard__section-title">📋 Noticias en revisión</div>
      {noticiasPendientes.length > 0 ? (
        <div className="dashboard__revisiones">
          <div className="dashboard__revisiones-header">
            <span></span>
            <span>Título</span>
            <span>Estado</span>
            <span></span>
          </div>
          {noticiasPendientes.map(n => (
            <NotiTableRow key={n.id} noticia={n} />
          ))}
        </div>
      ) : (
        <p className="dashboard__empty-act">No hay noticias pendientes 🎉</p>
      )}

      <div className="dashboard__section-title" style={{ marginTop: '1.5rem' }}>🕐 Actividad reciente</div>
      <div className="dashboard__actividad">
        {actividadReciente.length === 0 ? (
          <p className="dashboard__empty-act">Todavía no hay actividad registrada.</p>
        ) : (
          actividadReciente.slice(0, 10).map(item => (
            <div key={item.id} className="dashboard__actividad-item">
              <span className="dashboard__actividad-icon">{actIcons[item.tipo] ?? '🔔'}</span>
              <span className="dashboard__actividad-texto">{item.texto}</span>
              <span className="dashboard__actividad-fecha">{item.fecha}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
