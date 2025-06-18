import Cookies from 'js-cookie';

// Fungsi untuk menyimpan token
export const setToken = (token: string): void => {
  Cookies.set('accessToken', token);
};

// Fungsi untuk mendapatkan token
export const getToken = (): string | undefined => {
  return Cookies.get('accessToken') || undefined;
};

// Fungsi untuk menghapus token
export const removeToken = (): void => {
  Cookies.remove('accessToken');
};

// Cek apakah sudah login
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  // Periksa token di cookies (prioritas utama)
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return true;
  
  // Fallback: periksa token di localStorage (untuk backward compatibility)
  return !!localStorage.getItem("accessToken");
}

export function getAdminData(): { id: string; username: string; nama: string } | null {
  if (typeof window === "undefined") return null;
  
  const adminDataStr = Cookies.get("adminData");
  if (!adminDataStr) return null;
  
  try {
    return JSON.parse(adminDataStr);
  } catch {
    return null;
  }
} 