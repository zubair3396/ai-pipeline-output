export function formatTime(ms) {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const hundredths = Math.floor((totalMs % 1000) / 10);
  return (
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(hundredths).padStart(2, '0')
  );
}

export function createStopwatch({ display, btnStart, btnStop, btnLap, btnReset, lapList, lapsHeader }) {
  let startTime = 0;
  let elapsed = 0;
  let rafId = null;
  let running = false;
  let lapCount = 0;

  function tick() {
    const now = performance.now();
    elapsed = now - startTime;
    display.textContent = formatTime(elapsed);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now() - elapsed;
    rafId = requestAnimationFrame(tick);
    btnLap.disabled = false;
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function reset() {
    stop();
    elapsed = 0;
    display.textContent = '00:00.00';
    lapCount = 0;
    lapList.innerHTML = '';
    lapsHeader.classList.remove('visible');
    btnLap.disabled = true;
  }

  function lap() {
    if (!running) return;
    lapCount++;
    const time = formatTime(elapsed);
    const li = document.createElement('li');
    li.innerHTML =
      '<span class="lap-label">Lap ' + lapCount + '</span>' +
      '<span>' + time + '</span>';
    lapList.prepend(li);
    lapsHeader.classList.add('visible');
  }

  btnStart.addEventListener('click', start);
  btnStop.addEventListener('click', stop);
  btnReset.addEventListener('click', reset);
  btnLap.addEventListener('click', lap);

  return { start, stop, reset, lap };
}
