const API_BASE_URL = "/api-proxy"; // Uses Next.js rewrites in next.config.ts to avoid mixed-content (HTTP) blocked error

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

export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin users");
  return res.json();
}

export async function fetchAdminUserDetail(id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin user detail");
  return res.json();
}

export async function blockAdminUser(userId: number, isBlocked: boolean) {
  const res = await fetch(`${API_BASE_URL}/admin/user/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, is_blocked: isBlocked }),
  });
  if (!res.ok) throw new Error("Failed to update block status");
  return res.json();
}

export async function setAdminUserLimit(userId: number, limit: number) {
  const res = await fetch(`${API_BASE_URL}/admin/user/limit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, limit }),
  });
  if (!res.ok) throw new Error("Failed to set user limit");
  return res.json();
}

export async function addAdminUserBalance(userId: number, amount: number) {
  const res = await fetch(`${API_BASE_URL}/admin/user/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount }),
  });
  if (!res.ok) throw new Error("Failed to add user balance");
  return res.json();
}

export async function fetchAdminTransactions() {
  const res = await fetch(`${API_BASE_URL}/admin/transactions`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin transactions");
  return res.json();
}

export async function updateAdminTransactionStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/admin/transactions/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update transaction status");
  return res.json();
}

export async function fetchGatewayBalance() {
  const res = await fetch(`${API_BASE_URL}/admin/gateway-balance`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch gateway balance");
  return res.json();
}

export async function fetchAdminBets() {
  const res = await fetch(`${API_BASE_URL}/admin/bets`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin bets");
  return res.json();
}

export async function fetchAdminRounds() {
  const res = await fetch(`${API_BASE_URL}/admin/rounds`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch admin rounds");
  return res.json();
}
