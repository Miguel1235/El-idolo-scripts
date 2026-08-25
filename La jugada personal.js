(function () {
  let currentLane = 1;
  let movementLocked = false;
  let movementCooldownTimer = null;

  const MOVEMENT_COOLDOWN = 300;
  const THREAT_DISTANCE = 220;

  let gameStopped = false;
  let gameStarted = false;
  let watchedStartButton = null;

  function stopGame(reason) {
    if (gameStopped) {
      return;
    }

    gameStopped = true;

    clearInterval(gameLoop);

    if (movementCooldownTimer) {
      clearTimeout(movementCooldownTimer);
      movementCooldownTimer = null;
    }

    movementLocked = true;
  }

  function startGame() {
    if (gameStarted || gameStopped) {
      return;
    }

    gameStarted = true;
    currentLane = 1;
    movementLocked = false;

    if (movementCooldownTimer) {
      clearTimeout(movementCooldownTimer);
      movementCooldownTimer = null;
    }
  }

  function pressKey(direction) {
    if (gameStopped) {
      return false;
    }

    if (movementLocked) {
      return false;
    }

    let nextLane = currentLane;

    if (direction === "left") {
      nextLane--;
    } else if (direction === "right") {
      nextLane++;
    }

    // Prevent invalid lane.
    if (nextLane < 0 || nextLane > 2) {
      return false;
    }

    const key = direction === "left" ? "ArrowLeft" : "ArrowRight";

    const keyCode = direction === "left" ? 37 : 39;

    const event = new KeyboardEvent("keydown", {
      key,
      code: key,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);

    const previousLane = currentLane;

    currentLane = nextLane;

    // Lock movement.
    movementLocked = true;

    movementCooldownTimer = setTimeout(() => {
      movementLocked = false;
      movementCooldownTimer = null;
    }, MOVEMENT_COOLDOWN);

    return true;
  }

  function getShirtLane(element) {
    const leftVal = element.style.left;

    if (
      leftVal.includes("0%") &&
      !leftVal.includes("33") &&
      !leftVal.includes("66")
    ) {
      return 0;
    }

    if (leftVal.includes("33.3333%")) {
      return 1;
    }

    if (leftVal.includes("66.6667%")) {
      return 2;
    }

    return -1;
  }

  function getShirtY(element) {
    const transform = element.style.transform;

    const match = transform.match(/translate3d\([^,]+,\s*([\d.]+)px/);

    return match ? parseFloat(match[1]) : 0;
  }

  const gameLoop = setInterval(() => {
    if (gameStopped) {
      return;
    }

    if (!gameStarted) {
      const startBtn = document.querySelector(
        'button[type="button"].bg-accent-lime',
      );
      if (startBtn && startBtn !== watchedStartButton) {
        watchedStartButton = startBtn;
        startBtn.click();
        startGame();
      }

      return;
    }

    const continueBtn = document.querySelector(
      'button[type="button"].bg-accent-lime',
    );

    if (continueBtn) {
      stopGame('Detected "Continue" button — run finished.');

      return;
    }

    const playerLane = currentLane;
    const activeShirts = Array.from(
      document.querySelectorAll("div.elidolo-mueve.absolute.top-0"),
    ).filter((el) => {
      const opacity = window.getComputedStyle(el).opacity;

      const isVisible = opacity === "1" || el.style.opacity === "1";

      const yPos = getShirtY(el);

      return isVisible && yPos < 310;
    });

    if (activeShirts.length === 0) {
      return;
    }

    const laneDistances = {
      0: Infinity,
      1: Infinity,
      2: Infinity,
    };

    activeShirts.forEach((shirt, index) => {
      const lane = getShirtLane(shirt);
      const yPos = getShirtY(shirt);

      const distance = 320 - yPos;

      if (lane === -1) {
        return;
      }

      if (distance > 0 && distance < laneDistances[lane]) {
        laneDistances[lane] = distance;
      }
    });

    if (movementLocked) {
      return;
    }

    const currentLaneDistance = laneDistances[playerLane];

    if (currentLaneDistance >= THREAT_DISTANCE) {
      return;
    }

    let safestLane = playerLane;
    let safestDistance = laneDistances[playerLane];

    [0, 1, 2].forEach((lane) => {
      if (laneDistances[lane] > safestDistance) {
        safestLane = lane;
        safestDistance = laneDistances[lane];
      }
    });

    if (safestLane < playerLane) {
      pressKey("left");
    } else if (safestLane > playerLane) {
      pressKey("right");
    } else {
      if (playerLane === 0) {
        pressKey("right");
      } else if (playerLane === 1) {
        const direction =
          laneDistances[0] >= laneDistances[2] ? "left" : "right";

        pressKey(direction);
      } else if (playerLane === 2) {
        pressKey("left");
      }
    }
  }, 100);

  window.addEventListener("beforeunload", () => {
    clearInterval(gameLoop);

    if (movementCooldownTimer) {
      clearTimeout(movementCooldownTimer);
    }
  });

  window.ElIdoloMenu?.onStop?.(() => {
    stopGame("Stopped from the menu.");
  });
})();
