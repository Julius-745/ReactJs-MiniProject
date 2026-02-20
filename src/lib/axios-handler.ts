import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { HttpStatus } from "./http-status"; 

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TIMEOUT = 10000; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const status = error.response?.status;
    const message: string = error.response?.data?.message || error.message;

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        console.error("[BAD_REQUEST]:", message);
        break;
      case HttpStatus.UNAUTHORIZED:
        console.error("[UNAUTHORIZED] — redirecting to login");
        window.location.href = "/login";
        break;
      case HttpStatus.FORBIDDEN:
        console.error("[FORBIDDEN]:", message);
        break;
      case HttpStatus.NOT_FOUND:
        console.error("[NOT_FOUND]:", message);
        break;
      case HttpStatus.CONFLICT:
        console.error("[CONFLICT]:", message);
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        console.error("[INTERNAL_SERVER_ERROR]:", message);
        break;
      default:
        console.error(`[${status}] Unknown Error:`, message);
    }

    return Promise.reject({
      status,
      message,
      raw: error,
    });
  }
);

export const get = <T = unknown>(
  url: string,
  params: Record<string, unknown> = {},
  config: AxiosRequestConfig = {}
): Promise<T> => api.get(url, { params, ...config });


export const post = <T = unknown>(
  url: string,
  data: unknown = {},
  config: AxiosRequestConfig = {}
): Promise<T> => api.post(url, data, config);


export const put = <T = unknown>(
  url: string,
  data: unknown = {},
  config: AxiosRequestConfig = {}
): Promise<T> => api.put(url, data, config);


export const patch = <T = unknown>(
  url: string,
  data: unknown = {},
  config: AxiosRequestConfig = {}
): Promise<T> => api.patch(url, data, config);


export const del = <T = unknown>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<T> => api.delete(url, config);


export default api;