import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatTime, createStopwatch } from './stopwatch.js';

// ─── formatTime (pure function) ───────────────────────────────────────────────

describe('formatTime', () => {
  it('returns 00:00.00 for 0 ms', () => {
    expect(formatTime(0)).toBe('00:00.00');
  });

  it('formats 1 second as 00:01.00', () => {
    expect(formatTime(1000)).toBe('00:01.00');
  });

  it('formats 1.5 seconds as 00:01.50', () => {
    expect(formatTime(1500)).toBe('00:01.50');
  });

  it('formats 1 minute 1 second as 01:01.00', () => {
    expect(formatTime(61000)).toBe('01:01.00');
  });

  it('formats 2 minutes 5 seconds as 02:05.00', () => {
    expect(formatTime(125000)).toBe('02:05.00');
  });
});

// ─── Stopwatch DOM behaviour ──────────────────────────────────────────────────

describe('Stopwatch', () => {
  let display, btnStart, btnStop, btnLap, btnReset, lapList, lapsHeader;
  let stopwatch;
  let mockNow;
  let rafCallback;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="display">00:00.00</div>
      <button id="btn-start">Start</button>
      <button id="btn-stop">Stop</button>
      <button id="btn-lap" disabled>Lap</button>
      <button id="btn-reset">Reset</button>
      <div class="laps-header" id="laps-header"></div>
      <ul id="lap-list"></ul>
    `;

    mockNow = 1000;
    vi.stubGlobal('performance', { now: () => mockNow });
    vi.stubGlobal('requestAnimationFrame', (cb) => { rafCallback = cb; return 1; });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    display    = document.getElementById('display');
    btnStart   = document.getElementById('btn-start');
    btnStop    = document.getElementById('btn-stop');
    btnLap     = document.getElementById('btn-lap');
    btnReset   = document.getElementById('btn-reset');
    lapList    = document.getElementById('lap-list');
    lapsHeader = document.getElementById('laps-header');

    stopwatch = createStopwatch({ display, btnStart, btnStop, btnLap, btnReset, lapList, lapsHeader });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    rafCallback = null;
  });

  // Criterion 1: On page load, display shows 00:00.00 and lap list is empty
  it('display shows 00:00.00 on init and lap list is empty', () => {
    expect(display.textContent).toBe('00:00.00');
    expect(lapList.children.length).toBe(0);
  });

  // Criterion 6: Lap button is disabled before the stopwatch is ever started
  it('lap button is disabled before start', () => {
    expect(btnLap.disabled).toBe(true);
  });

  // Criterion 2: Clicking Start makes the display update in real time
  it('clicking Start enables the lap button', () => {
    btnStart.click();
    expect(btnLap.disabled).toBe(false);
  });

  it('display updates to show elapsed time after Start and a rendered frame', () => {
    mockNow = 1000;
    btnStart.click(); // startTime = 1000 - 0 = 1000
    mockNow = 2500;   // 1500 ms elapsed
    rafCallback();    // trigger tick manually
    expect(display.textContent).toBe('00:01.50');
  });

  // Criterion 3: Clicking Stop pauses the time; display does not change after Stop
  it('clicking Stop freezes the display', () => {
    mockNow = 1000;
    btnStart.click();
    mockNow = 2000;
    rafCallback(); // display → 00:01.00
    const frozenValue = display.textContent;
    btnStop.click();
    // No further frames triggered — display must stay frozen
    expect(display.textContent).toBe(frozenValue);
    expect(display.textContent).toBe('00:01.00');
  });

  it('timer can be resumed after Stop and continues from where it left off', () => {
    mockNow = 1000;
    btnStart.click();
    mockNow = 2000;  // 1 s elapsed
    rafCallback();   // tick
    btnStop.click(); // pause at 1 s

    mockNow = 5000;
    btnStart.click(); // resume; startTime = 5000 - 1000 = 4000
    mockNow = 6500;   // 2.5 s total elapsed
    rafCallback();
    expect(display.textContent).toBe('00:02.50');
  });

  // Criterion 4: Clicking Reset returns display to 00:00.00 and removes all laps
  it('clicking Reset returns display to 00:00.00 and clears all laps', () => {
    btnStart.click();
    stopwatch.lap(); // add a lap while running
    btnStop.click();
    btnReset.click();
    expect(display.textContent).toBe('00:00.00');
    expect(lapList.children.length).toBe(0);
  });

  it('clicking Reset disables the Lap button', () => {
    btnStart.click();
    btnReset.click();
    expect(btnLap.disabled).toBe(true);
  });

  it('clicking Reset hides the laps header', () => {
    btnStart.click();
    stopwatch.lap();
    btnReset.click();
    expect(lapsHeader.classList.contains('visible')).toBe(false);
  });

  // Criterion 5: Clicking Lap while running adds an entry with the current time
  it('clicking Lap while running adds an entry labelled "Lap 1" with the current time', () => {
    mockNow = 1000;
    btnStart.click();
    mockNow = 2000; // 1 s elapsed
    rafCallback();  // tick so elapsed is set
    btnLap.click();
    expect(lapList.children.length).toBe(1);
    expect(lapList.children[0].textContent).toContain('Lap 1');
    expect(lapList.children[0].textContent).toContain('00:01.00');
  });

  it('multiple lap clicks produce sequential labels Lap 1, Lap 2, …', () => {
    btnStart.click();
    stopwatch.lap();
    stopwatch.lap();
    stopwatch.lap();
    expect(lapList.children.length).toBe(3);
    // prepend means most-recent is first; last lap added is Lap 3 at index 0
    expect(lapList.children[0].textContent).toContain('Lap 3');
    expect(lapList.children[2].textContent).toContain('Lap 1');
  });

  it('clicking Lap makes the laps header visible', () => {
    btnStart.click();
    stopwatch.lap();
    expect(lapsHeader.classList.contains('visible')).toBe(true);
  });

  // Criterion 6: Lap button does nothing when the stopwatch has never been started
  it('calling lap() when not running does not add any entry', () => {
    stopwatch.lap(); // running = false, should be a no-op
    expect(lapList.children.length).toBe(0);
  });

  it('lap button is disabled (not clickable) before start', () => {
    // jsdom respects disabled — click on disabled button does not fire handler
    btnLap.click();
    expect(lapList.children.length).toBe(0);
  });
});
