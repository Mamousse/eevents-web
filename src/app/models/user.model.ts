export interface User {
  id?: string;
  prenom: string;
  nom: string;
  telephone: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
