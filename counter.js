export function createCounter() {
  let count = 0;
  return {
    increment() { count += 1; return count; },
    reset() { count = 0; return count; },
    getCount() { return count; }
  };
}

export function initCounter(countEl, btnIncrement, btnReset) {
  const counter = createCounter();
  countEl.textContent = counter.getCount();

  btnIncrement.addEventListener('click', function () {
    countEl.textContent = counter.increment();
  });

  btnReset.addEventListener('click', function () {
    countEl.textContent = counter.reset();
  });

  return counter;
}
