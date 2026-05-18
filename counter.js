export function createCounter() {
  let count = 0;
  return {
    getCount() { return count; },
    increment() { count += 1; return count; },
    reset() { count = 0; return count; },
  };
}

export function initUI(counter) {
  const display = document.getElementById('count');
  display.textContent = counter.getCount();

  document.getElementById('btn-increment').addEventListener('click', function () {
    display.textContent = counter.increment();
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    display.textContent = counter.reset();
  });
}
