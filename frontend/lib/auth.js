// Authentication utilities
export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}`;
  }
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export async function checkAuth() {
  try {
    const res = await fetch('/api/files', {
      credentials: 'include'
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}
