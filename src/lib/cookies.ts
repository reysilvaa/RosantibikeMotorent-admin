import Cookies from 'js-cookie';

interface AdminData {
  id: string;
  username: string;
  nama: string;
}

export const setAdminData = (adminData: AdminData): void => {
  if (typeof window === 'undefined') return;
  
  try {   
    Cookies.set('adminData', JSON.stringify(adminData), {
      expires: 7,
      path: '/',
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    });
  } catch (error) {
    console.error('Error menyimpan data admin:', error);
  }
};

export const getAdminData = (): AdminData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const adminDataStr = Cookies.get('adminData');
    if (adminDataStr) {
      return JSON.parse(adminDataStr);
    }
    return null;
  } catch (error) {
    console.error('Error mengambil data admin:', error);
    return null;
  }
};

export const removeAdminData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    Cookies.remove('adminData', { path: '/' });
  } catch (error) {
    console.error('Error menghapus data admin:', error);
  }
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return getAdminData() !== null;
}
