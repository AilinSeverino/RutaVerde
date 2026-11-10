# Ruta Verde

Los dos repos en uno con tres apps independientes:

| Carpeta | Qué es | Puerto |
|---|---|---|
| `backend/` | API (Express + Supabase) | 5000 |
| `frontend/` | Sitio público (React + Vite) | 5173 |
| `backoffice/` | Panel de administración (React + Vite) | 5174 |

## Puesta en marcha

Requisitos: tenes instalado Node.js (LTS) y Git.

```bash
git clone https://github.com/AilinSeverino/RutaVerde.git
cd RutaVerde
# 1. Instalar dependencias de la raíz
 npm install concurrently --save-dev

# 2. Instalar dependencias del Backend
npm --prefix backend install express nodemailer

# 3. Instalar dependencias del Frontend 
 npm --prefix frontend install

# 4. Instalar dependencias del Backoffice 
npm --prefix backoffice install

#5. Iniciar el proyecto
npm run dev
