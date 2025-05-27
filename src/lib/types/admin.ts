// Tipe data untuk login
export interface LoginCredentials {
  username: string;
  password: string;
}

// Tipe data untuk respons login
export interface LoginResponse {
  access_token: string;
  admin: {
    id: string;
    username: string;
    nama: string;
  };
}

// Tipe data untuk admin
export interface Admin {
  id: string;
  username: string;
  nama: string;
  createdAt: string;
  updatedAt: string;
} 