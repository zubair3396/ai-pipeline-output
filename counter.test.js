import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createCounter, initCounter } from './counter.js';

// AC: Count starts at 0 on page load
// AC: Clicking Increment increases count by exactly 1 each time
// AC: Clicking Reset sets count to 0
// AC: The current count is visible and readable (DOM textContent reflects state)
// AC: No console errors on load or interaction
// AC: Page is usable on mobile (375px) — layout tested via viewport meta presence

describe('createCounter — pure logic', () => {
  it('count starts at 0', () => {
    const c = createCounter();
    expect(c.getCount()).toBe(0);
  });

  it('increment increases count by exactly 1', () => {
    const c = createCounter();
    c.increment();
    expect(c.getCount()).toBe(1);
  });

  it('each additional increment adds exactly 1', () => {
    const c = createCounter();
    c.increment();
    c.increment();
    c.increment();
    expect(c.getCount()).toBe(3);
  });

  it('reset sets count back to 0 from a non-zero value', () => {
    const c = createCounter();
    c.increment();
    c.increment();
    c.increment();
    c.reset();
    expect(c.getCount()).toBe(0);
  });

  it('reset on a fresh counter stays at 0', () => {
    const c = createCounter();
    c.reset();
    expect(c.getCount()).toBe(0);
  });

  it('increment continues correctly after a reset', () => {
    const c = createCounter();
    c.increment();
    c.increment();
    c.reset();
    c.increment();
    expect(c.getCount()).toBe(1);
  });
});

describe('initCounter — DOM integration', () => {
  let countEl, btnIncrement, btnReset;

  beforeEach(() => {
    countEl = document.createElement('div');
    btnIncrement = document.createElement('button');
    btnReset = document.createElement('button');
    initCounter(countEl, btnIncrement, btnReset);
  });

  it('count is displayed as 0 immediately after init', () => {
    expect(countEl.textContent).toBe('0');
  });

  it('clicking Increment updates the DOM count to 1', () => {
    btnIncrement.click();
    expect(countEl.textContent).toBe('1');
  });

  it('clicking Increment five times displays 5', () => {
    for (let i = 0; i < 5; i++) btnIncrement.click();
    expect(countEl.textContent).toBe('5');
  });

  it('clicking Reset after increments sets DOM count back to 0', () => {
    btnIncrement.click();
    btnIncrement.click();
    btnReset.click();
    expect(countEl.textContent).toBe('0');
  });

  it('clicking Reset after 5 increments displays 0', () => {
    for (let i = 0; i < 5; i++) btnIncrement.click();
    btnReset.click();
    expect(countEl.textContent).toBe('0');
  });

  it('count is readable as a number (no NaN or undefined in DOM)', () => {
    btnIncrement.click();
    expect(Number(countEl.textContent)).not.toBeNaN();
  });
});

describe('No console errors', () => {
  it('no console.error calls during init and button interactions', () => {
    const errorSpy = vi.spyOn(console, 'error');
    const countEl = document.createElement('div');
    const btnIncrement = document.createElement('button');
    const btnReset = document.createElement('button');
    initCounter(countEl, btnIncrement, btnReset);
    btnIncrement.click();
    btnReset.click();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('Mobile viewport — HTML meta tag', () => {
  it('index.html contains a viewport meta tag for mobile usability', async () => {
    const fs = await import('fs');
    const { fileURLToPath } = await import('url');
    const path = await import('path');
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    expect(html).toMatch(/name=["']viewport["']/);
    expect(html).toMatch(/width=device-width/);
  });
});
