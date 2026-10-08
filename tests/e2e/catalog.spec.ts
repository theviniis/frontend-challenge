import { test, expect } from '@playwright/test';

test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('gm_scenario', 'padrao');
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent =
        '[aria-label="Controle dos mocks"] { display: none; }';
      document.head.append(style);
    });
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Início', exact: true })
  ).toBeVisible({ timeout: 15_000 });
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/reset');
  });
  await page.reload();
  await expect(page.locator('.nft-card')).toHaveCount(9);
});

test('search, combined filters, sorting, refresh and history preserve URL state', async ({
  page,
}, info) => {
  await page.goto(
    '/?q=Kurio&categories=%5B%22Arte+digital%22%2C%22M%C3%BAsica%22%5D&minPrice=0.02&maxPrice=5&sort=price_asc&page=2'
  );
  await expect(
    page
      .getByRole('searchbox', { name: 'Buscar NFTs' })
      .filter({ visible: true })
  ).toHaveValue('Kurio');
  await expect(page.getByLabel('Ordenar por:')).toHaveValue('price_asc');
  await page.reload();
  await expect(page.getByLabel('Ordenar por:')).toHaveValue('price_asc');
  await page.getByLabel('Ordenar por:').selectOption('recent');
  await expect
    .poll(() => new URL(page.url()).searchParams.has('page'))
    .toBe(false);
  await page.goBack();
  await expect(page.getByLabel('Ordenar por:')).toHaveValue('price_asc');
  expect(new URL(page.url()).searchParams.get('page')).toBe('2');
  await page.goForward();
  await expect(page.getByLabel('Ordenar por:')).toHaveValue('recent');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  await expect(
    page.getByRole('checkbox', { name: 'Arte digital', exact: true })
  ).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'Música', exact: true })
  ).toBeChecked();
  await expect(
    page.getByRole('slider', { name: 'Preço mínimo' }).filter({ visible: true })
  ).toHaveAttribute('aria-valuetext', '0,02 ETH');
  await page
    .getByRole('button', { name: 'Limpar filtros' })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
});

test('pagination restores results and default search leaves a clean URL', async ({
  page,
}) => {
  const first = await page.locator('.nft-card h3').first().innerText();
  await page.getByRole('button', { name: 'Próxima página' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('.nft-card h3').first()).not.toHaveText(first);
  const second = await page.locator('.nft-card h3').first().innerText();
  await page.reload();
  await expect(page.locator('.nft-card h3').first()).toHaveText(second);
  await page.getByRole('button', { name: 'Página anterior' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.nft-card h3').first()).toHaveText(first);
});

test('price slider changes are applied explicitly and can be cleared', async ({
  page,
}, info) => {
  const search = page
    .getByRole('searchbox', { name: 'Buscar NFTs' })
    .filter({ visible: true });
  await search.fill('nenhum-resultado');
  await search.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Nenhum NFT encontrado' })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Limpar busca' })
    .filter({ visible: true })
    .click();
  await expect(page.locator('.nft-card')).toHaveCount(9);
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  const minimum = page
    .getByRole('slider', { name: 'Preço mínimo' })
    .filter({ visible: true });
  const maximum = page
    .getByRole('slider', { name: 'Preço máximo' })
    .filter({ visible: true });
  const priceRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/api/nfts' && url.searchParams.has('minPrice'))
      priceRequests.push(request.url());
  });
  await minimum.focus();
  await minimum.press('ArrowRight');
  await minimum.press('ArrowRight');
  await maximum.focus();
  await maximum.press('ArrowLeft');
  await expect(minimum).toHaveAttribute('aria-valuetext', '0,02 ETH');
  await expect(maximum).toHaveAttribute('aria-valuetext', '19,99 ETH');
  expect(new URL(page.url()).search).toBe('');
  expect(priceRequests).toHaveLength(0);
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect
    .poll(() =>
      new URL(page.url()).searchParams.get('minPrice')?.replace(/^"|"$/g, '')
    )
    .toBe('0.02');
  expect(
    new URL(page.url()).searchParams.get('maxPrice')?.replace(/^"|"$/g, '')
  ).toBe('19.99');
  await page
    .getByRole('button', { name: 'Limpar filtros', exact: true })
    .filter({ visible: true })
    .click();
  await expect.poll(() => new URL(page.url()).search).toBe('');
  await expect(
    page.getByRole('slider', { name: 'Preço mínimo' }).filter({ visible: true })
  ).toHaveAttribute('aria-valuetext', '0,00 ETH');
});

test('range accepts pointer input, equal bounds and expanded URL prices', async ({
  page,
}, info) => {
  await page.goto('/?minPrice=0.02&maxPrice=25.123');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  const minimum = page
    .getByRole('slider', { name: 'Preço mínimo' })
    .filter({ visible: true });
  const maximum = page
    .getByRole('slider', { name: 'Preço máximo' })
    .filter({ visible: true });
  await expect(maximum).toHaveAttribute('aria-valuemax', '2600');
  await expect(maximum).toHaveAttribute('aria-valuetext', '25,123 ETH');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  expect(
    new URL(page.url()).searchParams.get('maxPrice')?.replace(/^"|"$/g, '')
  ).toBe('25.123');
  await minimum.scrollIntoViewIfNeeded();
  const slider = page.locator('[data-slot="slider"]').filter({ visible: true });
  const position = await slider.boundingBox();
  expect(position).not.toBeNull();
  const x = position!.x + position!.width * 0.25;
  const y = position!.y + position!.height / 2;
  if (info.project.name === 'mobile') await page.touchscreen.tap(x, y);
  else {
    const thumb = (await minimum.boundingBox())!;
    await page.mouse.move(
      thumb.x + thumb.width / 2,
      thumb.y + thumb.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(x, y, { steps: 5 });
    await page.mouse.up();
  }
  await expect(minimum).not.toHaveAttribute('aria-valuenow', '2');
  await minimum.press('Home');
  await expect(minimum).toHaveAttribute('aria-valuenow', '0');
  await maximum.press('End');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect.poll(() => new URL(page.url()).search).toBe('');
  await page.goto('/?minPrice=1&maxPrice=1');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  await expect(minimum).toHaveAttribute('aria-valuenow', '100');
  await expect(maximum).toHaveAttribute('aria-valuenow', '100');
  await page.goto('/?minPrice=0.02&maxPrice=12.30');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  const priceGroup = page
    .locator('fieldset')
    .filter({ has: page.locator('[data-slot="slider"]') })
    .filter({ visible: true });
  await expect(priceGroup).toContainText('Preço: 0,02 - 12,30 ETH');
  await priceGroup.screenshot({ path: info.outputPath('price-slider.png') });
});

test('loading, failure and retry use the network and preserve layout', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/scenario', { id: 'lento' });
  });
  const search = page
    .getByRole('searchbox', { name: 'Buscar NFTs' })
    .filter({ visible: true });
  await search.fill('Kurio');
  await search.press('Enter');
  await expect(page.locator('[aria-label="NFTs do catálogo"]')).toHaveAttribute(
    'aria-busy',
    'true'
  );
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(36);
  await expect(page.locator('.nft-card')).toHaveCount(9);
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/scenario', { id: 'erro-5xx' });
  });
  await search.fill('Golden');
  await search.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Erro ao carregar NFTs' })
  ).toBeVisible({ timeout: 15000 });
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/scenario', { id: 'padrao' });
  });
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.nft-card')).toHaveCount(3);
});

test('out of order responses do not replace the current search', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const moduleUrl = '/src/lib/http/client.ts';
    const { http } = await import(moduleUrl);
    await http.post('/api/_mock/scenario', { id: 'latencia-varia' });
  });
  const search = page
    .getByRole('searchbox', { name: 'Buscar NFTs' })
    .filter({ visible: true });
  await search.fill('Golden');
  await search.press('Enter');
  await search.fill('Violet');
  await search.press('Enter');
  await expect(page.locator('.nft-card')).toHaveCount(1);
  await expect(page.locator('.nft-card h3')).toHaveText('Violet Nomad #314');
  await expect(search).toHaveValue('Violet');
});

test('favorites require login, then persist through refresh', async ({
  page,
}) => {
  await page
    .getByRole('button', { name: 'Adicionar Golden Signal #160 aos favoritos' })
    .click();
  await expect(page).toHaveURL(/\/login\?redirect/);
  await page.getByRole('button', { name: 'Simular login e continuar' }).click();
  const toggle = page.getByRole('button', {
    name: /Golden Signal #160.*favoritos/,
  });
  await expect(toggle).toBeEnabled();
  const selected = await toggle.getAttribute('aria-pressed');
  await toggle.click();
  await expect(toggle).toHaveAttribute(
    'aria-pressed',
    selected === 'true' ? 'false' : 'true'
  );
  await expect(toggle).toBeEnabled();
  await page.reload();
  await expect(toggle).toHaveAttribute(
    'aria-pressed',
    selected === 'true' ? 'false' : 'true'
  );
});

test('catalog fits viewport, assets load, and keyboard reaches card links', async ({
  page,
}, info) => {
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  const image = page.locator('.nft-card img').first();
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
      )
    )
    .toBe(true);
  const link = page.getByRole('link', {
    name: 'Ver Golden Signal #160',
    exact: true,
  });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', {
      name: 'Adicionar Golden Signal #160 aos favoritos',
    })
  ).toBeFocused();
  await page.screenshot({
    path: `test-results/catalog-${info.project.name}.png`,
    fullPage: true,
  });
});

test('desktop sections load only at the desktop breakpoint', async ({
  page,
}, info) => {
  const desktopModuleRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/CatalogDesktopSections.tsx')) {
      desktopModuleRequests.push(request.url());
    }
  });
  await page.goto('/?q=Kurio#diario');
  const heading = page.getByRole('heading', { name: 'Diário da Cunhagem' });
  if (info.project.name === 'mobile') {
    await expect(
      page.getByRole('heading', { name: 'Início', exact: true })
    ).toBeAttached();
    await expect(heading).toHaveCount(0);
    expect(desktopModuleRequests).toHaveLength(0);
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await expect(heading).toBeVisible();
  if (info.project.name === 'mobile') {
    await expect.poll(() => desktopModuleRequests.length).toBeGreaterThan(0);
  }
  await expect
    .poll(() =>
      heading.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().top)
      )
    )
    .toBeLessThan(5);
  const navigation = page.getByRole('navigation', {
    name: 'Navegação principal',
  });
  const market = navigation.getByRole('link', { name: 'Mercado', exact: true });
  const learn = navigation.getByRole('link', { name: 'Aprenda', exact: true });
  await expect(learn).toHaveAttribute('data-status', 'active');
  await market.click();
  await expect.poll(() => new URL(page.url()).hash).toBe('#catalogo');
  expect(new URL(page.url()).searchParams.get('q')?.replace(/^"|"$/g, '')).toBe(
    'Kurio'
  );
  await expect(market).toHaveAttribute('data-status', 'active');
  await expect(learn).not.toHaveAttribute('data-status', 'active');
  await learn.click();
  await expect.poll(() => new URL(page.url()).hash).toBe('#diario');
  await expect(learn).toHaveAttribute('data-status', 'active');
});

test('decimal precision and repeated categories survive direct URLs', async ({
  page,
}, info) => {
  const response = page.waitForResponse(
    (r) =>
      new URL(r.url()).pathname === '/api/nfts' && r.url().includes('minPrice=')
  );
  await page.goto(
    '/?q=160&categories=Arte+digital&categories=Arte+3D&minPrice=0.020000000000000001&maxPrice=12.30'
  );
  const params = new URL((await response).url()).searchParams;
  expect(params.get('q')).toBe('160');
  expect(params.get('minPrice')).toBe('0.020000000000000001');
  expect(params.get('maxPrice')).toBe('12.30');
  expect(params.getAll('categories')).toEqual(['Arte digital', 'Arte 3D']);
  await page.reload();
  await expect(
    page
      .getByRole('searchbox', { name: 'Buscar NFTs' })
      .filter({ visible: true })
  ).toHaveValue('160');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Abrir filtros' }).click();
  await expect(
    page.getByRole('slider', { name: 'Preço mínimo' }).filter({ visible: true })
  ).toHaveAttribute('aria-valuetext', '0,020000000000000001 ETH');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect
    .poll(() =>
      new URL(page.url()).searchParams.get('minPrice')?.replace(/^"|"$/g, '')
    )
    .toBe('0.020000000000000001');
});
