const BASE_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("ecomap_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
};

const api = {
  // Auth
  login: (email, senha) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    }).then(handleResponse),

  register: (nome, email, senha) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    }).then(handleResponse),

  me: () =>
    fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  // Ocorrências
  listarOcorrencias: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/ocorrencias?${qs}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  feedVizinhanca: (lat, lng) => {
    const qs = lat && lng ? `?lat=${lat}&lng=${lng}&raio=5` : "";
    return fetch(`${BASE_URL}/ocorrencias/feed${qs}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  minhasOcorrencias: () =>
    fetch(`${BASE_URL}/ocorrencias/minhas`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  getOcorrencia: (id) =>
    fetch(`${BASE_URL}/ocorrencias/${id}`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  criarOcorrencia: (dados) =>
    fetch(`${BASE_URL}/ocorrencias`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dados),
    }).then(handleResponse),

  atualizarStatus: (id, status, foto_resolucao_url) =>
    fetch(`${BASE_URL}/ocorrencias/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, foto_resolucao_url }),
    }).then(handleResponse),

  apoiar: (id) =>
    fetch(`${BASE_URL}/ocorrencias/${id}/apoiar`, {
      method: "POST",
      headers: getHeaders(),
    }).then(handleResponse),

  removerApoio: (id) =>
    fetch(`${BASE_URL}/ocorrencias/${id}/apoiar`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  getStats: () =>
    fetch(`${BASE_URL}/ocorrencias/stats`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  // Notificações
  getNotificacoes: () =>
    fetch(`${BASE_URL}/notificacoes`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  marcarLida: (id) =>
    fetch(`${BASE_URL}/notificacoes/${id}/lida`, {
      method: "PATCH",
      headers: getHeaders(),
    }).then(handleResponse),

  marcarTodasLidas: () =>
    fetch(`${BASE_URL}/notificacoes/todas/lida`, {
      method: "PATCH",
      headers: getHeaders(),
    }).then(handleResponse),

  // Perfil / Gamificação
  getGamificacao: () =>
    fetch(`${BASE_URL}/perfil/gamificacao`, { headers: getHeaders() }).then(
      handleResponse,
    ),

  getRanking: () =>
    fetch(`${BASE_URL}/perfil/ranking`, { headers: getHeaders() }).then(
      handleResponse,
    ),
};

export default api;
