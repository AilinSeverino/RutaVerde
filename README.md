# Ruta Verde

Monorepo con tres apps independientes:

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
npm run install:all            # instala las dependencias de las 4 carpetas
cp backend/.env.example backend/.env   # y completar los valores
npm run dev                    # levanta backend, web y backoffice juntos
```

El `.env` del backend no se sube a git: hay que pasarlo por un medio seguro.

Más detalles de cada app en `frontend/README.md` y `frontend/CLAUDE.md`.
