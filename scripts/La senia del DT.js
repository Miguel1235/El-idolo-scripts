(function () {
  const container = document.querySelector(".elidolo-escena");

  const savedButtons = [];
  let inactivityTimer = null;

  function clickSavedButtons() {
    while (savedButtons.length > 0) {
      const button = savedButtons.shift();
      button.click();
    }
  }

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(clickSavedButtons, 1000);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style" &&
        mutation.target.matches("button")
      ) {
        const button = mutation.target;

        if (button.style.transform === "scale(1.06)") {
          if (!savedButtons.includes(button)) {
            savedButtons.push(button);
          }
        }
      }
    }

    // Any mutation (matching or not) resets the quiet-period clock
    resetInactivityTimer();
  });

  observer.observe(container, {
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });

  const startButton = document.querySelector(
    'button[type="button"].bg-accent-lime',
  );

  if (startButton) {
    startButton.click();
    resetInactivityTimer();
  }
})();
