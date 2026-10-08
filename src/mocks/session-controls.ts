import { storeSession } from '@/lib/session/storage';
import type { DemoSessionControls } from '@/lib/session/demo';
import { http } from '@/lib/http/client';
import { endpoints } from '@/lib/http/endpoints';
import { sessionSchema } from '@/lib/http/schemas';
export const demoSession: DemoSessionControls = {
  async login() {
    const response = await http.post<unknown>(endpoints.login, {
      email: 'ana@greenmint.test',
      password: 'Ana12345',
    });
    storeSession(sessionSchema.parse(response.data));
  },
  logout() {
    storeSession(null);
  },
};
