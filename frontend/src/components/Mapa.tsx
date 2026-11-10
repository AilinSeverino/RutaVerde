import { useEffect, useState, useRef } from 'react';
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

const coloresPorContribuciones = [
  '#9BCC65', '#88C64A', '#73BE39', '#5FB52C', '#4EAA22',
  '#419A1D', '#358A19', '#2D7A18', '#276B17', '#215D16',
  '#1C5114', '#184612', '#143B10', '#10320D', '#0C290A',
];

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
  regionSeleccionada?: Ecorregion | null;
}

const normalizarTexto = (texto: any): string => {
  if (!texto) return '';
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

const coincideRegion = (props: any, region: Ecorregion): boolean => {
  const regionId = (region.id || '').toString().trim();
  const regionNombre = normalizarTexto(region.nombre);
  const featureId = (props.db_id || props.ECO_ID || props.id || props.id_region || '').toString().trim();
  const featureNombre = normalizarTexto(props.db_nombre || props.NOMBRE || props.ECO_NAME || props.nombre);

  return Boolean(
    (regionId && featureId && regionId === featureId) ||
    (regionNombre && featureNombre && (featureNombre.includes(regionNombre) || regionNombre.includes(featureNombre)))
  );
};

const MapaComponente: React.FC<MapaProps> = ({ 
  onSeleccionarRegion, 
  regionSeleccionada 
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [maxContribuciones, setMaxContribuciones] = useState<number>(0);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cargarYCombinarDatos = async () => {
      try {
        const respuestaGeoJson = await api.get('/api/ecorregiones');
        const rawGeoJson = respuestaGeoJson.data;

        if (cancelled) return;

        const listaEcorregiones = await obtenerEcorregiones();
        if (cancelled || !rawGeoJson?.features) return;

        const maximo = listaEcorregiones.reduce(
          (max, region) => Math.max(max, Number(region.contribuciones) || 0),
          0
        );
        setMaxContribuciones(maximo);

        const geoJsonEnriquecido = {
          ...rawGeoJson,
          features: rawGeoJson.features.map((feature: any) => {
            const props = feature.properties || {};
            
            const nombreMapa = normalizarTexto(props.NOMBRE || props.ECO_NAME || props.nombre);
            const idMapa = (props.ECO_ID || props.id || '').toString().trim();

            const regionDb = listaEcorregiones.find((item) => {
              const idItem = (item.id || '').toString().trim();
              const nombreItem = normalizarTexto(item.nombre);

              return (
                (idItem && idMapa && idItem === idMapa) ||
                (nombreItem && nombreMapa && (nombreItem.includes(nombreMapa) || nombreMapa.includes(nombreItem)))
              );
            });

            return {
              ...feature,
              properties: {
                ...props,
                db_id: regionDb ? regionDb.id : props.id || props.ECO_ID || props.id_region,
                db_nombre: regionDb ? regionDb.nombre : props.nombre || props.NOMBRE || props.ECO_NAME,
                contribuciones: regionDb ? Number(regionDb.contribuciones) || 0 : 0,
              },
            };
          }),
        };

        setGeoJsonData(geoJsonEnriquecido);
      } catch (error) {
        console.error('Error al cargar ecorregiones y GeoJSON:', error);
      }
    };

    cargarYCombinarDatos();
    return () => {
      cancelled = true;
    };
  }, []);

  const obtenerColorPorContribuciones = (contribuciones: number = 0): string => {
    if (contribuciones <= 0) return '#E0E0E0';
    if (maxContribuciones <= 1) return coloresPorContribuciones[7];

    const proporcion = contribuciones / maxContribuciones;
    const indiceColor = Math.min(
      coloresPorContribuciones.length - 1,
      Math.floor(proporcion * coloresPorContribuciones.length)
    );

    return coloresPorContribuciones[indiceColor];
  };

  const estiloEcorregiones = (feature: any) => {
    const props = feature?.properties || {};
    const cantidadContribuciones = props.contribuciones || 0;

    return {
      color: '#1e293b',
      weight: 1.2,
      dashArray: undefined,
      fillColor: obtenerColorPorContribuciones(cantidadContribuciones),
      fillOpacity: 0.7,
    };
  };

  useEffect(() => {
    const geoJsonLayer = geoJsonRef.current;
    if (!geoJsonLayer) return;

    geoJsonLayer.eachLayer((layer) => {
      const featureLayer = layer as L.Path & { feature?: { properties?: any } };
      const element = featureLayer.getElement();
      if (!element) return;

      element.classList.toggle(
        'ecorregion-seleccionada',
        Boolean(regionSeleccionada && coincideRegion(featureLayer.feature?.properties || {}, regionSeleccionada))
      );
    });
  }, [geoJsonData, regionSeleccionada]);

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const props = feature.properties || {};

        if (onSeleccionarRegion) {
          onSeleccionarRegion({
            id: props.db_id || props.id || props.ECO_ID,
            nombre: props.db_nombre || props.nombre || props.NOMBRE || props.ECO_NAME,
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
              ref={(ref) => {
                if (ref) {
                  geoJsonRef.current = ref;
                  ref.setStyle(estiloEcorregiones);
                }
              }}
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