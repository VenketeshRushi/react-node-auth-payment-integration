export type UserRole = 'user' | 'admin' | 'superadmin';

export interface PublicUserData {
  name: string;
  email: string;
  mobile_no: string;
  role?: UserRole;
  is_active?: boolean;
  is_banned?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  mobile_no: string;
  password: string;
}

export interface UserConflictCheck {
  email: string;
  mobile_no: string;
}

export interface CreatedUser {
  id: string;
  name: string;
  email: string;
  mobile_no: string;
  role: string;
  created_at: Date;
}

export interface ExistingUser {
  id: string;
  email: string;
  mobile_no: string;
}
