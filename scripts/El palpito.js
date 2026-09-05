(() => {
  const START_SELECTOR = 'button[type="button"].bg-accent-lime';

  const CONTAINER_SELECTOR = ".elidolo-escena";
  const CHOICE_SELECTOR = "div.grid.grid-cols-2.gap-2 > button";

  function findCartas(container) {
    const fiberKey = Object.keys(container).find((key) =>
      key.startsWith("__reactFiber$"),
    );

    if (!fiberKey) return null;

    const seen = new WeakSet();

    function search(value) {
      if (!value || typeof value !== "object") return null;

      if (seen.has(value)) return null;
      seen.add(value);

      if (Array.isArray(value.cartas)) {
        return value.cartas;
      }

      for (const key of Object.keys(value)) {
        const result = search(value[key]);

        if (result) return result;
      }

      return null;
    }

    let fiber = container[fiberKey];

    while (fiber) {
      let hook = fiber.memoizedState;

      while (hook) {
        const result = search(hook.memoizedState);

        if (result) return result;

        hook = hook.next;
      }

      fiber = fiber.return;
    }

    return null;
  }

  const container = document.querySelector(CONTAINER_SELECTOR);

  if (!container) {
    return;
  }

  let index = 0;
  let isCooldown = false;

  function playRound() {
    const cartas = findCartas(container);

    if (!cartas) {
      return;
    }

    if (index >= cartas.length - 1) {
      return;
    }

    if (isCooldown) {
      return;
    }

    const buttons = [...container.querySelectorAll(CHOICE_SELECTOR)];

    if (buttons.length !== 2) {
      return;
    }

    if (buttons.some((button) => button.disabled)) {
      return;
    }

    const current = cartas[index];
    const next = cartas[index + 1];

    const higherButton = buttons.find((button) =>
      button.className.includes("amber"),
    );

    const lowerButton = buttons.find((button) =>
      button.className.includes("sky"),
    );

    if (!higherButton || !lowerButton) {
      return;
    }

    const buttonToClick = next > current ? higherButton : lowerButton;

    buttonToClick.click();

    index += 1;
    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      playRound();
    }, 500);
  }

  const observer = new MutationObserver(playRound);

  observer.observe(container, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["disabled", "class"],
  });

  const startButton = document.querySelector(START_SELECTOR);

  if (startButton) {
    startButton.click();
  }

  playRound();
})();
