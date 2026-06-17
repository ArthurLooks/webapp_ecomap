import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Spinner } from '../components/ui.jsx';

const MissaoCard = ({ missao }) => {
  const pct = Math.min((missao.progresso / missao.quantidade_alvo) * 100, 100);
  return (
    <div className={`card p-4 ${missao.concluida ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800">{missao.titulo}</p>
          <p className="text-xs text-gray-500 mt-0.5">{missao.descricao}</p>
        </div>
        <span className={`text-sm font-bold ml-3 flex-shrink-0 ${missao.concluida ? 'text-gray-400' : 'text-eco-600'}`}>
          +{missao.recompensa_xp} XP
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {missao.concluida ? '✅ Concluída!' : `${missao.progresso}/${missao.quantidade_alvo}`}
          </span>
          <span className="text-xs text-gray-400">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${missao.concluida ? 'bg-gray-400' : 'bg-eco-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const [gami, setGami] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [g, r] = await Promise.all([api.getGamificacao(), api.getRanking()]);
        setGami(g);
        setRanking(r);
      } catch {}
      setLoading(false);
    };
    if (user?.role === 'CIDADAO') load();
    else setLoading(false);
  }, [user]);

  const NIVEL_XP_TOTAL = [50, 200, 500, 1000, 2000];
  const getProxXP = (xp) => {
    for (const n of NIVEL_XP_TOTAL) if (xp < n) return n;
    return null;
  };

  const xp = gami?.xpAtual || 0;
  const proxXP = getProxXP(xp);
  const pctXP = proxXP ? Math.min((xp / proxXP) * 100, 100) : 100;

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* XP Hero Card */}
      {user?.role === 'CIDADAO' && (
        <div className="bg-gradient-to-br from-eco-600 to-eco-700 rounded-3xl p-5 mb-4 mt-4 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <p className="text-white/70 text-sm">{user.nome}</p>
              <p className="font-display font-bold text-xl">{gami?.tituloNivel || 'Novato Cívico'}</p>
              <p className="text-white/70 text-sm">{xp} XP</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Progresso</span>
              {proxXP && <span className="text-white/70">{proxXP - xp} XP para {gami?.proximoNivel}</span>}
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pctXP}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Gestor Card */}
      {user?.role === 'GESTOR' && (
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-5 mb-4 mt-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🏛️</div>
            <div>
              <p className="text-white/70 text-sm">Agente Solucionador</p>
              <p className="font-display font-bold text-xl">{user.nome}</p>
              <p className="text-white/60 text-sm">{user.departamento}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center pt-8"><Spinner /></div>
      ) : (
        <>
          {/* Missions */}
          {user?.role === 'CIDADAO' && gami?.missoes?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h2 className="font-semibold text-gray-800">Missões ativas</h2>
              </div>
              <div className="space-y-3">
                {gami.missoes.filter(m => !m.concluida).map(m => <MissaoCard key={m.id} missao={m} />)}
                {gami.missoes.filter(m => m.concluida).length > 0 && (
                  <>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-2">Concluídas</p>
                    {gami.missoes.filter(m => m.concluida).map(m => <MissaoCard key={m.id} missao={m} />)}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Ranking */}
          {user?.role === 'CIDADAO' && ranking.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🥇</span>
                <h2 className="font-semibold text-gray-800">Ranking da cidade</h2>
              </div>
              <div className="card overflow-hidden">
                {ranking.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < ranking.length - 1 ? 'border-b border-gray-50' : ''} ${r.nome === user.nome ? 'bg-eco-50' : ''}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${r.nome === user.nome ? 'text-eco-700' : 'text-gray-800'}`}>{r.nome}</p>
                      <p className="text-xs text-gray-500">{r.titulo_nivel}</p>
                    </div>
                    <span className="text-sm font-bold text-eco-600">{r.xp_atual} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={logout}
            className="w-full py-3 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 font-medium text-sm transition-colors">
            Sair da conta
          </button>
        </>
      )}
    </div>
  );
}
