import { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { CATEGORIAS, fileToBase64 } from '../utils/helpers.js';
import { Spinner } from '../components/ui.jsx';

export default function NovaOcorrenciaPage({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocalizacao({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const handleFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFotoPreview(preview);
    const b64 = await fileToBase64(file);
    setFoto(b64);
  };

  const handleSubmit = async () => {
    if (!categoria) { setError('Selecione uma categoria'); return; }
    if (!localizacao) { setError('Não foi possível obter sua localização'); return; }
    setLoading(true);
    setError('');
    try {
      await api.criarOcorrencia({
        categoria,
        descricao: descricao.trim() || null,
        latitude: localizacao.lat,
        longitude: localizacao.lng,
        foto_url: foto,
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-eco-600 font-medium uppercase tracking-wide">Ecomap</p>
          <h1 className="font-semibold text-gray-900">Nova ocorrência</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Step 1: Photo */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">
            <span className="text-eco-600 mr-2">1.</span>Foto do problema
          </h2>
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed cursor-pointer
              transition-all overflow-hidden
              ${fotoPreview ? 'border-eco-400' : 'border-eco-200 hover:border-eco-400 bg-eco-50/50'}`}
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Toque para capturar</span>
              </div>
            )}
            {fotoPreview && (
              <button
                onClick={(e) => { e.stopPropagation(); setFoto(null); setFotoPreview(null); }}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={handleFoto} />
        </section>

        {/* Step 2: Category */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">
            <span className="text-eco-600 mr-2">2.</span>Categoria
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIAS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setCategoria(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center
                  ${categoria === key
                    ? 'border-eco-500 bg-eco-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-eco-200'
                  }`}
              >
                <span className="text-2xl">{val.emoji}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">{val.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Description */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">
            <span className="text-eco-600 mr-2">3.</span>Descrição <span className="text-gray-400 font-normal">(opcional)</span>
          </h2>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Conte rapidamente o que está acontecendo..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={500}
          />
        </section>

        {/* Location info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-eco-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {localizacao
            ? `GPS: ${localizacao.lat.toFixed(5)}, ${localizacao.lng.toFixed(5)}`
            : 'Obtendo localização...'
          }
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !categoria || !localizacao}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" color="white" /> : null}
          Enviar ocorrência
        </button>

        <div className="h-8" />
      </div>
    </div>
  );
}
