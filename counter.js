export function createCounter(displayEl) {
  let count = 0;

  function render() {
    if (displayEl) {
      displayEl.textContent = count;
    }
  }

  function increment() {
    count += 1;
    render();
    return count;
  }

  function reset() {
    count = 0;
    render();
    return count;
  }

  function getCount() {
    return count;
  }

  return { increment, reset, getCount };
}
