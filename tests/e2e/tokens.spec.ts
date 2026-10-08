import { test, expect } from '@playwright/test';

test('typography classes can be copied with accessible feedback', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => localStorage.setItem('gm_scenario', 'padrao'));
  await page.goto('/tokens');
  await expect(
    page.getByRole('heading', { name: 'Design Tokens Showcase' })
  ).toBeVisible();
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/reset');
  });
  await expect(
    page.getByRole('button', { name: /^Copiar classe / })
  ).toHaveCount(17);
  await page
    .getByRole('button', { name: 'Copiar classe text-body-bold', exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('text-body-bold');
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Classe text-body-bold copiada.' })
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => Promise.reject(new Error('Clipboard unavailable')),
    });
  });
  await page
    .getByRole('button', { name: 'Copiar classe text-title', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Não foi possível copiar.' })
  ).toBeVisible();
});
