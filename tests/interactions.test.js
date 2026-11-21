'use strict';

const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const { after, before, test } = require('node:test');
const { chromium } = require('playwright');

let server;
let browser;
let baseUrl;

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;

  try {
    return execFileSync(process.platform === 'win32' ? 'where' : 'which', ['chromium'], {
      encoding: 'utf8',
    }).trim().split(/\r?\n/)[0];
  } catch {
    return undefined;
  }
}

async function startServer() {
  server = spawn('python3', ['-u', '-m', 'http.server', '0', '--bind', '127.0.0.1'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const port = await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => {
      reject(new Error(`Static test server did not start: ${output}`));
    }, 8000);

    server.stdout.setEncoding('utf8');
    server.stdout.on('data', (chunk) => {
      output += chunk;
      const match = output.match(/port (\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    server.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Static test server exited before starting (${code}).`));
    });
  });

  baseUrl = `http://127.0.0.1:${port}/`;
}

async function createPage() {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  return { context, page };
}

async function focusIsVisible(locator) {
  return locator.evaluate((element) => ({
    active: element === document.activeElement,
    visible: element.matches(':focus-visible'),
    outlineStyle: getComputedStyle(element).outlineStyle,
    outlineWidth: getComputedStyle(element).outlineWidth,
  }));
}

async function assertVisibleKeyboardFocus(locator) {
  const focus = await focusIsVisible(locator);
  assert.equal(focus.active, true, 'the activated control should retain keyboard focus');
  assert.equal(focus.visible, true, 'the control should match :focus-visible');
  assert.equal(focus.outlineStyle, 'solid', 'the control should show a focus outline');
  assert.notEqual(focus.outlineWidth, '0px', 'the focus outline should have visible width');
}

async function openGiftWithKey(page, key) {
  await page.keyboard.press('Tab');
  await assertVisibleKeyboardFocus(page.locator('#abrir'));
  await page.keyboard.press(key);
  await page.waitForFunction(() => !document.body.classList.contains('cerrado'));
  assert.equal(await page.locator('#c2').isVisible(), true);
  assert.equal(
    await page.locator('#c2 h2').evaluate((heading) => heading === document.activeElement),
    true,
    'opening the gift should move focus to the first chapter heading',
  );
}

async function openGift(page) {
  await page.getByRole('button', { name: 'Abrir regalo', exact: true }).click();
  await page.waitForFunction(() => !document.body.classList.contains('cerrado'));
}

before(async () => {
  await startServer();
  const executablePath = findChromium();
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
    ...(executablePath ? { executablePath } : {}),
  });
});

after(async () => {
  if (browser) await browser.close();
  if (server && server.exitCode === null) server.kill('SIGTERM');
});

test('opening the gift reveals chapters and generates working navigation', async () => {
  const { context, page } = await createPage();
  try {
    assert.equal(await page.locator('#nav a').count(), 0, 'chapter navigation starts hidden');
    assert.equal(await page.locator('#c2').isVisible(), false, 'later chapters start hidden');

    await openGift(page);

    assert.equal(await page.locator('#c2').isVisible(), true);
    assert.equal(await page.locator('#c3').isVisible(), true);
    assert.equal(await page.locator('#c4').isVisible(), true);

    const navigation = await page.locator('#nav a').evaluateAll((links) =>
      links.map((link) => ({
        hash: new URL(link.href).hash,
        label: link.getAttribute('aria-label'),
      })),
    );
    const chapters = await page.locator('main > section[data-t]').evaluateAll((sections) =>
      sections.map((section) => ({
        hash: `#${section.id}`,
        label: section.dataset.t,
      })),
    );
    assert.deepEqual(navigation, chapters);

    await page.locator('#nav a[href="#c4"]').click();
    await page.waitForFunction(() => location.hash === '#c4');
    await page.waitForFunction(() =>
      document.querySelector('#nav a[href="#c4"]')?.classList.contains('act'),
    );
  } finally {
    await context.close();
  }
});

test('the hidden lightbulb message appears when the bulb is clicked', async () => {
  const { context, page } = await createPage();
  try {
    await openGift(page);
    assert.equal(await page.locator('#secreto').textContent(), '');

    await page.locator('#foco').click();

    assert.equal(
      await page.locator('#secreto').textContent(),
      'Esta se enciende el día de nuestro primer abrazo.',
    );
    assert.equal(await page.locator('#foco').evaluate((bulb) => bulb.classList.contains('on')), true);
    assert.equal(await page.locator('#foco').getAttribute('aria-pressed'), 'true');
  } finally {
    await context.close();
  }
});

test('constellation buttons update the message and move the selected state', async () => {
  const { context, page } = await createPage();
  try {
    await openGift(page);
    assert.equal(await page.locator('#cons .est').count(), 10);
    assert.equal(
      await page.locator('#nota').textContent(),
      'Elige una estrella y te cuento por qué la he puesto aquí.',
    );

    await page.getByRole('button', { name: 'Rocket League', exact: true }).click();
    assert.equal(
      await page.locator('#nota').textContent(),
      'Otro juego que nos dio un montón de buenos ratos.',
    );
    assert.equal(
      await page.getByRole('button', { name: 'Rocket League', exact: true }).getAttribute('aria-pressed'),
      'true',
    );

    await page.getByRole('button', { name: 'Instagram', exact: true }).click();
    assert.equal(await page.locator('#nota').textContent(), 'Por aquí empezó todo entre nosotros.');
    assert.equal(
      await page.getByRole('button', { name: 'Instagram', exact: true }).getAttribute('aria-pressed'),
      'true',
    );
    assert.equal(
      await page.getByRole('button', { name: 'Rocket League', exact: true }).getAttribute('aria-pressed'),
      'false',
    );
  } finally {
    await context.close();
  }
});

test('chapter content and controls fit a mobile viewport', async () => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await openGift(page);

    const layout = await page.evaluate(() => {
      const controls = [
        ...document.querySelectorAll('#abrir, #foco, #nav a, #cons .est'),
      ];
      return {
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        outOfBoundsControls: controls
          .map((control) => control.getBoundingClientRect())
          .filter((rect) => rect.left < 0 || rect.right > innerWidth).length,
        sectionWidths: [...document.querySelectorAll('main > section')].map(
          (section) => section.getBoundingClientRect().width,
        ),
      };
    });

    assert.ok(layout.documentWidth <= layout.viewport, 'page should not scroll horizontally');
    assert.equal(layout.outOfBoundsControls, 0, 'interactive controls should stay on screen');
    assert.ok(
      layout.sectionWidths.every((width) => width <= layout.viewport),
      'chapters should not exceed the mobile viewport',
    );
  } finally {
    await context.close();
  }
});

test('reduced-motion preference disables transitions and opens without a delay', async () => {
  const { context, page } = await createPage();
  try {
    const motionStyles = await page.evaluate(() => ({
      preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      buttonTransition: getComputedStyle(document.querySelector('#abrir')).transitionDuration,
      flashAnimation: getComputedStyle(document.querySelector('.flash')).animationName,
    }));
    assert.equal(motionStyles.preference, true);
    assert.equal(motionStyles.scrollBehavior, 'auto');
    assert.equal(motionStyles.buttonTransition, '0s');
    assert.equal(motionStyles.flashAnimation, 'none');

    await openGift(page);
    assert.equal(
      await page.locator('body').evaluate((body) => body.classList.contains('abriendo')),
      false,
    );
    assert.equal(
      await page.locator('#c2 h2').evaluate((heading) => heading === document.activeElement),
      true,
    );
  } finally {
    await context.close();
  }
});

for (const key of ['Enter', 'Space']) {
  test(`the gift opens with ${key} when focused`, async () => {
    const { context, page } = await createPage();
    try {
      await openGiftWithKey(page, key);
    } finally {
      await context.close();
    }
  });
}

test('the hidden bulb activates from the keyboard with focus and state cues', async () => {
  const { context, page } = await createPage();
  try {
    await openGiftWithKey(page, 'Enter');
    await page.keyboard.press('Tab');
    await assertVisibleKeyboardFocus(page.locator('#foco'));
    assert.equal(await page.locator('#foco').getAttribute('aria-pressed'), 'false');

    await page.keyboard.press('Space');

    assert.equal(
      await page.locator('#secreto').textContent(),
      'Esta se enciende el día de nuestro primer abrazo.',
    );
    assert.equal(await page.locator('#foco').getAttribute('aria-pressed'), 'true');
    assert.equal(
      await page.locator('#foco').getAttribute('aria-label'),
      'Bombilla encendida. Sorpresa descubierta',
    );
    await assertVisibleKeyboardFocus(page.locator('#foco'));
  } finally {
    await context.close();
  }
});

test('constellation points are keyboard-operable with visible focus and selection', async () => {
  const { context, page } = await createPage();
  try {
    await openGiftWithKey(page, 'Enter');
    const instagram = page.getByRole('button', { name: 'Instagram', exact: true });
    await instagram.focus();
    await assertVisibleKeyboardFocus(instagram);
    assert.equal(await instagram.getAttribute('aria-pressed'), 'false');

    await page.keyboard.press('Enter');

    assert.equal(await instagram.getAttribute('aria-pressed'), 'true');
    assert.equal(
      await page.locator('#nota').textContent(),
      'Por aquí empezó todo entre nosotros.',
    );
    await assertVisibleKeyboardFocus(instagram);

    const discord = page.getByRole('button', { name: 'Discord', exact: true });
    await discord.focus();
    await assertVisibleKeyboardFocus(discord);
    await page.keyboard.press('Space');

    assert.equal(await discord.getAttribute('aria-pressed'), 'true');
    assert.equal(await instagram.getAttribute('aria-pressed'), 'false');
    assert.equal(
      await page.locator('#nota').textContent(),
      'Ahí empezamos a hablar cada vez más.',
    );
    await assertVisibleKeyboardFocus(discord);
  } finally {
    await context.close();
  }
});
