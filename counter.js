export function initCounter(displayEl, incrementEl, resetEl) {
  var count = 0;
  displayEl.textContent = count;

  incrementEl.addEventListener('click', function () {
    count += 1;
    displayEl.textContent = count;
  });

  resetEl.addEventListener('click', function () {
    count = 0;
    displayEl.textContent = count;
  });

  return {
    getCount: function () { return count; }
  };
}
