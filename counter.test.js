import { describe, it, expect, beforeEach } from 'vitest';
import { createCounter, initUI } from './counter.js';

// ── Pure logic tests ────────────────────────────────────────────────────────

describe('createCounter – pure logic', () => {
  it('count starts at 0', () => {
    const counter = createCounter();
    expect(counter.getCount()).toBe(0);
  });

  it('increment increases count by exactly 1', () => {
    const counter = createCounter();
    counter.increment();
    expect(counter.getCount()).toBe(1);
  });

  it('multiple increments accumulate correctly', () => {
    const counter = createCounter();
    counter.increment();
    counter.increment();
    counter.increment();
    expect(counter.getCount()).toBe(3);
  });

  it('reset sets count back to 0 after increments', () => {
    const counter = createCounter();
    counter.increment();
    counter.increment();
    counter.increment();
    counter.reset();
    expect(counter.getCount()).toBe(0);
  });

  it('reset on a fresh counter keeps count at 0', () => {
    const counter = createCounter();
    counter.reset();
    expect(counter.getCount()).toBe(0);
  });
});

// ── DOM integration tests ───────────────────────────────────────────────────

function buildDOM() {
  document.body.innerHTML = `
    <span id="count">0</span>
    <button id="btn-increment">Increment</button>
    <button id="btn-reset">Reset</button>
  `;
}

describe('initUI – DOM behaviour', () => {
  beforeEach(() => {
    buildDOM();
  });

  it('display shows 0 on initialisation (count visible on page load)', () => {
    const counter = createCounter();
    initUI(counter);
    expect(document.getElementById('count').textContent).toBe('0');
  });

  it('clicking Increment updates the visible count to 1', () => {
    const counter = createCounter();
    initUI(counter);
    document.getElementById('btn-increment').click();
    expect(document.getElementById('count').textContent).toBe('1');
  });

  it('clicking Increment five times shows 5', () => {
    const counter = createCounter();
    initUI(counter);
    for (let i = 0; i < 5; i++) {
      document.getElementById('btn-increment').click();
    }
    expect(document.getElementById('count').textContent).toBe('5');
  });

  it('clicking Reset after increments sets visible count to 0', () => {
    const counter = createCounter();
    initUI(counter);
    document.getElementById('btn-increment').click();
    document.getElementById('btn-increment').click();
    document.getElementById('btn-reset').click();
    expect(document.getElementById('count').textContent).toBe('0');
  });

  it('count updates immediately on each Increment click (no delay)', () => {
    const counter = createCounter();
    initUI(counter);
    document.getElementById('btn-increment').click();
    // Check synchronously — no await needed
    expect(document.getElementById('count').textContent).toBe('1');
  });

  it('display shows correct count at 375px viewport width (mobile usability)', () => {
    // Simulate 375px width (jsdom does not do layout, but we verify the
    // display element is present and readable — CSS rendering is a browser concern)
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    const counter = createCounter();
    initUI(counter);
    const display = document.getElementById('count');
    expect(display).not.toBeNull();
    expect(display.textContent).toBe('0');
  });
});
