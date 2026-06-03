const API_BASE_URL = "http://localhost:8080"; // Or env var

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function fetchAdminFeed() {
  const res = await fetch(`${API_BASE_URL}/admin/feed`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin feed");
  return res.json();
}

export async function fetchAdminSettings() {
  const res = await fetch(`${API_BASE_URL}/admin/settings`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin settings");
  return res.json();
}

export async function updateAdminSettings(settings: Record<string, any>) {
  const res = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}
