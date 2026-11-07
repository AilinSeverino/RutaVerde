import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { NoticiaBO, AporteBO, UsuarioBO } from '../types'

const API_URL = '/api'

interface ActividadItem {
  id: number
  texto: string
  fecha: string
  tipo: 'noticia' | 'aporte' | 'usuario'
}

interface BackofficeContextValue {
  noticias: NoticiaBO[]
  aportes: AporteBO[]
  usuarios: UsuarioBO[]
  actividadReciente: ActividadItem[]
  loading: boolean
  authenticated: boolean
  cerrarSesion: () => Promise<void>
  // Noticia actions
  aprobarNoticia: (id: number) => Promise<void>
  rechazarNoticia: (id: number) => Promise<void>
  restaurarNoticia: (id: number) => Promise<void>
  despublicarNoticia: (id: number) => Promise<void>
  eliminarNoticia: (id: number) => Promise<void>
  editarNoticia: (id: number, campos: Partial<NoticiaBO>) => Promise<void>
  // Aporte actions (Baldosas)
  aprobarAporte: (id: number) => Promise<void>
  rechazarAporte: (id: number) => Promise<void>
  eliminarAporte: (id: number) => Promise<void>
  // Usuario actions
  toggleActivoUsuario: (id: number) => Promise<void>
  cambiarRolUsuario: (id: number, nuevoRol: number) => Promise<void>
  eliminarUsuario: (id: number) => Promise<void>
}

const BackofficeContext = createContext<BackofficeContextValue | null>(null)

export const BackofficeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [noticias, setNoticias] = useState<NoticiaBO[]>([])
  const [aportes, setAportes] = useState<AporteBO[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioBO[]>([])
  const [actividadReciente, setActividadReciente] = useState<ActividadItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  const addActividad = (texto: string, tipo: ActividadItem['tipo']) => {
    setActividadReciente(prev => [
      { id: Date.now(), texto, fecha: new Date().toLocaleString('es-AR'), tipo },
      ...prev.slice(0, 19),
    ])
  }

  useEffect(() => {
    let cancelled = false

    const cargarDatos = async () => {
      setLoading(true)
      try {
        const respuestaSesion = await fetch(`${API_URL}/backoffice/session`, { credentials: 'include' })
        if (!respuestaSesion.ok) {
          setAuthenticated(false)
          return
        }

        setAuthenticated(true)
        const [resNoticias, resAportes, resUsuarios] = await Promise.all([
          fetch(`${API_URL}/noticias/todas`, { credentials: 'include' }),
          fetch(`${API_URL}/baldosas/todas`, { credentials: 'include' }),
          fetch(`${API_URL}/usuarios`, { credentials: 'include' })
        ])

        if (cancelled) return
        if ([resNoticias, resAportes, resUsuarios].some((response) => response.status === 401)) {
          setAuthenticated(false)
          return
        }

        if (resNoticias.ok) {
          const dataNoticias = await resNoticias.json()
          setNoticias(dataNoticias.data || dataNoticias)
        }
        if (resAportes.ok) {
          const dataAportes = await resAportes.json()
          setAportes(dataAportes.data || dataAportes)
        }
        if (resUsuarios.ok) {
          const dataUsuarios = await resUsuarios.json()
          setUsuarios(dataUsuarios.data || dataUsuarios)
        }
      } catch (error) {
        console.error('Error al cargar datos del backoffice:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    cargarDatos()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<BackofficeContextValue>(() => ({
    noticias,
    aportes,
    usuarios,
    actividadReciente,
    loading,
    authenticated,

    cerrarSesion: async () => {
      try {
        await fetch(`${API_URL}/backoffice/logout`, { method: 'POST', credentials: 'include' })
      } catch (err) {
        console.error(err)
      }
      setAuthenticated(false)
      setNoticias([])
      setAportes([])
      setUsuarios([])
    },

    // --- ACCIONES DE NOTICIAS ---
    aprobarNoticia: async (id) => {
      try {
        const res = await fetch(`${API_URL}/noticias/${id}/estado`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aprobada: true })
        })
        if (res.ok) {
          setNoticias(prev => prev.map(n => n.id === id ? { ...n, estado: 'publicada', aprobada: true } : n))
          addActividad(`Noticia #${id} aprobada`, 'noticia')
        }
      } catch (err) {
        console.error(err)
      }
    },

    rechazarNoticia: async (id) => {
      try {
        const res = await fetch(`${API_URL}/noticias/${id}/estado`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aprobada: false })
        })
        if (res.ok) {
          setNoticias(prev => prev.map(n => n.id === id ? { ...n, estado: 'papelera', aprobada: false } : n))
          addActividad(`Noticia #${id} rechazada`, 'noticia')
        }
      } catch (err) {
        console.error(err)
      }
    },

    restaurarNoticia: async (id) => {
      setNoticias(prev => prev.map(n => n.id === id ? { ...n, estado: 'pendiente' } : n))
      addActividad(`Noticia #${id} restaurada`, 'noticia')
    },

    despublicarNoticia: async (id) => {
      await value.rechazarNoticia(id)
    },

    eliminarNoticia: async (id) => {
      try {
        const res = await fetch(`${API_URL}/noticias/${id}`, { method: 'DELETE', credentials: 'include' })
        if (res.ok) {
          setNoticias(prev => prev.filter(n => n.id !== id))
          addActividad(`Noticia #${id} eliminada permanentemente`, 'noticia')
        }
      } catch (err) {
        console.error(err)
      }
    },

    editarNoticia: async (id, campos) => {
      try {
        const res = await fetch(`${API_URL}/noticias/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campos)
        })
        if (res.ok) {
          setNoticias(prev => prev.map(n => n.id === id ? { ...n, ...campos } : n))
          addActividad(`Noticia #${id} editada`, 'noticia')
        }
      } catch (err) {
        console.error(err)
      }
    },

    // --- ACCIONES DE APORTES (BALDOSAS) ---
    aprobarAporte: async (id) => {
      try {
        const res = await fetch(`${API_URL}/baldosas/${id}/estado`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aprobada: true })
        })
        if (res.ok) {
          setAportes(prev => prev.map(a => a.id === id ? { ...a, estado: 'aprobado', aprobada: true } : a))
          addActividad(`Aporte #${id} aprobado`, 'aporte')
        }
      } catch (err) {
        console.error(err)
      }
    },

    rechazarAporte: async (id) => {
      try {
        const res = await fetch(`${API_URL}/baldosas/${id}/estado`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aprobada: false })
        })
        if (res.ok) {
          setAportes(prev => prev.map(a => a.id === id ? { ...a, estado: 'rechazado', aprobada: false } : a))
          addActividad(`Aporte #${id} rechazado`, 'aporte')
        }
      } catch (err) {
        console.error(err)
      }
    },

    eliminarAporte: async (id) => {
      try {
        const res = await fetch(`${API_URL}/baldosas/${id}`, { method: 'DELETE', credentials: 'include' })
        if (res.ok) {
          setAportes(prev => prev.filter(a => a.id !== id))
          addActividad(`Aporte #${id} eliminado`, 'aporte')
        }
      } catch (err) {
        console.error(err)
      }
    },

    // --- ACCIONES DE USUARIOS ---
    toggleActivoUsuario: async (id) => {
      const usuario = usuarios.find(u => u.id === id)
      if (!usuario) return
      try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activo: !usuario.activo })
        })
        if (res.ok) {
          setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u))
          addActividad(`Usuario #${id} actualizado`, 'usuario')
        }
      } catch (err) {
        console.error(err)
      }
    },

    cambiarRolUsuario: async (id, nuevoRol) => {
      try {
        const res = await fetch(`${API_URL}/usuarios/${id}/rol`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_rol: nuevoRol })
        })
        if (res.ok) {
          setUsuarios(prev => prev.map(u => u.id === id ? { ...u, id_rol: nuevoRol } : u))
          addActividad(`Rol de usuario #${id} cambiado`, 'usuario')
        }
      } catch (err) {
        console.error(err)
      }
    },

    eliminarUsuario: async (id) => {
      try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE', credentials: 'include' })
        if (res.ok) {
          setUsuarios(prev => prev.filter(u => u.id !== id))
          addActividad(`Usuario #${id} eliminado`, 'usuario')
        }
      } catch (err) {
        console.error(err)
      }
    },
  }), [noticias, aportes, usuarios, actividadReciente, loading, authenticated])

  return (
    <BackofficeContext.Provider value={value}>
      {children}
    </BackofficeContext.Provider>
  )
}

export const useBackoffice = (): BackofficeContextValue => {
  const ctx = useContext(BackofficeContext)
  if (!ctx) throw new Error('useBackoffice must be used within BackofficeProvider')
  return ctx
}