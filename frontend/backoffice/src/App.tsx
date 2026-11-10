import React, { useEffect, useState } from 'react'
import { BackofficeProvider } from './context/BackofficeContext'
import BOSidebar from './components/BOSidebar'
import BOHeader from './components/BOHeader'
import BOLayout from './components/BOLayout'
import Dashboard from './pages/Dashboard'
import Noticias from './pages/Noticias'
import Aportes from './pages/Aportes'
import Usuarios from './pages/Usuarios'
import Configuracion from './pages/Configuracion'
import { useBackoffice } from './context/BackofficeContext'
import './App.css'

type Seccion = 'dashboard' | 'noticias' | 'aportes' | 'usuarios' | 'configuracion'

const sectionTitles: Record<Seccion, string> = {
  dashboard: 'Dashboard',
  noticias: 'Noticias',
  aportes: 'Aportes / Baldosas',
  usuarios: 'Usuarios',
  configuracion: 'Configuración',
}

const BackofficeShell: React.FC = () => {
  const { authenticated, loading, cerrarSesion } = useBackoffice()
  const [seccion, setSeccion] = useState<Seccion>('dashboard')

  useEffect(() => {
    if (!loading && !authenticated) {
      window.location.replace('http://localhost:5173/')
    }
  }, [loading, authenticated])

  if (loading) {
    return <main className="bo-access-state">Verificando acceso…</main>
  }

  if (!authenticated) {
    return <main className="bo-access-state">Volviendo a Ruta Verde…</main>
  }

  const renderPage = () => {
    switch (seccion) {
      case 'dashboard': return <Dashboard />
      case 'noticias': return <Noticias />
      case 'aportes': return <Aportes />
      case 'usuarios': return <Usuarios />
      case 'configuracion': return <Configuracion />
    }
  }

  return (
    <>
      <BOSidebar
        seccionActiva={seccion}
        onNavegar={(s) => setSeccion(s as Seccion)}
        onCerrarSesion={cerrarSesion}
      />
      <BOHeader titulo={sectionTitles[seccion]} />
      <BOLayout>
        {renderPage()}
      </BOLayout>
    </>
  )
}

const App: React.FC = () => (
  <BackofficeProvider>
    <BackofficeShell />
  </BackofficeProvider>
)

export default App
