import { expect, test, type Page } from '@playwright/test';

async function waitForAtlas(page: Page) {
  await page.goto('/');
  await expect(page.getByText('EXPLORATION EN TEMPS RÉEL', { exact: true })).toBeVisible();
  await expect(page.locator('.scene-root canvas')).toBeVisible();
}

async function openStructures(page: Page, mobile: boolean) {
  if (mobile) await page.getByRole('button', { name: 'Ouvrir les systèmes', exact: true }).click();
}

async function choose(page: Page, name: string, mobile: boolean) {
  await openStructures(page, mobile);
  await page.getByLabel('Liste des structures', { exact: true }).getByRole('button', { name: new RegExp(name) }).click();
}

async function openInformation(page: Page, name: string, mobile: boolean) {
  if (mobile) await page.locator('.mobile-bottom-nav').getByRole('button', { name, exact: true }).click();
}

// These scenarios require a working WebGL browser. They are supplied for explicit
// execution with npm run test:e2e; the unit-test workflow does not imply a run.
test('charge le vrai modèle et garde le système indisponible désactivé', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  await openStructures(page, isMobile);
  await expect(page.getByRole('button', { name: /Musculaire/ })).toBeDisabled();
  await expect(page.getByLabel('Liste des structures', { exact: true }).getByRole('button')).toHaveCount(10);
});

test('sélectionne le cœur, ouvre sa source, isole et revient au corps entier', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  await choose(page, 'Cœur', isMobile);
  await openInformation(page, 'Cœur', isMobile);
  const information = page.getByLabel('Fiche anatomique', { exact: true });
  await expect(information.getByRole('heading', { name: 'Cœur', exact: true })).toBeVisible();
  await expect(information.locator('a.source-link')).toHaveAttribute('href', /openstax\.org\/books\/.+19-1-heart-anatomy/);
  await information.getByRole('button', { name: 'Isoler la structure', exact: true }).click();
  await expect(information.getByRole('button', { name: 'Quitter l’isolation', exact: true })).toBeVisible();
  if (isMobile) {
    await page.locator('.mobile-bottom-nav').getByRole('button', { name: 'Vue globale', exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Revenir au corps entier', exact: true }).click();
  }
  await expect(information.getByRole('heading', { name: 'Cœur', exact: true })).toHaveCount(0);
});

test('recherche sans accent et affiche un résultat vide explicite', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  await openStructures(page, isMobile);
  const search = page.getByRole('textbox', { name: 'Rechercher une structure', exact: true });
  await search.fill('coeur');
  const list = page.getByLabel('Liste des structures', { exact: true });
  await expect(list.getByRole('button')).toHaveCount(1);
  await expect(list.getByRole('button', { name: /Cœur/ })).toBeVisible();
  await search.fill('organe inexistant');
  await expect(page.getByText('Aucune structure ne correspond à cette recherche.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Effacer la recherche', exact: true }).click();
  await expect(list.getByRole('button')).toHaveCount(10);
});

test('désactive puis réactive une couche disponible', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  await openStructures(page, isMobile);
  const respiratory = page.getByRole('button', { name: /Respiratoire/ });
  await expect(respiratory).toHaveAttribute('aria-pressed', 'true');
  await respiratory.click();
  await expect(respiratory).toHaveAttribute('aria-pressed', 'false');
  await respiratory.click();
  await expect(respiratory).toHaveAttribute('aria-pressed', 'true');
});

test('conserve la dernière sélection après plusieurs changements rapides', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  await choose(page, 'Cœur', isMobile);
  await choose(page, 'Poumons', isMobile);
  await choose(page, 'Foie', isMobile);
  await openInformation(page, 'Foie', isMobile);
  await expect(page.getByLabel('Fiche anatomique', { exact: true }).getByRole('heading', { name: 'Foie', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cœur', exact: true })).toHaveCount(0);
});

test('fait tourner et zoome sans interrompre le rendu', async ({ page, isMobile }) => {
  await waitForAtlas(page);
  const canvas = page.locator('.scene-root canvas');
  const region = await canvas.boundingBox();
  if (!region) throw new Error('Le canvas ne possède pas de dimensions.');
  const x = region.x + region.width * 0.55;
  const y = region.y + region.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 65, y + 20, { steps: 10 });
  await page.mouse.up();
  if (!isMobile) await page.mouse.wheel(0, -180);
  await expect(canvas).toBeVisible();
  await expect(page.getByText('EXPLORATION EN TEMPS RÉEL', { exact: true })).toBeVisible();
  await expect(page.getByText('MODÈLE INDISPONIBLE', { exact: true })).toHaveCount(0);
});

test('explique un échec de chargement du modèle', async ({ page }) => {
  await page.route('**/models/anatomy.glb', route => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByText('MODÈLE INDISPONIBLE', { exact: true })).toBeVisible();
});
