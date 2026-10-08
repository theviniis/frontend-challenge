import { storeSession } from '@/lib/session/storage';
import type { DemoSessionControls } from '@/lib/session/demo';
import { SEED_USERS } from './fixtures/users';
import { toUserPublic } from './db/store';
export const demoSession: DemoSessionControls = {
  login() {
    storeSession({
      token: 'mock.routes.ana',
      user: toUserPublic(SEED_USERS[0]),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    });
  },
  logout() {
    storeSession(null);
  },
};
