import { http, HttpResponse } from 'msw';
import { resetDb } from '../db/reset';
import { storeSession } from '@/lib/session/storage';

export const handlers = [
  http.get('*/api/_health', () => HttpResponse.json({ ok: true })),
  http.post('*/api/_mock/reset', () => {
    resetDb();
    storeSession(null);
    return HttpResponse.json({ ok: true });
  }),
];
