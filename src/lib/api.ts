const API_BASE_URL = "/api-proxy"; // Uses Next.js rewrites in next.config.ts to avoid mixed-content (HTTP) blocked error

// Helper to safely parse and throw meaningful API errors for toast notifications
async function handleResponse(res: Response, defaultErrorMsg: string) {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || errorData.message || defaultErrorMsg);
    } catch (e: any) {
      if (e.message && e.message !== 'Unexpected end of JSON input') {
        throw new Error(e.message);
      }
      throw new Error(defaultErrorMsg);
    }
  }
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin stats");
}

export async function fetchAdminFeed() {
  const res = await fetch(`${API_BASE_URL}/admin/feed`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin feed");
}

export async function fetchAdminSettings() {
  const res = await fetch(`${API_BASE_URL}/admin/settings`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin settings");
}

export async function updateAdminSettings(settings: Record<string, any>) {
  const res = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return handleResponse(res, "Failed to update settings");
}

export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin users");
}

export async function fetchAdminUserDetail(id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin user detail");
}

export async function blockAdminUser(userId: number, isBlocked: boolean) {
  const res = await fetch(`${API_BASE_URL}/admin/user/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, is_blocked: isBlocked }),
  });
  return handleResponse(res, "Failed to update block status");
}

export async function setAdminUserLimit(userId: number, limit: number) {
  const res = await fetch(`${API_BASE_URL}/admin/user/limit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, limit }),
  });
  return handleResponse(res, "Failed to set user limit");
}

export async function addAdminUserBalance(userId: number, amount: number) {
  const res = await fetch(`${API_BASE_URL}/admin/user/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount }),
  });
  return handleResponse(res, "Failed to add user balance");
}

export async function fetchAdminTransactions(startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/admin/transactions`;
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin transactions");
}

export async function updateAdminTransactionStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/admin/transactions/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res, "Failed to update transaction status");
}

export async function fetchGatewayBalance() {
  const res = await fetch(`${API_BASE_URL}/admin/gateway-balance`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch gateway balance");
}

export async function fetchAdminBets(startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/admin/bets`;
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin bets");
}

export async function fetchAdminRounds() {
  const res = await fetch(`${API_BASE_URL}/admin/rounds`, { cache: 'no-store' });
  return handleResponse(res, "Failed to fetch admin rounds");
}

export async function fetchAdminRoundDetails(id: number) {
  const res = await fetch(`${API_BASE_URL}/admin/rounds/${id}`, { cache: 'no-store' });
  return handleResponse(res, `Failed to fetch details for round ${id}`);
}
