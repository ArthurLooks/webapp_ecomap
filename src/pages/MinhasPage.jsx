import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { CATEGORIAS, STATUS, formatDate, formatDateFull } from '../utils/helpers.js';
import { StatusBadge, CategoriaBadge, Spinner, EmptyState } from '../components/ui.jsx';

const OcorrenciaItem = ({ oc, onClick }) => {
  const cat = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;
  return (
    <button
      onClick={() => onClick(oc)}
      className="w-full card p-4 text-left hover:shadow-card-hover transition-shadow animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${cat.cor} flex items-center justify-center text-xl flex-shrink-0`}>
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-sm text-gray-800">{cat.label}</span>
            <StatusBadge status={oc.status} />
          </div>
          {oc.descricao && (
            <p className="text-xs text-gray-500 line-clamp-1">{oc.descricao}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{formatDate(oc.data_abertura)}</p>
        </div>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

const NotificacaoItem = ({ n, onLida }) => (
  <div className={`card p-4 animate-fade-in ${n.lida ? 'opacity-60' : ''}`}>
    <div className="flex items-start gap-3">
      {!n.lida && <div className="w-2 h-2 rounded-full bg-eco-500 mt-1.5 flex-shrink-0" />}
      {n.lida && <div className="w-2 h-2 mt-1.5 flex-shrink-0" />}
      <div className="flex-1">
        <p className="font-medium text-sm text-gray-800">{n.titulo}</p>
        <p className="text-xs text-gray-600 mt-0.5">{n.mensagem}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(n.data_envio)}</p>
      </div>
      {!n.lida && (
        <button onClick={() => onLida(n.id)}
          className="text-xs text-eco-600 hover:text-eco-700 flex-shrink-0">
          Marcar lida
        </button>
      )}
    </div>
  </div>
);

const OcorrenciaDetail = ({ oc, onClose }) => {
  const cat = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;
  const statusFlow = ['ABERTA', 'EM_ANALISE', 'EM_ANDAMENTO', 'RESOLVIDA'];
  const currentIdx = statusFlow.indexOf(oc.status);

  return (
    <div className="fixed inset-0 bg-surface z-50 overflow-auto animate-slide-up">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100 sticky top-0">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">Detalhes da ocorrência</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Status timeline */}
          <div className="card p-4">
            <p className="font-semibold text-sm text-gray-700 mb-3">Linha do tempo</p>
            <div className="flex items-center gap-0">
              {statusFlow.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-30'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${active ? 'bg-eco-600 text-white' : done ? 'bg-eco-200 text-eco-700' : 'bg-gray-100 text-gray-400'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className="text-xs text-gray-500 text-center leading-tight w-16">{STATUS[s]?.label}</span>
                    </div>
                    {i < statusFlow.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-5 ${i < currentIdx ? 'bg-eco-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo */}
          {oc.foto_url && (
            <div className="rounded-3xl overflow-hidden aspect-video bg-gray-100">
              <img src={oc.foto_url} alt="Ocorrência" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Resolution photo */}
          {oc.foto_resolucao_url && (
            <div className="card p-4">
              <p className="font-semibold text-sm text-eco-700 mb-2 flex items-center gap-2">
                🎉 Foto da resolução
              </p>
              <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100">
                <img src={oc.foto_resolucao_url} alt="Resolução" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-xl ${cat.cor} flex items-center justify-center text-xl`}>{cat.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800">{cat.label}</p>
                <StatusBadge status={oc.status} />
              </div>
            </div>
            {oc.descricao && <p className="text-sm text-gray-600">{oc.descricao}</p>}
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>Aberta em: {formatDateFull(oc.data_abertura)}</p>
              <p>Última atualização: {formatDateFull(oc.data_atualizacao)}</p>
              <p>Apoios: {oc.total_apoios}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MinhasPage() {
  const [tab, setTab] = useState('historico');
  const [ocorrencias, setOcorrencias] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [ocs, nots] = await Promise.all([
          api.minhasOcorrencias(),
          api.getNotificacoes(),
        ]);
        setOcorrencias(ocs);
        setNotificacoes(nots);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const marcarLida = async (id) => {
    await api.marcarLida(id);
    setNotificacoes(n => n.map(x => x.id === id ? { ...x, lida: true } : x));
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  if (selected) return <OcorrenciaDetail oc={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="max-w-lg mx-auto">
      {/* Tabs */}
      <div className="sticky top-0 bg-surface pt-2 pb-3 px-4 z-10">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setTab('historico')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'historico' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Histórico
          </button>
          <button
            onClick={() => setTab('notificacoes')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all relative ${
              tab === 'notificacoes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Notificações
            {naoLidas > 0 && (
              <span className="absolute top-1 right-4 w-4 h-4 bg-eco-600 text-white text-xs rounded-full flex items-center justify-center">
                {naoLidas}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-24">
        {loading ? (
          <div className="flex justify-center pt-8"><Spinner /></div>
        ) : tab === 'historico' ? (
          ocorrencias.length === 0 ? (
            <EmptyState icon="📋" title="Sem ocorrências ainda." subtitle="Registre o primeiro problema da sua cidade!" />
          ) : (
            <div className="space-y-3">
              {ocorrencias.map(oc => (
                <OcorrenciaItem key={oc.id} oc={oc} onClick={setSelected} />
              ))}
            </div>
          )
        ) : (
          notificacoes.length === 0 ? (
            <EmptyState icon="🔔" title="Sem notificações" subtitle="Você será notificado sobre suas ocorrências aqui." />
          ) : (
            <div className="space-y-3">
              {naoLidas > 0 && (
                <button onClick={async () => {
                  await api.marcarTodasLidas();
                  setNotificacoes(n => n.map(x => ({ ...x, lida: true })));
                }} className="text-sm text-eco-600 font-medium">
                  Marcar todas como lidas
                </button>
              )}
              {notificacoes.map(n => (
                <NotificacaoItem key={n.id} n={n} onLida={marcarLida} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
