import { describe, it, expect, beforeEach } from 'vitest';
import { initCounter } from './counter.js';

describe('Counter', () => {
  let display, incrementBtn, resetBtn, counter;

  beforeEach(() => {
    document.body.innerHTML = `
      <span id="count">0</span>
      <button id="btn-increment">Increment</button>
      <button id="btn-reset">Reset</button>
    `;
    display = document.getElementById('count');
    incrementBtn = document.getElementById('btn-increment');
    resetBtn = document.getElementById('btn-reset');
    counter = initCounter(display, incrementBtn, resetBtn);
  });

  it('count starts at 0 on page load', () => {
    expect(display.textContent).toBe('0');
    expect(counter.getCount()).toBe(0);
  });

  it('clicking Increment increases count by exactly 1', () => {
    incrementBtn.click();
    expect(counter.getCount()).toBe(1);
    expect(display.textContent).toBe('1');
  });

  it('clicking Increment multiple times increments correctly each time', () => {
    incrementBtn.click();
    expect(counter.getCount()).toBe(1);
    incrementBtn.click();
    expect(counter.getCount()).toBe(2);
    incrementBtn.click();
    expect(counter.getCount()).toBe(3);
    expect(display.textContent).toBe('3');
  });

  it('clicking Reset sets count to 0', () => {
    incrementBtn.click();
    incrementBtn.click();
    incrementBtn.click();
    resetBtn.click();
    expect(counter.getCount()).toBe(0);
    expect(display.textContent).toBe('0');
  });

  it('clicking Reset after 5 increments returns count to 0', () => {
    for (let i = 0; i < 5; i++) incrementBtn.click();
    expect(counter.getCount()).toBe(5);
    resetBtn.click();
    expect(counter.getCount()).toBe(0);
    expect(display.textContent).toBe('0');
  });

  it('current count is always rendered in the DOM after each increment', () => {
    for (let i = 1; i <= 4; i++) {
      incrementBtn.click();
      expect(display.textContent).toBe(String(i));
    }
  });

  it('Reset with no prior increments keeps count at 0', () => {
    resetBtn.click();
    expect(counter.getCount()).toBe(0);
    expect(display.textContent).toBe('0');
  });

  it('count display element is present and readable in the DOM', () => {
    const el = document.getElementById('count');
    expect(el).not.toBeNull();
    expect(el.textContent).toBe('0');
  });

  it('no thrown errors during increment and reset interactions', () => {
    expect(() => {
      incrementBtn.click();
      incrementBtn.click();
      resetBtn.click();
      incrementBtn.click();
    }).not.toThrow();
  });
});
