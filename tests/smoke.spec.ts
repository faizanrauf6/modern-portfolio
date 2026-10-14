import { test, expect } from '@playwright/test';
import portfolioData from '../data/portfolio.json';

const ROUTES: { path: string; heading: RegExp }[] = [
  { path: '/', heading: /Muhammad Faizan Rauf/i },
  { path: '/experience', heading: /Professional/i },
  { path: '/skills', heading: /Tools & Technologies/i },
  { path: '/project', heading: /Major Project/i },
  { path: '/playground', heading: /Playground/i },
  { path: '/blog', heading: /How things/i },
  { path: '/blog/how-mcp-tool-calling-works', heading: /MCP/i },
  { path: '/blog/building-reliable-ai-automation', heading: /automation/i },
  { path: '/blog/evaluating-phishing-detection-models', heading: /phishing/i },
  { path: '/blog/serving-python-ml-models-with-nestjs', heading: /NestJS/i },
  { path: '/blog/how-claude-skills-and-harnesses-work', heading: /Claude.*skills/i },
  { path: '/blog/from-requirements-to-solution-architecture', heading: /requirements.*architecture/i },
  { path: '/blog/designing-reliable-event-driven-integrations', heading: /event-driven.*integrations/i },
  { path: '/blog/building-observable-resilient-aws-systems', heading: /observable.*AWS/i },
];

for (const { path, heading } of ROUTES) {
  test(`${path} loads and renders its heading`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status(), `${path} should not be an error response`).toBeLessThan(
      400,
    );
    await expect(
      page.getByRole('heading', { name: heading }).first(),
    ).toBeVisible();
  });
}

test('updated architect identity reaches metadata, the profile dashboard, and the downloadable CV', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Solution Architect.*AI\/ML & Cloud Systems Engineer/);
  const person = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(person!).jobTitle).toBe('Solution Architect | AI/ML & Cloud Systems Engineer');
  await expect(page.locator('pre')).toContainText('Solution Architect & AI/ML Engineer');
  await page.getByRole('button', { name: 'View Résumé', exact: true }).click();
  const cvPath = '/Muhammad_Faizan_Rauf_Solution_Architect_CV.pdf';
  await expect(page.getByRole('link', { name: 'Download', exact: true })).toHaveAttribute('href', cvPath);
  await expect(page.locator('iframe')).toHaveAttribute('src', `${cvPath}#view=FitH`);
  const pdf = await request.get(cvPath);
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('architecture articles are discoverable through their category and registered in the sitemap', async ({ page, request }) => {
  await page.goto('/blog');
  await expect(page.getByText('13 articles', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Solution Architecture/ }).click();
  const paths = [
    '/blog/from-requirements-to-solution-architecture',
    '/blog/designing-reliable-event-driven-integrations',
    '/blog/building-observable-resilient-aws-systems',
  ];
  for (const path of paths) {
    // The outgoing featured card stays mounted during its exit animation.
    await expect(page.locator(`a[href="${path}"]`)).toHaveCount(1);
    await expect(page.locator(`a[href="${path}"]`)).toBeVisible();
  }
  await expect(page.locator('a[href="/blog/how-rag-works"]')).toHaveCount(0);
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  for (const path of paths) expect(xml).toContain(path);
});

test('404 route renders the custom not-found page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: /Not found/i })).toBeVisible();
});

test('command palette opens with the keyboard shortcut', async ({ page }) => {
  await page.goto('/');
  // Wait for hydration — the shortcut listener attaches on mount.
  await expect(
    page.getByRole('button', { name: /open command palette/i }),
  ).toBeVisible();
  const field = page.getByPlaceholder('Type a command or search…');
  await expect(async () => {
    await page.keyboard.press('Control+k');
    await expect(field).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await page.keyboard.press('Escape');
  await expect(field).toBeHidden();
});

test('playground tabs switch the active demo', async ({ page }) => {
  await page.goto('/playground');
  await page.getByRole('tab', { name: 'Motion' }).click();
  await expect(
    page.getByRole('heading', { name: /Tune the spring/i }),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'Layouts' }).click();
  await expect(
    page.getByRole('heading', { name: /three layouts/i }),
  ).toBeVisible();
});

for (const width of [320, 375, 1440]) {
  test(`hero dashboard switches between impact cards and profile at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Impact', exact: true }).click();
    const impact = page.getByRole('region', { name: 'Portfolio impact' });
    await expect(impact.getByRole('article')).toHaveCount(5);
    for (const stat of portfolioData.profile.impactStats) {
      const card = impact.getByRole('article', { name: stat.label, exact: true });
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByText(stat.value, { exact: true })).toBeVisible();
      await expect(card.getByText(stat.desc, { exact: true })).toBeVisible();
    }
    expect(await impact.evaluate(el => el.scrollHeight)).toBeLessThanOrEqual(await impact.evaluate(el => el.clientHeight));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'About Me', exact: true }).click();
    await expect(impact).toBeHidden();
    const profile = page.locator('pre').filter({ hasText: 'Muhammad Faizan Rauf' }).first();
    await expect(profile).toBeVisible();
    // About Me should end at its content plus padding, without a fixed-height gap.
    const expectContentFits = async (content: typeof profile) => {
      await expect(async () => {
        const geometry = await content.evaluate(el => {
          const body = el.parentElement!.parentElement!;
          return {
            gap: body.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom,
            padding: parseFloat(getComputedStyle(body).paddingBottom),
          };
        });
        expect(Math.abs(geometry.gap - geometry.padding)).toBeLessThan(2);
      }).toPass({ timeout: 5000 });
    };
    await expectContentFits(profile);
    await page.getByRole('button', { name: 'Tech Stack', exact: true }).click();
    const stack = page.getByRole('region', { name: 'Technology stack' });
    await expect(stack).toBeVisible();
    expect(await stack.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await expect(stack).toHaveCSS('overflow-y', 'auto');
    const lastCategory = page.getByText(portfolioData.skills.at(-1)!.category, { exact: true }).locator('..');
    await lastCategory.scrollIntoViewIfNeeded();
    await expect(lastCategory).toBeVisible();
    expect(await stack.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  });
}

for (const viewport of [{ width: 1280, height: 900 }, { width: 1440, height: 1200 }]) {
  test(`hero name stays in place while dashboard tabs resize at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const heading = page.getByRole('heading', { name: /Muhammad Faizan Rauf/i }).first();
    await expect(heading.locator('..')).toHaveCSS('transform', 'none');

    for (const tab of ['Impact', 'About Me', 'Tech Stack', 'About Me']) {
      const positions = page.evaluate(() => new Promise<number[]>(resolve => {
        const heading = document.querySelector('h1')!;
        const samples: number[] = [];
        const start = performance.now();
        const sample = () => {
          samples.push(heading.getBoundingClientRect().top + window.scrollY);
          if (performance.now() - start < 1000) requestAnimationFrame(sample);
          else resolve(samples);
        };
        sample();
      }));
      await page.getByRole('button', { name: tab, exact: true }).click();
      const samples = await positions;
      expect(Math.max(...samples) - Math.min(...samples), `Name should stay anchored when selecting ${tab}`).toBeLessThan(1);
    }
  });
}

test('six approved recommendations retain LinkedIn attribution only where supplied', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#testimonials');
  await expect(section.locator('figure')).toHaveCount(6);
  await expect(section.locator('blockquote')).toHaveCount(6);
  for (const name of ['Stephen Chin', 'Usman Altaf', 'Nasir Mehmood', 'Khizar Rehman']) {
    const card = section.locator('figure').filter({ hasText: name });
    await expect(card.getByText('LinkedIn recommendation', { exact: true })).toHaveCount(0);
    await expect(card.getByRole('link')).toHaveCount(0);
    await expect(card.getByText(/Suggested wording|Draft · awaiting approval/)).toHaveCount(0);
  }
  const fullReview = section.getByRole('button', { name: 'Read full recommendation' });
  await fullReview.click();
  await expect(section.getByText(/Wishing him continued success/)).toBeVisible();
  await expect(section.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
});

test('GitHub section exposes six repositories and a contribution calendar', async ({ page }) => {
  await page.goto('/project');
  const section = page.locator('#open-source');
  await expect(section.getByRole('article')).toHaveCount(6);
  await expect(section.getByRole('img', { name: /GitHub contributions from/ })).toBeVisible();
  await expect(section.getByRole('link', { name: 'Open webshield-ai-fraud-detection on GitHub' })).toHaveAttribute('href', 'https://github.com/faizanrauf6/webshield-ai-fraud-detection');
  await expect(section.getByRole('link', { name: 'Live demo of tax-wise' })).toHaveAttribute('href', 'https://tax-wise.vercel.app');
});

test('AI terminal opens, shows suggestions, and answers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /open the ai terminal/i }).click();

  const input = page.getByPlaceholder(/type "help"/i);
  await expect(input).toBeVisible();

  await input.focus();
  await expect(page.getByText(/try one/i)).toBeVisible();

  await input.fill('Is he available for remote work?');
  await input.press('Enter');
  await expect(
    page.getByText('$ Is he available for remote work?'),
  ).toBeVisible();
  // Real answer or the offline notice — either proves the request pipe works.
  await expect(page.locator('pre').last()).not.toBeEmpty({ timeout: 15000 });
});

test('mobile navbar collapses into a working menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  // The inline desktop link row must not be visible at this width.
  const inlineProjects = page.locator('nav >> text=Projects').first();
  await expect(inlineProjects).toBeHidden();

  await page.getByRole('button', { name: 'Menu' }).click();
  // Inside <nav> two "Playground" links exist (hidden desktop row + dropdown);
  // the visible one is the dropdown.
  const menuLink = page
    .locator('nav')
    .getByRole('link', { name: 'Playground' })
    .last();
  await expect(menuLink).toBeVisible();
  await menuLink.click();
  await expect(page).toHaveURL(/\/playground$/);
});

test('sitemap and robots are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sitemapText = await sitemap.text();
  const siteConfigured = Boolean(process.env.SITE_URL || portfolioData.profile.website);
  if (siteConfigured) expect(sitemapText).toContain('/playground');
  else expect(sitemapText).not.toContain('<loc>');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  if (siteConfigured) expect(robotsText).toContain('Sitemap:');
  else expect(robotsText).toContain('Disallow: /');
});
