import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { CATEGORIAS, STATUS, formatDate, distancia } from '../utils/helpers.js';
import { StatusBadge, CategoriaBadge, Spinner, EmptyState } from '../components/ui.jsx';

const OcorrenciaCard = ({ oc, onApoiar, userLat, userLng }) => {
  const [apoiando, setApoiando] = useState(false);
  const [apoiou, setApoiou] = useState(oc.apoiou);
  const [totalApoios, setTotalApoios] = useState(oc.total_apoios);

  const handleApoiar = async () => {
    if (apoiando) return;
    setApoiando(true);
    try {
      if (apoiou) {
        await api.removerApoio(oc.id);
        setApoiou(false);
        setTotalApoios(t => Math.max(0, t - 1));
      } else {
        await api.apoiar(oc.id);
        setApoiou(true);
        setTotalApoios(t => t + 1);
      }
    } catch {}
    setApoiando(false);
  };

  const dist = userLat && oc.latitude
    ? distancia(userLat, userLng, oc.latitude, oc.longitude)
    : null;

  const cat = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;

  return (
    <div className="card p-4 animate-fade-in">
      {/* Image if available */}
      {oc.foto_url && (
        <div className="h-40 bg-gray-100 rounded-2xl overflow-hidden mb-3 -mx-0">
          <img src={oc.foto_url} alt="Ocorrência" className="w-full h-full object-cover" />
        </div>
      )}
      {!oc.foto_url && (
        <div className="h-32 bg-gradient-to-br from-eco-50 to-eco-100 rounded-2xl flex items-center justify-center mb-3 text-4xl">
          {cat.emoji}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoriaBadge categoria={oc.categoria} />
          <StatusBadge status={oc.status} />
        </div>
        {dist !== null && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            {dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`}
          </span>
        )}
      </div>

      {oc.descricao && (
        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{oc.descricao}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{formatDate(oc.data_abertura)}</span>
        <button
          onClick={handleApoiar}
          disabled={apoiando}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            apoiou
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-600 hover:bg-eco-50 hover:text-eco-600'
          }`}
        >
          <svg className={`w-4 h-4 ${apoiou ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`}
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {totalApoios} apoio{totalApoios !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default function FeedPage() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);

  const carregar = useCallback(async (lat, lng) => {
    try {
      const data = await api.feedVizinhanca(lat, lng);
      setOcorrencias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const pos2 = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(pos2);
        carregar(pos2.lat, pos2.lng);
      },
      () => carregar(null, null)
    );
  }, [carregar]);

  if (loading) return (
    <div className="flex justify-center pt-16">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Ocorrências num raio de 5 km da sua localização
      </p>

      {ocorrencias.length === 0 ? (
        <EmptyState
          icon="🏙️"
          title="Nenhuma ocorrência por aqui"
          subtitle="Seja o primeiro a reportar um problema na sua vizinhança!"
        />
      ) : (
        <div className="space-y-3">
          {ocorrencias.map(oc => (
            <OcorrenciaCard
              key={oc.id}
              oc={oc}
              userLat={userPos?.lat}
              userLng={userPos?.lng}
            />
          ))}
        </div>
      )}
    </div>
  );
}
