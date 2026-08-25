(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const startBtn = document.querySelector('button[type="button"].bg-accent-lime');
  if (!startBtn) return;

  startBtn.click();

  const percentToIndex = (leftStr) => {
    const val = parseFloat(leftStr);
    if (isNaN(val)) return -1;
    if (val <= 5) return 0;
    if (val <= 30) return 1;
    if (val <= 55) return 2;
    return 3;
  };

  const scene = document.querySelector(".elidolo-escena");
  const grid = scene.querySelector('.grid.grid-cols-4');
  const buttons = grid ? Array.from(grid.querySelectorAll('button')) : [];

  if (!buttons.length) {
    console.log('No shirt buttons found');
    return;
  }

  // Helper to check for visible ball based on class name
  const findBallIndex = () => {
    return buttons.findIndex(btn => {
      const ballSpan = btn.querySelector('span');
      return ballSpan && ballSpan.classList.contains('opacity-100');
    });
  };

  // 2. DETECT INITIAL BALL POSITION (Mutation-driven instead of polling)
  let currentBallPos = findBallIndex();

    if (currentBallPos === -1) {
    console.log('Waiting for initial ball position...');

    currentBallPos = await new Promise((resolve) => {
      const initialObserver = new MutationObserver(() => {
        const index = findBallIndex();

        if (index !== -1) {
          initialObserver.disconnect();

          console.log(
            `Initial Ball detected at Position #${index + 1}`
          );

          resolve(index);
        }
      });

      if (grid) {
        initialObserver.observe(grid, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true
        });
      }
    });
  } else {
    console.log(
      `Initial Ball detected at Position #${currentBallPos + 1}`
    );
  }

  const activeSwaps = new Set();

  const observer = new MutationObserver(() => {
    const activeElements = Array.from(document.querySelectorAll('.elidolo-mueve'));

    const greenElements = activeElements.filter(el => {
      const html = el.innerHTML;
      return html.includes('trileCasacaLime') || html.includes('rgba(34,231,75');
    });

    if (greenElements.length === 2) {
      const swappedPositions = greenElements
        .map(el => percentToIndex(el.style.left))
        .filter(pos => pos !== -1)
        .sort((a, b) => a - b);

      if (swappedPositions.length === 2) {
        const pairKey = swappedPositions.join('-');

        if (!activeSwaps.has(pairKey)) {
          activeSwaps.add(pairKey);
          const [posA, posB] = swappedPositions;

          if (currentBallPos === posA) {
            currentBallPos = posB;
            console.log(`Swap! Ball moved: #${posA + 1} ➔ #${posB + 1}`);
          } else if (currentBallPos === posB) {
            currentBallPos = posA;
            console.log(`Swap! Ball moved: #${posB + 1} ➔ #${posA + 1}`);
          }

          setTimeout(() => activeSwaps.delete(pairKey), 300);
        }
      }
    }
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    attributes: true, 
    attributeFilter: ['style', 'class'] 
  });

  await sleep(6000);

  observer.disconnect();
  console.log(`Final Result: Ball ended at Position #${currentBallPos + 1}`);

  // 6. CLICK THE WINNING SHIRT BUTTON
  if (buttons[currentBallPos]) {
    buttons[currentBallPos].disabled = false;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
      buttons[currentBallPos].dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
    });
  }
})();