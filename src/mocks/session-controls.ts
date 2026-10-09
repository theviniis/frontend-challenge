import { sessionService } from '@/lib/session/service';
import type { DemoSessionControls } from '@/lib/session/demo';
export const demoSession: DemoSessionControls = {
  async login() {
    await sessionService.login({
      email: 'ana@greenmint.test',
      password: 'Ana12345',
    });
  },
  logout() {
    void sessionService.logout().catch(() => undefined);
  },
};
