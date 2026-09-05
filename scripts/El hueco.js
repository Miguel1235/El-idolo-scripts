(() => {
  const START_SELECTOR =
    'button[type="button"].bg-accent-lime';

  const CONTAINER_SELECTOR = ".elidolo-escena";

  let savedEmptyZone = null;
  let observer = null;
  let lastState = "";

  function getBoard() {
    const container = document.querySelector(CONTAINER_SELECTOR);

    if (!container) return null;

    const boards = [...container.querySelectorAll("div.relative.grid")];

    return boards.find(board =>
      board.querySelector('button[aria-label^="Zona "]')
    ) || null;
  }

  function getButtons(board) {
    if (!board) return [];

    return [...board.querySelectorAll('button[aria-label^="Zona "]')];
  }

  function getZoneNumber(button) {
    const label = button.getAttribute("aria-label");
    return label?.replace("Zona ", "") ?? null;
  }

  function inspectBoard() {
    const board = getBoard();

    if (!board) return;

    const buttons = getButtons(board);

    if (buttons.length === 0) return;

    const svgButtons = buttons.filter(
      button => button.querySelector("svg")
    );

    const emptyButtons = buttons.filter(
      button => !button.querySelector("svg")
    );

    const disabledButtons = buttons.filter(
      button => button.disabled
    );

    const playableButtons = buttons.filter(
      button => !button.disabled
    );

    if (
      svgButtons.length > 0 &&
      emptyButtons.length === 1
    ) {
      const emptyZone = getZoneNumber(emptyButtons[0]);

      if (savedEmptyZone !== emptyZone) {
        savedEmptyZone = emptyZone;
      }

      lastState = "shirts";
      return;
    }

    if (
      savedEmptyZone !== null &&
      playableButtons.length === buttons.length &&
      svgButtons.length === 0
    ) {
      const state = `rest-${savedEmptyZone}`;

      // Prevent clicking the same round multiple times.
      if (lastState === state) return;

      lastState = state;

      const buttonToClick = buttons.find(
        button =>
          getZoneNumber(button) === savedEmptyZone
      );

      if (buttonToClick) {
        savedEmptyZone = null;

        setTimeout(() => {
          buttonToClick.click();
        }, 50);
      }
    }
  }

  function startObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(() => {
      inspectBoard();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "class",
        "disabled"
      ]
    });
  }

  const startButton = document.querySelector(START_SELECTOR);

  if (startButton) {
    startButton.click();
  }

  startObserver();

  inspectBoard();
})();