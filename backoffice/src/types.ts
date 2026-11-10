export interface NoticiaBO {
  id: number
  titulo: string
  descripcion: string
  cuerpo: string
  imagen: string
  fecha: string
  autor: string
  estado: 'pendiente' | 'publicada' | 'papelera'
}

export interface AporteBO {
  id: number
  usuario: string
  planta: string
  region: string
  tamano: string
  comentarios: string
  imagen: string
  fecha: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
}

export interface UsuarioBO {
  id: number
  nombreC: string
  email: string
  fechaR: string
  id_rol: number
  fotoPerfil?: string
  activo: boolean
}
