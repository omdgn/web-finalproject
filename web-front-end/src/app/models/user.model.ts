export interface User {
  id: string | number;
  email: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  city: string;
  country: string;
  photoUrl?: string;
  photo_url?: string;
  registrationDate?: string;
  isActive?: boolean;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  city: string;
  country: string;
  photoUrl?: string;
  photo_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
