import { useEffect, useRef, useState } from 'react';
import api from '../services/api.js';
import { STATUS, CATEGORIAS, formatDate } from '../utils/helpers.js';
import { StatusBadge, CategoriaBadge, Spinner } from '../components/ui.jsx';

// Dynamic import of Leaflet to avoid SSR issues
let L = null;

const MARKER_COLORS = {
  ABERTA: '#ef4444',
  EM_ANALISE: '#eab308',
  EM_ANDAMENTO: '#3b82f6',
  RESOLVIDA: '#22c55e',
  CANCELADA: '#9ca3af',
};

const createMarkerIcon = (status) => {
  const color = MARKER_COLORS[status] || MARKER_COLORS.ABERTA;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 5.46 10.44 20.06 13.13 23.57a1.1 1.1 0 001.74 0C17.56 34.06 28 19.46 28 14 28 6.27 21.73 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
};

export default function MapaPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const carregarOcorrencias = async () => {
    try {
      const params = {};
      if (filtroStatus) params.status = filtroStatus;
      if (filtroCategoria) params.categoria = filtroCategoria;
      const data = await api.listarOcorrencias({ ...params, limit: 200 });
      setOcorrencias(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOcorrencias();
  }, [filtroStatus, filtroCategoria]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import('leaflet').then(leaflet => {
      L = leaflet.default;
      mapInstance.current = L.map(mapRef.current, {
        center: [-18.9186, -48.2772], // Uberlândia, MG
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

      // Try to get user location
      navigator.geolocation?.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstance.current.setView([latitude, longitude], 14);
        L.circleMarker([latitude, longitude], {
          radius: 8, color: '#2d9e35', fillColor: '#4db854',
          fillOpacity: 0.8, weight: 2
        }).addTo(mapInstance.current).bindPopup('Você está aqui');
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstance.current || !L) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    ocorrencias.forEach(oc => {
      if (!oc.latitude || !oc.longitude) return;
      const icon = createMarkerIcon(oc.status);
      const marker = L.marker([oc.latitude, oc.longitude], { icon })
        .addTo(mapInstance.current)
        .on('click', () => setSelected(oc));
      markersRef.current.push(marker);
    });
  }, [ocorrencias]);

  return (
    <div className="relative flex flex-col h-full">
      {/* Filters */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2 flex-wrap">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 px-3 py-1.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            {Object.entries(STATUS).slice(0, 4).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFiltroStatus(filtroStatus === key ? '' : key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium transition-all ${
                  filtroStatus === key ? val.cor + ' badge' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: val.dot }} />
                {val.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-[1000] bg-white rounded-2xl shadow-card border border-gray-100 p-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">Status</p>
        {Object.entries(STATUS).slice(0, 3).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ background: val.dot }} />
            <span className="text-xs text-gray-600">{val.label}</span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white rounded-2xl p-4 shadow-elevated">
          <Spinner />
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="flex-1 w-full" style={{ zIndex: 0 }} />

      {/* Occurrence detail panel */}
      {selected && (
        <div className="absolute bottom-20 left-4 right-4 z-[1000] card p-4 animate-slide-up">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <CategoriaBadge categoria={selected.categoria} />
                <StatusBadge status={selected.status} />
              </div>
              {selected.descricao && (
                <p className="text-sm text-gray-600 line-clamp-2">{selected.descricao}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{formatDate(selected.data_abertura)}</p>
            </div>
            <button onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {selected.total_apoios} apoio{selected.total_apoios !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
