export interface AuthError {
  message: string;
  errorCode?: string;
}

export interface AuthState {
  loading: boolean;
  error: AuthError | null;
  machineId?: string;
}
