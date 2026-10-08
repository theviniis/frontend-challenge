import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import { resetDb } from './db/reset';
import { storeSession } from '@/lib/session/storage';
export const worker = setupWorker(
  http.post('/api/_mock/reset', () => {
    resetDb();
    storeSession(null);
    return HttpResponse.json({ ok: true });
  })
);
