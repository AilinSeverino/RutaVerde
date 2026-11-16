# 🌿 Ruta Verde

**Ruta Verde** es una plataforma web orientada a la difusión de noticias ambientales, el registro colaborativo de aportes ciudadanos (**Baldosas**) y la administración centralizada de contenidos y usuarios mediante un panel de **Backoffice** con verificación en dos pasos.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura de Directorios](#-estructura-de-directorios)
- [Esquema de Base de Datos (Supabase)](#-esquema-de-base-de-datos-supabase)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Configurar variables de entorno](#2-configurar-variables-de-entorno)
  - [3. Instalar dependencias y levantar servidores](#3-instalar-dependencias-y-levantar-servidores)
- [Endpoints Principales de la API](#-endpoints-principales-de-la-api)
- [Autenticación, Roles y Respaldo 2FA](#-autenticación-roles-y-respaldo-2fa)
- [Solución de Problemas Frecuentes](#-solución-de-problemas-frecuentes)

---

## ✨ Características Principales

### 🌐 Sitio Público (Frontend)
- **Landing Page Dinámica:** Carrusel de noticias aprobadas y publicadas en tiempo real (con estado vacío amigable cuando aún no existen publicaciones).
- **Sistema de Aportes (Baldosas):** Los usuarios registrados pueden subir sus propios aportes comunitarios de forma inmediata tras crear su cuenta.
- **Autenticación y Perfil:** Registro, inicio de sesión con persistencia mediante cookies `HttpOnly`, recuperación de contraseña por código y edición de perfil (nombre y foto).

### 🛠️ Panel de Administración (Backoffice)
- **Moderación de Noticias:** Aprobación, rechazo, edición, restauración y eliminación permanente de noticias.
- **Gestión de Aportes (Baldosas):** Revisión, aprobación, rechazo y borrado de los aportes enviados por la comunidad.
- **Administración de Usuarios:** Listado completo de cuentas, cambio de roles (Administrador / Usuario), activación/desactivación y eliminación segura con limpieza automática de dependencias.
- **Registro de Actividad:** Historial en tiempo real de las acciones realizadas durante la sesión administrativa.

---

## 🏗️ Arquitectura del Proyecto

El sistema está dividido en **tres módulos desacoplados** que se comunican a través de una API REST:

```text
┌─────────────────────────┐      ┌─────────────────────────┐
│     Frontend Público    │      │       Backoffice        │
│   (React + Vite :5173)  │      │   (React + Vite :5174)  │
└────────────┬────────────┘      └────────────┬────────────┘
             │         Proxy /api (Cookies)   │
             └───────────────┬────────────────┘
                             ▼
               ┌───────────────────────────┐
               │       Backend API         │
               │   (Node.js + Express)     │
               └─────────────┬─────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │   Supabase (PostgreSQL    │
               │       + Storage)          │
               └───────────────────────────┘
```

---

## 💻 Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Público** | React, TypeScript, Vite, CSS / Tailwind CSS |
| **Backoffice** | React, TypeScript, Vite, Context API |
| **Backend** | Node.js, Express, Cookie-Parser, Multer, Nodemailer |
| **Base de Datos y Storage** | Supabase (PostgreSQL + Buckets de imágenes) |

---

## 📂 Estructura de Directorios

```text
proyecto/
├── frontend/                   # Aplicación web pública (puerto 5173)
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (CarruNoti, RegistroForm, etc.)
│   │   ├── context/            # AuthContext para manejo de sesión de usuario
│   │   └── pages/              # Vistas principales de la plataforma
│   └── package.json
│
├── backoffice/                 # Panel administrativo (puerto 5174)
│   ├── src/
│   │   ├── context/            # BackofficeContext (noticias, aportes, usuarios, actividad)
│   │   ├── pages/              # Vistas de moderación y dashboard
│   │   └── types/              # Definiciones TypeScript (NoticiaBO, AporteBO, UsuarioBO)
│   └── package.json
│
├── backend/                    # Servidor API REST
│   ├── src/
│   │   ├── config/             # Configuración de clientes Supabase (público y admin)
│   │   ├── controllers/        # Lógica de controladores (auth, usuarios, noticias, baldosas)
│   │   ├── middlewares/        # Verificación de sesiones y roles (adminAuthMiddleware)
│   │   ├── routes/             # Definición de rutas /api/*
│   │   └── services/           # Servicios de negocio y envío de correos (emailService)
│   └── package.json
│
└── README.md
```

---

## 🗄️ Esquema de Base de Datos (Supabase)

El proyecto utiliza las siguientes tablas principales en PostgreSQL:

- **`Usuarios`**: Almacena los datos de los usuarios (`id_usuario`, `nombreC`, `email`, `contrasenia`, `id_rol`, `id_region`, `fotoPerfil`, `fechaR`).
- **`Roles`**: Define los niveles de acceso (`1`: Administrador, `2`: Usuario estándar).
- **`Regiones`**: Catálogo de regiones geográficas asociadas a los usuarios y aportes.
- **`Baldosa`**: Registra los aportes comunitarios enviados por los usuarios (`id_usuario` como clave foránea).
- **`Noticias` / `Noticia`**: Almacena las noticias publicadas y pendientes de moderación (`aprobada`, `id_usuario`, contenido e imágenes).

---

## 🔧 Requisitos Previos

- **Node.js** `v18.0.0` o superior
- **npm** `v9.0.0` o superior
- Una cuenta y proyecto activo en **Supabase**

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA>
```

### 2. Configurar variables de entorno

Creá un archivo `.env` dentro de la carpeta `backend/` con las siguientes claves:

```env
PORT=3000
NODE_ENV=development

# Credenciales de Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Configuración de correo (Nodemailer / SMTP para 2FA y recuperación)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

### 3. Instalar dependencias y levantar servidores

Abrí **tres terminales** independientes (una para cada módulo):

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend Público:**
```bash
cd frontend
npm install
npm run dev
```
> Disponible en: `http://localhost:5173`

**Terminal 3 — Backoffice:**
```bash
cd backoffice
npm install
npm run dev
```
> Disponible en: `http://localhost:5174`

---

## 🔌 Endpoints Principales de la API

### Autenticación y Sesión (`/api`)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/registro` | Crea un nuevo usuario e inicia sesión automáticamente (`rv_user_session`). |
| `POST` | `/api/login` | Inicia sesión; si es administrador (`id_rol = 1`), dispara código 2FA. |
| `POST` | `/api/confirmar-codigo` | Valida el código 2FA y emite la cookie `rv_admin_session`. |
| `GET` | `/api/sesion` | Verifica la sesión activa del usuario en el sitio público. |
| `GET` | `/api/backoffice/session` | Verifica la sesión administrativa activa en el backoffice. |
| `POST` | `/api/logout` / `/api/backoffice/logout` | Revoca la sesión en memoria y limpia las cookies. |

### Gestión de Recursos
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/noticias` | Lista las noticias aprobadas para la landing pública. |
| `GET` | `/api/noticias/todas` | Lista todas las noticias para el panel de moderación. |
| `PATCH` | `/api/noticias/:id/estado` | Aprueba o rechaza una noticia. |
| `GET` | `/api/baldosas/todas` | Lista todos los aportes (Baldosas) en el backoffice. |
| `PATCH` | `/api/baldosas/:id/estado` | Aprueba o rechaza un aporte ciudadano. |
| `GET` | `/api/usuarios` | Lista los usuarios registrados con su rol asociado. |
| `PATCH` | `/api/usuarios/:id/rol` | Actualiza el rol de un usuario. |
| `DELETE` | `/api/usuarios/:id` | Elimina un usuario desvinculando o limpiando registros en `Baldosa` y `Noticias`. |

---

## 🔐 Autenticación, Roles y Respaldo 2FA

- **Cookies `HttpOnly`:** Las sesiones se gestionan mediante tokens almacenados en cookies seguras (`rv_user_session` y `rv_admin_session`) con `sameSite: 'lax'`.
- **Verificación en Dos Pasos (2FA):** Al ingresar con una cuenta de rol Administrador (`id_rol === 1`), el sistema genera un código de verificación y lo envía por correo electrónico.
- **Modo Respaldo en Redes Restringidas (Fallback):** Si el servidor corre en una red con puertos SMTP bloqueados (por ejemplo, Wi-Fi institucional o escolar) y el envío del correo falla, el controlador captura el error e imprime el código 2FA directamente en la consola del backend (`[2FA FALLBACK]`) permitiendo completar el acceso sin interrupciones.

---

## 🛠️ Solución de Problemas Frecuentes

1. **Error `401 (Unauthorized)` en `/api/sesion` al abrir la web:**
   - Es el comportamiento esperado cuando navegás como visitante sin haber iniciado sesión, o tras reiniciar el servidor backend (ya que las sesiones viven en memoria RAM).
2. **El navegador no guarda la sesión al entrar desde el Backoffice:**
   - Asegurate de acceder siempre mediante `http://localhost:5173` y `http://localhost:5174` (en lugar de la IP local `192.168.x.x`) para que el proxy de Vite y las cookies compartan el mismo origen.
3. **No llega el correo con el código 2FA en redes escolares:**
   - Revisá la terminal donde se ejecuta el `backend`: allí aparecerá el código generado para poder ingresarlo manualmente en el formulario de verificación.

---

## 👥 Equipo de Desarrollo

Proyecto desarrollado como plataforma web con gestión comunitaria y panel administrativo.
