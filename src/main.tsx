import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { queryClient } from './lib/query/client';
import './styles/global.css';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';

async function bootstrap() {
  if (import.meta.env.VITE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser');
    const { onUnhandledRequest } = await import('./mocks/on-unhandled-request');
    await worker.start({ onUnhandledRequest });
    if (import.meta.env.DEV || import.meta.env.VITE_MOCK_UI === '1') {
      const { mountSwitcher } = await import('./mocks/switcher');
      await mountSwitcher();
    }
    const { http } = await import('./lib/http/client');
    const { healthSchema } = await import('./lib/http/schemas');
    healthSchema.parse((await http.get('/api/_health')).data);
    const { demoSession } = await import('./mocks/session-controls');
    const { router } = await import('./router');
    router.update({ context: { demoSession } });
  }

  const { router } = await import('./router');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
void bootstrap();
