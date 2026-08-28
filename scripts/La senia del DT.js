(function () {
  const container = document.querySelector(".elidolo-escena");

  const savedButtons = [];
  let inactivityTimer = null;

  const RESTART_SELECTOR =
    "button.elidolo-pop";

  function clickSavedButtons() {
    while (savedButtons.length > 0) {
      const button = savedButtons.shift();

      if (button.isConnected) {
        button.click();
      }
    }

    checkForRestart();
  }

  function resetInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(clickSavedButtons, 1000);
  }

  function checkForRestart() {
    const restartButton = document.querySelector(RESTART_SELECTOR);

    if (restartButton) {
      restartButton.click();

      // Start waiting for the next round.
      resetInactivityTimer();
    }
  }

  const observer = new MutationObserver((mutations) => {
    let foundMatchingButton = false;

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

          foundMatchingButton = true;
        }
      }
    }

    // Only reset the timer when we actually find a button
    // that needs to be clicked.
    if (foundMatchingButton) {
      resetInactivityTimer();
    }
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