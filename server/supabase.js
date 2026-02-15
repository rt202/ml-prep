const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function isSupabaseServiceConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

async function supabaseRequest(path, options = {}) {
  const url = `${SUPABASE_URL}${path}`;
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!response.ok) {
    const message = json?.msg || json?.error_description || json?.error || `Supabase request failed (${response.status})`;
    throw new Error(message);
  }
  return json;
}

export async function getSupabaseUserByAccessToken(accessToken) {
  if (!isSupabaseConfigured() || !accessToken) return null;
  try {
    const userPayload = await supabaseRequest('/auth/v1/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    return userPayload || null;
  } catch {
    return null;
  }
}

export async function getSupabaseProfiles() {
  if (!isSupabaseServiceConfigured()) return [];
  return supabaseRequest('/rest/v1/profiles?select=*', {
    method: 'GET',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
}
