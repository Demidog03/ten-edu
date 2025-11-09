export type Role = 'site_admin' | 'center_admin' | 'user';

export interface Profile {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: Role;
  is_active: boolean;
  image?: { id: number; file_name: string; file_url: string } | null;
  image_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface JwtTokens {
  access: string;
  refresh?: string;
}

export interface RegisterPayload {
  email: string;                 // [1..254]
  password: string;              // non-empty
  password_confirm: string;      // non-empty
  full_name: string;             // [1..255]
  phone: string | null;          // string <= 32 или null
  role: Role | null;             // строковый enum или null
  image_id: number | null;       // integer или null
}

export type RegisterResponse = {
  tokens: {
    access: string;
    refresh: string;
  }
};

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse = JwtTokens
