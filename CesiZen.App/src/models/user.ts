export interface Role {
  id: number;
  label: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash?: string; // Optional on frontend
  displayName?: string;
  createdAt?: string;
  roleId: number;
  role?: Role;
}

export interface UserLoginRequest {
  email: string;
  passwordHash: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
}
