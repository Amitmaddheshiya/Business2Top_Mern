export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
}

export function getUserEmail() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
}
