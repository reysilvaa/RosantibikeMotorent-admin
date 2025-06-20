export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  admin: {
    id: string;
    username: string;
    nama: string;
  };
}

export interface Admin {
  id: string;
  username: string;
  nama: string;
  createdAt: string;
  updatedAt: string;
}
