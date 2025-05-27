import Cookies from 'js-cookie';

// Fungsi untuk mendapatkan token dari cookies atau localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Coba dapatkan dari cookies dulu (prioritas)
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return cookieToken;
  
  // Fallback: coba dari localStorage
  return localStorage.getItem('accessToken');
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

// Mendapatkan data admin dari localStorage
export function getAdminData(): { id: string; username: string; nama: string } | null {
  if (typeof window === "undefined") return null;
  const adminData = localStorage.getItem("adminData");
  return adminData ? JSON.parse(adminData) : null;
} 