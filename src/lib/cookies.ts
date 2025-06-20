import Cookies from 'js-cookie';

export const setAdminData = (adminData: {
  id: string;
  username: string;
  nama: string;
}): void => {
  Cookies.set('adminData', JSON.stringify(adminData), {
    expires: 7,
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  });
};

export const getAdminData = (): {
  id: string;
  username: string;
  nama: string;
} | null => {
  if (typeof window === 'undefined') return null;

  const adminDataStr = Cookies.get('adminData');
  if (!adminDataStr) return null;

  try {
    return JSON.parse(adminDataStr);
  } catch {
    return null;
  }
};

export const removeAdminData = (): void => {
  Cookies.remove('adminData', { path: '/' });
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  return getAdminData() !== null;
}
