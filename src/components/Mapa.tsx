import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../api.js';
import { obtenerEcorregiones, type Ecorregion } from '../data/ecorregiones';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

const limitesVerticales = L.latLngBounds(
  L.latLng(-60, -180),
  L.latLng(85, 180)
);

const FitBoundsHelper = ({ geoJsonData }: { geoJsonData: any }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const layer = L.geoJSON(geoJsonData);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [geoJsonData, map]);

  return null;
};

interface MapaProps {
  onSeleccionarRegion?: (region: Ecorregion) => void;
}

const MapaComponente: React.FC<MapaProps> = ({ onSeleccionarRegion }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const cargarYCombinarDatos = async () => {
      try {
        const listaEcorregiones = await obtenerEcorregiones();
        const respuestaGeoJson = await api.get('/api/ecorregiones');
        const rawGeoJson = respuestaGeoJson.data;

        if (rawGeoJson && rawGeoJson.features) {
          const geoJsonEnriquecido = {
            ...rawGeoJson,
            features: rawGeoJson.features.map((feature: any) => {
              const props = feature.properties || {};
              const nombreMapa = (props.NOMBRE || props.ECO_NAME || props.nombre || '').toLowerCase().trim();
              const idMapa = (props.ECO_ID || props.id || '').toString().trim();

              const regionDb = listaEcorregiones.find((item) => {
                const idItem = (item.id || '').toString().trim();
                const nombreItem = (item.nombre || '').toLowerCase().trim();
                return (idItem && idItem === idMapa) || (nombreItem && nombreItem === nombreMapa);
              });

              return {
                ...feature,
                properties: {
                  ...props,
                  contribuciones: regionDb ? regionDb.contribuciones : 0,
                },
              };
            }),
          };

          setGeoJsonData(geoJsonEnriquecido);
        } else {
          setGeoJsonData(rawGeoJson);
        }
      } catch (error) {
        console.error('Error al cargar ecorregiones y GeoJSON:', error);
      }
    };

    cargarYCombinarDatos();
  }, []);

  const obtenerColorPorContribuciones = (contribuciones: number = 0): string => {
    if (contribuciones >= 14) return '#21330A';
    if (contribuciones >= 13) return '#324E11';
    if (contribuciones >= 12) return '#416718';
    if (contribuciones >= 11) return '#487212';
    if (contribuciones >= 10) return '#568715';
    if (contribuciones >= 9) return '#639C19';
    if (contribuciones >= 8) return '#72B11D';
    if (contribuciones >= 7) return '#8FBE3C';
    if (contribuciones >= 6) return '#A0C958';
    if (contribuciones >= 5) return '#AFD374';
    if (contribuciones >= 4) return '#BDDC8F';
    if (contribuciones >= 3) return '#CCE5AA';
    if (contribuciones >= 2) return '#DCEDC4';
    if (contribuciones >= 1) return '#EAF4DC';
    return '#C8E6C9';
  };

  const estiloEcorregiones = (feature: any) => {
    const cantidadContribuciones = feature?.properties?.contribuciones || 0;

    return {
      color: '#1e293b',
      weight: 1.2,
      fillColor: obtenerColorPorContribuciones(cantidadContribuciones),
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const props = feature.properties || {};

        if (onSeleccionarRegion) {
          onSeleccionarRegion({
            id: props.id || props.id_region,
            nombre: props.nombre || props.NOMBRE,
            paises: props.paises || props.COUNTRY || 'América Latina',
            resumen: props.descripcion || props.resumen || 'Sin descripción disponible.',
            bioma: props.bioma || 'Ecorregión',
            contribuciones: props.contribuciones || 0,
          });
        }
      },
    });
  };

  return (
    <div className="mapa-wrapper">
      <MapContainer
        center={[-15, -60]}
        zoom={3}
        maxBounds={limitesVerticales}
        minZoom={2}
        worldCopyJump={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
          maxZoom={19}
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {geoJsonData && (
          <>
            <GeoJSON
              key={JSON.stringify(geoJsonData)}
              data={geoJsonData}
              style={estiloEcorregiones}
              onEachFeature={onEachFeature}
            />
            <FitBoundsHelper geoJsonData={geoJsonData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapaComponente;