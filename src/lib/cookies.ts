import Cookies from 'js-cookie';

// menyimpan data admin
export const setAdminData = (adminData: { id: string; username: string; nama: string }): void => {
  Cookies.set('adminData', JSON.stringify(adminData), { 
    expires: 7,
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:'
  });
};

// mendapatkan data admin
export const getAdminData = (): { id: string; username: string; nama: string } | null => {
  if (typeof window === "undefined") return null;
  
  const adminDataStr = Cookies.get("adminData");
  if (!adminDataStr) return null;
  
  try {
    return JSON.parse(adminDataStr);
  } catch {
    return null;
  }
};

// menghapus data admin
export const removeAdminData = (): void => {
  Cookies.remove('adminData', { path: '/' });
};

// Cek apakah sudah login
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  // Periksa apakah ada data admin
  return getAdminData() !== null;
} 