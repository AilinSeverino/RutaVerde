import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../../api.js';

// Interfaz alineada exactamente con la tabla "Usuarios" de la BD
export interface Usuario {
  id_usuario: number;
  nombreC: string;
  email: string;
  contrasena?: string;
  fechaR?: string;
  id_rol?: number;
  id_region?: number;
  fotoPerfil?: string;
  [key: string]: any;
}

interface AuthContextValue {
  usuario: Usuario | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (usuario: Usuario) => void;
  logout: () => Promise<void>;
  updateUsuario: (usuario: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'ruta-verde-usuario';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.get('/api/sesion', { withCredentials: true })
      .then(({ data }) => {
        if (cancelled) return;
        const usuarioVerificado = data?.usuario as Usuario | undefined;
        if (!usuarioVerificado) throw new Error('La sesión no devolvió un usuario válido.');
        setUsuario(usuarioVerificado);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioVerificado));
        window.localStorage.removeItem('usuario');
      })
      .catch(() => {
        if (cancelled) return;
        setUsuario(null);
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem('usuario');
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (nuevoUsuario: Usuario) => {
    setUsuario(nuevoUsuario);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoUsuario));
  };

  const logout = async () => {
    const seguro = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!seguro) return;

    try {
      await api.post('/api/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error al cerrar la sesión en el servidor:', error);
    } finally {
      setUsuario(null);
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem('usuario');
    }
  };

  const updateUsuario = (datos: Partial<Usuario>) => {
    setUsuario((prev) => {
      const siguiente = prev ? { ...prev, ...datos } : (datos as Usuario);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      isLoggedIn: !authLoading && Boolean(usuario),
      authLoading,
      login,
      logout,
      updateUsuario,
    }),
    [usuario, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }

  return context;
}