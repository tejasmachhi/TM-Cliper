const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && path.includes('trycloudflare.com')) {
      return path.replace('http://', 'https://');
    }
    return path;
  }
  const rootUrl = BASE_URL.replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${rootUrl}${cleanPath}`;
}

export async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('clipgenius_token');
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  getMediaUrl,
  // System & Health
  getSystemStatus: () => fetchApi('/system/status'),
  getSettings: () => fetchApi('/settings'),
  updateSettings: (data) => fetchApi('/settings', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  login: (data) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => fetchApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchApi('/auth/me'),

  // YouTube Preview & Integration
  previewYoutube: (url) => fetchApi('/youtube/preview', { method: 'POST', body: JSON.stringify({ url }) }),
  getYouTubeStatus: () => fetchApi('/youtube/status'),
  getYouTubeConnect: () => fetchApi('/youtube/connect'),
  getYouTubeChannel: () => fetchApi('/youtube/channel'),
  disconnectYouTubeAccount: () => fetchApi('/youtube/disconnect', { method: 'DELETE' }),
  updateYouTubePreferences: (data) => fetchApi('/youtube/preferences', { method: 'POST', body: JSON.stringify(data) }),
  uploadClipToYouTube: (data) => fetchApi('/youtube/upload', { method: 'POST', body: JSON.stringify(data) }),

  // Legacy aliases
  getYouTubeIntegration: () => fetchApi('/youtube/status'),
  connectYouTube: () => fetchApi('/youtube/connect'),
  disconnectYouTube: () => fetchApi('/youtube/disconnect', { method: 'DELETE' }),
  publishToYouTube: (data) => fetchApi('/youtube/upload', { method: 'POST', body: JSON.stringify(data) }),

  // Projects
  getProjects: () => fetchApi('/projects'),
  getProject: (projectId) => fetchApi(`/projects/${projectId}`),
  createProject: (data) => fetchApi('/projects/create', { method: 'POST', body: JSON.stringify(data) }),
  renameProject: (projectId, project_name) => fetchApi(`/projects/${projectId}`, { method: 'PATCH', body: JSON.stringify({ project_name }) }),
  deleteProject: (projectId) => fetchApi(`/projects/${projectId}`, { method: 'DELETE' }),
  uploadProject: (formData) => {
    let token = null;
    if (typeof window !== 'undefined') token = localStorage.getItem('clipgenius_token');
    return fetch(`${BASE_URL}/projects/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(res => res.json());
  },
  getProjectZipUrl: (projectId) => `${BASE_URL}/projects/${projectId}/zip`,

  // Clips
  getClips: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchApi(`/clips${q ? `?${q}` : ''}`);
  },
  getClip: (clipId) => fetchApi(`/clips/${clipId}`),
  deleteClip: (clipId) => fetchApi(`/clips/${clipId}`, { method: 'DELETE' }),
  batchDeleteClips: (clipIds) => fetchApi('/clips/batch-delete', { method: 'POST', body: JSON.stringify({ clip_ids: clipIds }) }),
  cleanupOldClips: (days = 3) => fetchApi(`/clips/cleanup-old?days=${days}`, { method: 'POST' }),
  updateClip: (clipId, data) => fetchApi(`/clips/${clipId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getClipStreamUrl: (clipId) => `${BASE_URL}/clips/${clipId}/stream`,
  getClipThumbnailUrl: (clipId) => `${BASE_URL}/clips/${clipId}/thumbnail`,

  // Billing & SaaS
  getPlans: () => fetchApi('/billing/plans'),
  getInvoices: () => fetchApi('/billing/invoices'),

  // Admin Dashboard
  getAdminStats: () => fetchApi('/admin/stats'),
  getAdminUsers: () => fetchApi('/admin/users'),
};
