import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { queryClient } from './lib/query/client';
import './styles/globals.css';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';

async function bootstrap() {
  if (
    import.meta.env.VITE_MOCKS === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_MOCKS !== 'false')
  ) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    const { demoSession } = await import('./mocks/session-controls');
    router.update({ context: { demoSession } });
  }

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
