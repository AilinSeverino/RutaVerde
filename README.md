# Ruta Verde

Los dos repos en uno con tres apps independientes:

| Carpeta | Qué es | Puerto |
|---|---|---|
| `backend/` | API (Express + Supabase) | 5000 |
| `frontend/` | Sitio público (React + Vite) | 5173 |
| `backoffice/` | Panel de administración (React + Vite) | 5174 |

## Puesta en marcha

Requisitos: Node.js (LTS) y Git.

```bash
git clone https://github.com/AilinSeverino/RutaVerde.git
cd RutaVerde
Dependencias de la raíz: npm install concurrently --save-dev
Dependencias del backend: npm --prefix backend install express nodemailer
Dependencias del Frontend: npm --prefix frontend install
Dependencias del backoffice: npm --prefix backoffice install
Iniciar el proyecto: npm run dev
adentro de la carpeta backend creas un archivo y lo llamas .env, ahi vas a pegar todos los valores que estan en el documento. 
Iniciar el proyecto: npm run dev


Más detalles de cada app en `frontend/README.md` y `frontend/CLAUDE.md`.
