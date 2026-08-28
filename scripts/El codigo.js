(() => {
  const START_SELECTOR =
    'button[type="button"].bg-accent-lime';

  const containerSelector = ".elidolo-escena";
  const CARD_SELECTOR = ".memocarta";
  const DISPLAY_SELECTOR = ".elidolo-display";

  const PROGRESS_SELECTOR =
    'span.block.h-full.rounded-full.bg-accent-lime';

  let observer = null;
  let startButtonObserver = null;

  let numbers = [];
  let completed = false;
  let waitingForInput = false;
  let enteringSequence = false;

  function getContainer() {
    return document.querySelector(containerSelector);
  }

  function getCards() {
    const container = getContainer();

    if (!container) return [];

    return [...container.querySelectorAll(CARD_SELECTOR)]
      .filter(card => card.querySelector(DISPLAY_SELECTOR));
  }

  function getProgressBar() {
    const container = getContainer();

    if (!container) return null;

    return container.querySelector(PROGRESS_SELECTOR);
  }

  function readCards() {
    if (completed) return;

    const cards = getCards();

    if (cards.length !== 4) return;

    cards.forEach((card, index) => {
      if (!card.classList.contains("memocarta-abierta")) return;

      const display = card.querySelector(DISPLAY_SELECTOR);

      if (!display) return;

      const value = display.textContent.trim();

      if (/^\d+$/.test(value)) {
        numbers[index] = value;

        console.log(`[Memo] Card ${index + 1}: ${value}`);
      }
    });

    if (
      numbers.length === 4 &&
      numbers.every(value => /^\d+$/.test(value))
    ) {
      completed = true;

      const sequence = numbers.join("");

      console.log(`[Memo] Complete sequence: ${sequence}`);

      waitingForInput = true;

      console.log("[Memo] Waiting for progress bar to disappear...");

      checkInputTurn();
    }
  }

  function checkInputTurn() {
    if (!waitingForInput) return;

    const progressBar = getProgressBar();

    if (progressBar) return;

    waitingForInput = false;
    enteringSequence = true;

    console.log("[Memo] Progress bar disappeared");
    console.log("[Memo] It's now our turn to input the sequence");

    pressSequence(numbers.join(""));
  }

  function pressKey(key) {
    const target = document.activeElement || document.body;

    const events = [
      new KeyboardEvent("keydown", {
        key,
        code: `Digit${key}`,
        keyCode: Number(key),
        which: Number(key),
        bubbles: true,
        cancelable: true
      }),

      new KeyboardEvent("keypress", {
        key,
        code: `Digit${key}`,
        keyCode: Number(key),
        which: Number(key),
        bubbles: true,
        cancelable: true
      }),

      new KeyboardEvent("keyup", {
        key,
        code: `Digit${key}`,
        keyCode: Number(key),
        which: Number(key),
        bubbles: true,
        cancelable: true
      })
    ];

    events.forEach(event => target.dispatchEvent(event));
  }

  function pressSequence(sequence) {
    console.log(`[Memo] Pressing sequence: ${sequence}`);

    [...sequence].forEach((number, index) => {
      setTimeout(() => {
        console.log(`[Memo] Pressing ${number}`);

        pressKey(number);

        if (index === sequence.length - 1) {
          console.log("[Memo] Sequence finished");

          enteringSequence = false;

          resetForNextRound();
        }
      }, index * 150);
    });
  }

  function resetForNextRound() {
    numbers = [];
    completed = false;
    waitingForInput = false;

    console.log("[Memo] Looking for next start button...");

    checkForStartButton();
  }

  function checkForStartButton() {
    if (enteringSequence || waitingForInput) return;

    const startButton = document.querySelector(START_SELECTOR);

    if (!startButton) return;

    console.log('[Memo] Next "Ver la seña" button found');

    startObserver();

    startButton.click();
  }

  function startObserver() {
    if (observer) return;

    numbers = [];
    completed = false;
    waitingForInput = false;

    observer = new MutationObserver(() => {
      readCards();
      checkInputTurn();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style"]
    });

    readCards();

    console.log("[Memo] Memo observer started");
  }

  // Separate observer that looks for the next start button.
  startButtonObserver = new MutationObserver(() => {
    if (!enteringSequence && !waitingForInput) {
      checkForStartButton();
    }
  });

  startButtonObserver.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });

  console.log("[Memo] Script ready");

  // Look for the first start button.
  checkForStartButton();
})();