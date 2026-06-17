import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';
import MapaPage from './MapaPage.jsx';
import FeedPage from './FeedPage.jsx';
import MinhasPage from './MinhasPage.jsx';
import PerfilPage from './PerfilPage.jsx';
import NovaOcorrenciaPage from './NovaOcorrenciaPage.jsx';
import { Logo } from '../components/ui.jsx';
import { useToast, Toast } from '../components/ui.jsx';

export default function CidadaoApp() {
  const { user } = useAuth();
  const [tab, setTab] = useState('mapa');
  const [showNova, setShowNova] = useState(false);
  const { toasts, addToast } = useToast();

  const PAGE_TITLES = {
    mapa: 'Mapa da cidade',
    feed: 'Feed da vizinhança',
    minhas: 'Minhas ocorrências',
    perfil: 'Meu perfil',
  };

  if (showNova) {
    return (
      <NovaOcorrenciaPage
        onClose={() => setShowNova(false)}
        onSuccess={() => {
          setShowNova(false);
          addToast('Ocorrência registrada com sucesso! +10 XP 🌱');
          setTab('minhas');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Top header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <div>
            <p className="text-xs text-eco-600 font-medium leading-none uppercase tracking-wide">Ecomap</p>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{PAGE_TITLES[tab]}</p>
          </div>
        </div>
        <button
          onClick={() => setTab('minhas')}
          className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-hidden relative">
        <div className={`absolute inset-0 overflow-auto ${tab === 'mapa' ? 'block' : 'hidden'}`}>
          <MapaPage />
        </div>
        <div className={`absolute inset-0 overflow-auto ${tab === 'feed' ? 'block' : 'hidden'}`}>
          <FeedPage />
        </div>
        <div className={`absolute inset-0 overflow-auto pb-20 ${tab === 'minhas' ? 'block' : 'hidden'}`}>
          <MinhasPage />
        </div>
        <div className={`absolute inset-0 overflow-auto pb-20 ${tab === 'perfil' ? 'block' : 'hidden'}`}>
          <PerfilPage />
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav tab={tab} setTab={setTab} onNova={() => setShowNova(true)} />

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}
