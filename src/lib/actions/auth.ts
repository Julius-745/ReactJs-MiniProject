import { get, post } from "../axios-handler";

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    post<AuthUser>('/auth/login', payload),

  me: () =>
    get<AuthUser>('/auth/me'),

  refresh: (expiresInMins?: string) =>
    post<RefreshResponse>('/auth/refresh', { expiresInMins }),
};