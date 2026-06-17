import { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CATEGORIAS, STATUS, formatDate, formatDateFull } from '../utils/helpers.js';
import { StatusBadge, CategoriaBadge, Spinner, EmptyState, Logo } from '../components/ui.jsx';

// Stats card
const StatCard = ({ label, value, color, icon }) => (
  <div className="card p-4">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-xl mb-3`}>{icon}</div>
    <p className="text-2xl font-display font-bold text-gray-900">{value ?? '—'}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

// Occurrence row
const OcorrenciaRow = ({ oc, onClick }) => {
  const cat = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;
  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onClick(oc)}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.emoji}</span>
          <span className="text-sm font-medium text-gray-700">{cat.label}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
        <span className="line-clamp-1">{oc.descricao || <span className="text-gray-400 italic">Sem descrição</span>}</span>
      </td>
      <td className="px-4 py-3"><StatusBadge status={oc.status} /></td>
      <td className="px-4 py-3 text-sm text-gray-500">{oc.cidadao_nome}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{formatDate(oc.data_abertura)}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {oc.total_apoios}
        </span>
      </td>
    </tr>
  );
};

// Occurrence detail modal for gestor
const OcorrenciaDetailGestor = ({ oc, onClose, onStatusUpdate }) => {
  const [novoStatus, setNovoStatus] = useState(oc.status);
  const [fotoResolucao, setFotoResolucao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cat = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;
  const statusOptions = ['ABERTA', 'EM_ANALISE', 'EM_ANDAMENTO', 'RESOLVIDA', 'CANCELADA'];

  const handleSave = async () => {
    if (novoStatus === oc.status) { onClose(); return; }
    if (novoStatus === 'RESOLVIDA' && !fotoResolucao) {
      setError('Para marcar como resolvida, anexe a foto da resolução.');
      return;
    }
    setLoading(true);
    try {
      const updated = await api.atualizarStatus(oc.id, novoStatus, fotoResolucao || undefined);
      onStatusUpdate(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-auto animate-scale-in">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg">Gerenciar Ocorrência</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Info */}
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-2xl ${cat.cor} flex items-center justify-center text-2xl flex-shrink-0`}>{cat.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <CategoriaBadge categoria={oc.categoria} />
                <StatusBadge status={oc.status} />
              </div>
              {oc.descricao && <p className="text-sm text-gray-600">{oc.descricao}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Por {oc.cidadao_nome} · {formatDateFull(oc.data_abertura)}
              </p>
              <p className="text-xs text-gray-400">GPS: {oc.latitude?.toFixed(5)}, {oc.longitude?.toFixed(5)}</p>
            </div>
          </div>

          {/* Photo */}
          {oc.foto_url && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100">
              <img src={oc.foto_url} alt="Ocorrência" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Status update */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Atualizar status</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setNovoStatus(s)}
                  className={`py-2.5 px-4 rounded-2xl text-sm font-medium border-2 transition-all ${
                    novoStatus === s
                      ? `badge ${STATUS[s].cor} border-current`
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {STATUS[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution photo URL */}
          {novoStatus === 'RESOLVIDA' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                URL da foto de resolução <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://..."
                value={fotoResolucao}
                onChange={e => setFotoResolucao(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Obrigatório ao marcar como Resolvida</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" color="white" />}
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple heatmap visualization
const HeatmapView = ({ ocorrencias }) => {
  const porCategoria = Object.entries(
    ocorrencias.reduce((acc, oc) => {
      acc[oc.categoria] = (acc[oc.categoria] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const max = porCategoria[0]?.[1] || 1;

  return (
    <div className="space-y-3">
      {porCategoria.map(([cat, total]) => {
        const c = CATEGORIAS[cat] || CATEGORIAS.OUTROS;
        const pct = (total / max) * 100;
        return (
          <div key={cat} className="flex items-center gap-3">
            <span className="text-xl w-8 flex-shrink-0">{c.emoji}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{c.label}</span>
                <span className="font-semibold">{total}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, #22c55e, #16a34a)`,
                    opacity: 0.4 + (pct / 100) * 0.6
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function GestorDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('dashboard'); // dashboard | ocorrencias | heatmap
  const [stats, setStats] = useState(null);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const LIMIT = 20;

  const carregarStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {}
  };

  const carregarOcorrencias = async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: LIMIT };
      if (filtroStatus) params.status = filtroStatus;
      if (filtroCategoria) params.categoria = filtroCategoria;
      const data = await api.listarOcorrencias(params);
      setOcorrencias(data.data || []);
      setTotal(data.total || 0);
      setPage(pg);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    carregarStats();
    carregarOcorrencias(1);
  }, [filtroStatus, filtroCategoria]);

  const handleStatusUpdate = (updated) => {
    setOcorrencias(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o));
    carregarStats();
  };

  const ocsFiltradas = ocorrencias.filter(oc => {
    if (!search) return true;
    const s = search.toLowerCase();
    return oc.descricao?.toLowerCase().includes(s) ||
           oc.cidadao_nome?.toLowerCase().includes(s) ||
           oc.categoria?.toLowerCase().includes(s);
  });

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div>
              <p className="text-xs text-eco-600 font-medium uppercase tracking-wide">Ecomap</p>
              <p className="font-semibold text-sm text-gray-900">Painel Gestor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'ocorrencias', label: 'Ocorrências', icon: '📋' },
            { key: 'heatmap', label: 'Mapa de Calor', icon: '🔥' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                view === item.key
                  ? 'bg-eco-50 text-eco-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 text-xs text-gray-500 mb-2">
            <p className="font-medium text-gray-700">{user?.nome}</p>
            <p>{user?.departamento}</p>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-6">
        {/* Dashboard view */}
        {view === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm">Visão geral das ocorrências da cidade</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Abertas" value={stats?.totais?.abertas} color="bg-red-100" icon="🔴" />
              <StatCard label="Em análise" value={stats?.totais?.em_analise} color="bg-yellow-100" icon="🟡" />
              <StatCard label="Em andamento" value={stats?.totais?.em_andamento} color="bg-blue-100" icon="🔵" />
              <StatCard label="Resolvidas" value={stats?.totais?.resolvidas} color="bg-eco-100" icon="🟢" />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* By category */}
              <div className="card p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Por categoria</h2>
                {stats?.porCategoria?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.porCategoria.map(item => {
                      const c = CATEGORIAS[item.categoria] || CATEGORIAS.OUTROS;
                      const pct = stats.totais?.total > 0 ? (item.total / stats.totais.total) * 100 : 0;
                      return (
                        <div key={item.categoria}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <span>{c.emoji}</span>
                              <span className="text-gray-700">{c.label}</span>
                            </span>
                            <span className="font-medium text-gray-600">{item.total}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-eco-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="text-center text-gray-400 text-sm py-8">Nenhum dado ainda</div>}
              </div>

              {/* Recent */}
              <div className="card p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Recentes</h2>
                <div className="space-y-3">
                  {stats?.recentes?.map(oc => {
                    const c = CATEGORIAS[oc.categoria] || CATEGORIAS.OUTROS;
                    return (
                      <div key={oc.id} className="flex items-center gap-3">
                        <span className="text-lg">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{c.label}</p>
                          <p className="text-xs text-gray-400">{oc.cidadao_nome} · {formatDate(oc.data_abertura)}</p>
                        </div>
                        <StatusBadge status={oc.status} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Occurrences management view */}
        {view === 'ocorrencias' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-gray-900">Gerenciar Ocorrências</h1>
                <p className="text-gray-500 text-sm">{total} ocorrências no total</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="input-field max-w-xs"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="input-field max-w-xs"
                value={filtroStatus}
                onChange={e => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <select
                className="input-field max-w-xs"
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {Object.entries(CATEGORIAS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Categoria', 'Descrição', 'Status', 'Cidadão', 'Data', 'Apoios'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan={6} className="py-12 text-center"><Spinner /></td></tr>
                    ) : ocsFiltradas.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Nenhuma ocorrência encontrada</td></tr>
                    ) : (
                      ocsFiltradas.map(oc => (
                        <OcorrenciaRow key={oc.id} oc={oc} onClick={setSelected} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > LIMIT && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => carregarOcorrencias(page - 1)}
                      className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                    >← Anterior</button>
                    <button
                      disabled={page * LIMIT >= total}
                      onClick={() => carregarOcorrencias(page + 1)}
                      className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                    >Próxima →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Heatmap view */}
        {view === 'heatmap' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-gray-900">Mapa de Calor</h1>
              <p className="text-gray-500 text-sm">Distribuição de ocorrências por categoria</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="card p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Intensidade por categoria</h2>
                {loading ? <Spinner /> : <HeatmapView ocorrencias={ocorrencias} />}
              </div>

              <div className="card p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Resumo por status</h2>
                <div className="space-y-3">
                  {stats && Object.entries({
                    ABERTA: stats.totais?.abertas,
                    EM_ANALISE: stats.totais?.em_analise,
                    EM_ANDAMENTO: stats.totais?.em_andamento,
                    RESOLVIDA: stats.totais?.resolvidas,
                  }).map(([key, val]) => {
                    const total2 = stats.totais?.total || 1;
                    const pct = ((val || 0) / total2) * 100;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <StatusBadge status={key} />
                          <span className="font-medium text-gray-600">{val || 0} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: STATUS[key]?.dot || '#ccc' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-eco-600">{stats?.totais?.resolvidas || 0}</span> ocorrências resolvidas de <span className="font-semibold">{stats?.totais?.total || 0}</span> registradas.
                    {stats?.totais?.total > 0 && (
                      <span className="text-gray-400 ml-1">
                        ({((stats.totais.resolvidas / stats.totais.total) * 100).toFixed(0)}% de resolução)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Occurrence detail modal */}
      {selected && (
        <OcorrenciaDetailGestor
          oc={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
