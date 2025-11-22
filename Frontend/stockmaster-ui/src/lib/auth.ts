export function getStoredUser() {
  const u = localStorage.getItem('user');
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch (e) {
    console.error('Failed to parse stored user', e);
    return null;
  }
}

export function getUserRole(): string | null {
  const user = getStoredUser();
  if (!user || !user.role) return null;
  return String(user.role).toLowerCase();
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function hasRole(allowed: string[] | string) {
  const role = getUserRole();
  if (!role) return false;
  if (typeof allowed === 'string') return role === allowed.toLowerCase();
  return allowed.map(a => a.toLowerCase()).includes(role);
}

export default { getStoredUser, getUserRole, isAuthenticated, hasRole };
