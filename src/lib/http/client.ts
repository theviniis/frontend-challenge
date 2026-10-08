import axios from 'axios';
import {
  getAnonymousId,
  getStoredSession,
  storeSession,
} from '../session/storage';
import { queryClient } from '../query/client';
import { disconnectSocket } from '../socket/client';
import { toAppError } from './errors';

export const HTTP_TIMEOUT_MS = 10_000;

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: HTTP_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  paramsSerializer: {
    serialize: (params: Record<string, unknown>) => {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (Array.isArray(v)) v.forEach((x) => sp.append(k, String(x)));
        else if (v !== undefined && v !== null) sp.append(k, String(v));
      }
      return sp.toString();
    },
  },
});

http.interceptors.request.use((config) => {
  const session = getStoredSession();
  if (session) config.headers.set('Authorization', `Bearer ${session.token}`);
  else if (typeof window !== 'undefined')
    config.headers.set('X-Anonymous-Id', getAnonymousId());
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const mapped = toAppError(error);
    // An old request must never invalidate a newly authenticated session.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const session = getStoredSession();
      if (
        session &&
        error.config?.headers.get('Authorization') === `Bearer ${session.token}`
      ) {
        storeSession(null);
        queryClient.clear();
        disconnectSocket();
      }
    }
    return Promise.reject(mapped);
  }
);
