import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createCounter } from './counter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AC: Count starts at 0 on page load
describe('initial state', () => {
  it('count starts at 0', () => {
    const display = document.createElement('div');
    const counter = createCounter(display);
    expect(counter.getCount()).toBe(0);
  });

  it('display element is unchanged (shows 0) before any interaction', () => {
    const display = document.createElement('div');
    display.textContent = '0';
    createCounter(display);
    expect(display.textContent).toBe('0');
  });
});

// AC: Clicking Increment increases the count by exactly 1 each time
describe('increment behaviour', () => {
  let display, counter;

  beforeEach(() => {
    display = document.createElement('div');
    counter = createCounter(display);
  });

  it('increment increases count from 0 to 1', () => {
    counter.increment();
    expect(counter.getCount()).toBe(1);
  });

  it('each increment adds exactly 1', () => {
    counter.increment();
    counter.increment();
    counter.increment();
    expect(counter.getCount()).toBe(3);
  });

  // AC: The current count is visible and readable (DOM updated)
  it('increment updates the DOM display', () => {
    counter.increment();
    expect(display.textContent).toBe('1');
  });

  it('DOM display reflects count after multiple increments', () => {
    counter.increment();
    counter.increment();
    counter.increment();
    expect(display.textContent).toBe('3');
  });
});

// AC: Clicking Reset sets the count to 0
describe('reset behaviour', () => {
  let display, counter;

  beforeEach(() => {
    display = document.createElement('div');
    counter = createCounter(display);
  });

  it('reset after increments returns count to 0', () => {
    counter.increment();
    counter.increment();
    counter.increment();
    counter.reset();
    expect(counter.getCount()).toBe(0);
  });

  it('reset updates the DOM display to 0', () => {
    counter.increment();
    counter.increment();
    counter.reset();
    expect(display.textContent).toBe('0');
  });

  it('increment after reset starts from 0', () => {
    counter.increment();
    counter.increment();
    counter.reset();
    counter.increment();
    expect(counter.getCount()).toBe(1);
  });
});

// AC: No console errors on load or interaction
describe('no console errors', () => {
  it('increment does not throw or log errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const display = document.createElement('div');
    const counter = createCounter(display);
    expect(() => counter.increment()).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('reset does not throw or log errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const display = document.createElement('div');
    const counter = createCounter(display);
    counter.increment();
    expect(() => counter.reset()).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

// AC: DOM integration — buttons wire up correctly
describe('DOM button integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="count">0</div>
      <button id="increment">Increment</button>
      <button id="reset">Reset</button>
    `;
    const display = document.getElementById('count');
    const counter = createCounter(display);
    document.getElementById('increment').addEventListener('click', () => counter.increment());
    document.getElementById('reset').addEventListener('click', () => counter.reset());
  });

  it('count display starts at 0', () => {
    expect(document.getElementById('count').textContent).toBe('0');
  });

  it('clicking increment button updates display to 1', () => {
    document.getElementById('increment').click();
    expect(document.getElementById('count').textContent).toBe('1');
  });

  it('clicking reset button after increments shows 0', () => {
    document.getElementById('increment').click();
    document.getElementById('increment').click();
    document.getElementById('increment').click();
    document.getElementById('reset').click();
    expect(document.getElementById('count').textContent).toBe('0');
  });
});

// AC: Page is usable on a mobile screen (375px wide)
describe('mobile usability', () => {
  it('viewport meta tag is present in index.html for mobile support', () => {
    const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('width=device-width');
  });

  it('card uses responsive width fitting within 375px mobile', () => {
    const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
    expect(html).toMatch(/min\(.*360px.*90vw|max-width.*360px/);
  });
});
