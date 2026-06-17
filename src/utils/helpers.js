export const CATEGORIAS = {
  LIXO_ENTULHO:      { label: 'Lixo / Entulho',      emoji: '🗑️', cor: 'bg-orange-100 text-orange-700' },
  BURACO_VIA:        { label: 'Buraco na via',         emoji: '⚫', cor: 'bg-slate-100 text-slate-700' },
  ARVORE_RISCO:      { label: 'Árvore em risco',       emoji: '🌳', cor: 'bg-green-100 text-green-700' },
  VAZAMENTO_AGUA:    { label: 'Vazamento de água',     emoji: '💧', cor: 'bg-blue-100 text-blue-700' },
  ILUMINACAO_PUBLICA:{ label: 'Iluminação pública',    emoji: '💡', cor: 'bg-yellow-100 text-yellow-700' },
  OUTROS:            { label: 'Outros',                emoji: '📌', cor: 'bg-pink-100 text-pink-700' },
};

export const STATUS = {
  ABERTA:       { label: 'Aberta',       cor: 'badge-aberta',       dot: '#ef4444' },
  EM_ANALISE:   { label: 'Em análise',   cor: 'badge-em_analise',   dot: '#eab308' },
  EM_ANDAMENTO: { label: 'Em andamento', cor: 'badge-em_andamento', dot: '#3b82f6' },
  RESOLVIDA:    { label: 'Resolvida',    cor: 'badge-resolvida',    dot: '#22c55e' },
  CANCELADA:    { label: 'Cancelada',    cor: 'badge-cancelada',    dot: '#9ca3af' },
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'agora mesmo';
  if (mins < 60) return `há ${mins} minuto${mins > 1 ? 's' : ''}`;
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
  return date.toLocaleDateString('pt-BR');
};

export const formatDateFull = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const distancia = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const getUserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error('Geolocalização não suportada'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { timeout: 10000 }
    );
  });

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
