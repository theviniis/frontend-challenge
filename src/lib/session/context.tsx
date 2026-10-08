import { useEffect, useState, type ReactNode } from 'react';
import { http } from '../http/client';
import { endpoints } from '../http/endpoints';
import {
  sessionSchema,
  loginRequestSchema,
  signupRequestSchema,
} from '../http/schemas';
import type { AppError } from '../http/errors';
import { queryClient } from '../query/client';
import { disconnectSocket } from '../socket/client';
import {
  getAnonymousId,
  getStoredSession,
  storeSession,
  subscribeSession,
} from './storage';
import { SessionContext } from './state';
import type { LoginRequest, Session, SignupRequest } from '@/types/api';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(getStoredSession);
  const [isHydrating, setHydrating] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(
    () =>
      subscribeSession(() => {
        setSession(getStoredSession());
        queryClient.clear();
        disconnectSocket();
      }),
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const stored = getStoredSession();
    async function hydrate() {
      try {
        if (stored) {
          const response = await http.get<unknown>(endpoints.session, {
            signal: controller.signal,
          });
          const next = sessionSchema.parse(response.data);
          if (
            !controller.signal.aborted &&
            getStoredSession()?.token === stored.token
          ) {
            storeSession(next);
          }
        }
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure as AppError);
      } finally {
        if (!controller.signal.aborted) setHydrating(false);
      }
    }
    void hydrate();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!session) return;
    const timeout = window.setTimeout(
      () => storeSession(null),
      Math.max(0, Date.parse(session.expiresAt) - Date.now())
    );
    return () => window.clearTimeout(timeout);
  }, [session]);

  async function authenticate(
    path: string,
    input: LoginRequest | SignupRequest
  ): Promise<Session> {
    const response = await http.post<unknown>(path, input);
    const next = sessionSchema.parse(response.data);
    localStorage.removeItem('gm_pending_order');
    queryClient.clear();
    disconnectSocket();
    storeSession(next);
    setError(null);
    return next;
  }

  const login = (input: LoginRequest) =>
    authenticate(
      endpoints.login,
      loginRequestSchema.parse({ ...input, anonymousId: getAnonymousId() })
    );
  const signup = (input: SignupRequest) =>
    authenticate(endpoints.signup, signupRequestSchema.parse(input));
  async function logout(): Promise<void> {
    try {
      await http.post(endpoints.logout);
    } finally {
      storeSession(null);
      queryClient.clear();
      disconnectSocket();
      localStorage.removeItem('gm_anon_id');
    }
  }

  return (
    <SessionContext.Provider
      value={{ session, isHydrating, error, login, signup, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}
