import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './src/routes/authRoutes.js';
import baldosaRoutes from './src/routes/baldosaRoutes.js';
import noticiaRoutes from './src/routes/noticiaRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import regionRoutes from './src/routes/regionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/baldosas', baldosaRoutes);
app.use('/api', regionRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get(['/api/ecoregiones', '/api/ecorregiones'], (req, res) => {
  try {
    const candidates = [
      path.join(__dirname, 'ecorregiones.json'),
      path.join(__dirname, 'src', 'ecorregiones.json')
    ];

    const filePath = candidates.find((p) => fs.existsSync(p));

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró ecorregiones.json'
      });
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(raw);

    if (!geojson || geojson.type !== 'FeatureCollection') {
      return res.status(500).json({
        success: false,
        error: 'El archivo GeoJSON no tiene formato válido'
      });
    }

    return res.status(200).json(geojson);
  } catch (error) {
    console.error('Error leyendo GeoJSON:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend OK' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});