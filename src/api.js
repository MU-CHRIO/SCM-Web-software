const BASE = process.env.API_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  // Debug logging for UI issues
  try { console.debug('[apiFetch] ', options.method || 'GET', url, options.body ? JSON.parse(options.body) : null); } catch(e) { console.debug('[apiFetch] ', options.method || 'GET', url); }
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }
    // Log server response for easier debugging
    console.debug('[apiFetch] response', res.status, data);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('[apiFetch] network error', err);
    // network error
    return { ok: false, status: 0, data: { error: 'Network error' } };
  }
}
