import { test, expect } from '@playwright/test';
const routes = [
  ['/', 'Início'],
  ['/nfts/sample', 'Detalhes do NFT'],
  ['/cart', 'Carrinho'],
  ['/login', 'Login'],
  ['/signup', 'Cadastro'],
  ['/not-found', '404'],
  ['/unknown', '404'],
];
const privateRoutes = [
  ['/checkout', 'Pagamento'],
  ['/orders/sample', 'Confirmação'],
  ['/profile', 'Perfil'],
  ['/wallets', 'Carteiras'],
];
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gm_scenario', 'padrao'));
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Início', exact: true })
  ).toBeVisible();
  // MSW runs in the browser, so reset uses a browser request rather than APIRequestContext.
  const status = await page.evaluate(
    async () => (await fetch('/api/_mock/reset', { method: 'POST' })).status
  );
  expect(status).toBe(200);
});
for (const [path, title] of routes)
  test(`direct URL and refresh ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
  });
for (const [path, title] of privateRoutes)
  test(`guard and return ${path}`, async ({ page }) => {
    const target = path + '?draft=abc#review';
    await page.goto(target);
    await expect(
      page.getByRole('heading', { name: 'Login', exact: true })
    ).toBeVisible();
    expect(new URL(page.url()).searchParams.get('redirect')).toBe(target);
    await page
      .getByRole('button', { name: 'Simular login e continuar' })
      .click();
    await expect(page).toHaveURL(
      new RegExp(path.replaceAll('/', '\\/') + '\\?draft=abc#review$')
    );
    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Simular Logout', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Login', exact: true })
    ).toBeVisible();
  });
test('catalog URL survives refresh and back/forward; filters reset page', async ({
  page,
}) => {
  await page.goto('/?q=abc&page=2');
  const state = page.getByLabel('Filtros atuais');
  await expect(state).toContainText('"q": "abc"');
  await expect(state).toContainText('"page": 2');
  await page.reload();
  await expect(state).toContainText('"page": 2');
  await page.getByRole('button', { name: 'Buscar cyberpunk' }).click();
  await expect(state).toContainText('"page": 1');
  await page.goBack();
  await expect(state).toContainText('"q": "abc"');
  await expect(state).toContainText('"page": 2');
  await page.goForward();
  await expect(state).toContainText('cyberpunk');
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(state).toContainText('Arte digital');
  await expect(state).toContainText('"page": 1');
  await page.reload();
  await expect(state).toContainText('Colecionáveis');
});
test('quantity survives refresh and history', async ({ page }) => {
  await page.goto('/nfts/sample?qty=5');
  const qty = page.getByLabel('Quantidade', { exact: true });
  await expect(qty).toHaveText('5');
  await page.getByRole('button', { name: 'Aumentar quantidade' }).click();
  await expect(qty).toHaveText('6');
  await page.reload();
  await expect(qty).toHaveText('6');
  await page.goBack();
  await expect(qty).toHaveText('5');
});
test('external redirect is rejected', async ({ page }) => {
  await page.goto('/login?redirect=' + encodeURIComponent('//evil.com'));
  await page.getByRole('button', { name: 'Simular login e continuar' }).click();
  await expect(
    page.getByRole('heading', { name: 'Início', exact: true })
  ).toBeVisible();
});
test('expired and malformed sessions cannot access private routes', async ({
  page,
}) => {
  await page
    .getByRole('button', { name: 'Simular Login Rápido (Ana)', exact: true })
    .click();
  await page.evaluate(() => {
    const session = JSON.parse(localStorage.getItem('gm_session')!);
    session.expiresAt = '2000-01-01T00:00:00.000Z';
    localStorage.setItem('gm_session', JSON.stringify(session));
  });
  await page.goto('/checkout');
  await expect(
    page.getByRole('heading', { name: 'Login', exact: true })
  ).toBeVisible();
  await page.evaluate(() => localStorage.setItem('gm_session', '{invalid'));
  await page.goto('/profile');
  await expect(
    page.getByRole('heading', { name: 'Login', exact: true })
  ).toBeVisible();
});
test('all marketplace screens reachable by click', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Simular Login Rápido (Ana)', exact: true })
    .click();
  for (const name of [
    'Detalhes NFT (#1)',
    'Carrinho',
    'Pagamento (Privada)',
    'Confirmação (Privada)',
    'Login',
    'Cadastro',
    'Perfil (Privada)',
    'Carteiras (Privada)',
    '404 (Rota Inexistente)',
  ]) {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page.locator('h1')).toBeVisible();
    if (name === '404 (Rota Inexistente)')
      await page
        .getByRole('link', { name: 'Voltar para a página inicial' })
        .click();
  }
});
