(() => {
  const SCRIPTS = [{"name":"El aguante","icon":"🛡️","source":"(() => {\n  let autoPlayInterval = null;\n  let isSpacePressed = false;\n\n  function getTranslateY(element) {\n    if (!element) return null;\n    const transform = element.style.transform || '';\n    const match = transform.match(/translate3d\\(\\s*[^,]+,\\s*([0-9.]+)px/);\n    return match ? parseFloat(match[1]) : null;\n  }\n\n  function pressSpace() {\n    if (!isSpacePressed) {\n      document.dispatchEvent(new KeyboardEvent('keydown', {\n        key: ' ',\n        code: 'Space',\n        keyCode: 32,\n        which: 32,\n        bubbles: true,\n        cancelable: true\n      }));\n      isSpacePressed = true;\n    }\n  }\n\n  function releaseSpace() {\n    if (isSpacePressed) {\n      document.dispatchEvent(new KeyboardEvent('keyup', {\n        key: ' ',\n        code: 'Space',\n        keyCode: 32,\n        which: 32,\n        bubbles: true,\n        cancelable: true\n      }));\n      isSpacePressed = false;\n    }\n  }\n\n  function stopAutoplay() {\n    releaseSpace();\n    if (autoPlayInterval) {\n      clearInterval(autoPlayInterval);\n      autoPlayInterval = null;\n    }\n  }\n\n  function startAutoplay() {\n    if (autoPlayInterval) clearInterval(autoPlayInterval);\n\n    autoPlayInterval = setInterval(() => {\n      // Check if the \"Continue\" button is present to stop the script\n      const continueBtn = Array.from(document.querySelectorAll('button')).find(\n        btn => btn.textContent.trim().toLowerCase() === 'continue'\n      );\n\n      if (continueBtn) {\n        stopAutoplay();\n        return;\n      }\n\n      // Find ball via emoji text or transform style\n      const ballElement = Array.from(document.querySelectorAll('div')).find(\n        el => el.textContent.includes('⚽') && el.style.transform.includes('translate3d')\n      );\n\n      // Find player bar containing 'YOUR CONTROL'\n      const playerElement = Array.from(document.querySelectorAll('div')).find(\n        el => el.textContent.includes('YOUR CONTROL') && el.style.transform.includes('translate3d')\n      );\n\n      if (!ballElement || !playerElement) {\n        return;\n      }\n\n      const ballY = getTranslateY(ballElement);\n      const playerY = getTranslateY(playerElement);\n\n      if (ballY === null || playerY === null) return;\n\n      const playerHeight = playerElement.getBoundingClientRect().height || 66;\n      const playerCenterY = playerY + (playerHeight / 2);\n\n      if (playerCenterY > ballY) {\n        pressSpace();\n      } else {\n        releaseSpace();\n      }\n    }, 16);\n  }\n\n  // Auto-click \"Shield it\" button if available\n  const startBtn = Array.from(document.querySelectorAll('button')).find(btn => \n    btn.textContent.toLowerCase().includes('shield it') || \n    btn.textContent.toLowerCase().includes('shield the ball')\n  );\n\n  if (startBtn) {\n    startBtn.click();\n    setTimeout(startAutoplay, 300);\n  } else {\n    startAutoplay();\n  }\n})();"},{"name":"La corrida","icon":"🎯","source":"(function () {\n  const scene = document.querySelector(\".elidolo-escena\");\n\n  const greenBar = scene?.querySelector(\n    \".relative.h-6.overflow-hidden.rounded-full > .absolute.inset-y-0\\\\.5.rounded-full\",\n  );\n\n  const fullBar = scene?.querySelector(\n    \".relative.h-6.overflow-hidden.rounded-full\",\n  );\n\n  const line = scene?.querySelector(\n    \".relative.h-6.overflow-hidden.rounded-full > .absolute.inset-y-0.-ml-\\\\[2\\\\.5px\\\\].w-\\\\[5px\\\\].rounded-full\",\n  );\n\n  const actionButton = document.querySelector('button[type=\"button\"].bg-accent-lime');\n\n\n  let lineWatcherFrame = null;\n  let wasLineOnGreenBar = false;\n\n  function getGreenBarLeftPx() {\n    if (!greenBar || !fullBar) return null;\n\n    const leftPercentage = Number.parseFloat(greenBar.style.left);\n    if (Number.isNaN(leftPercentage)) return null;\n\n    return fullBar.clientWidth * (leftPercentage / 100);\n  }\n\n  function getGreenBarWidthPx() {\n    if (!greenBar || !fullBar) return null;\n\n    const widthPercentage = Number.parseFloat(greenBar.style.width);\n    if (Number.isNaN(widthPercentage)) return null;\n\n    return fullBar.clientWidth * (widthPercentage / 100);\n  }\n\n  function getGreenBarRightPx() {\n    const leftPx = getGreenBarLeftPx();\n    const widthPx = getGreenBarWidthPx();\n\n    if (leftPx === null || widthPx === null) return null;\n\n    return leftPx + widthPx;\n  }\n\n  function getLinePositionPx() {\n    if (!line) return null;\n\n    const leftPx = Number.parseFloat(getComputedStyle(line).left);\n    const transform = getComputedStyle(line).transform;\n\n    const translateXPx =\n      transform === \"none\" ? 0 : new DOMMatrixReadOnly(transform).m41;\n\n    return leftPx + translateXPx;\n  }\n\n  function isLineOnGreenBar() {\n    const linePositionPx = getLinePositionPx();\n    const greenBarLeftPx = getGreenBarLeftPx();\n    const greenBarRightPx = getGreenBarRightPx();\n\n    if (\n      linePositionPx === null ||\n      greenBarLeftPx === null ||\n      greenBarRightPx === null\n    ) {\n      return false;\n    }\n\n    return (\n      linePositionPx >= greenBarLeftPx && linePositionPx <= greenBarRightPx\n    );\n  }\n\n  function startLineWatcher() {\n    if (lineWatcherFrame !== null) return;\n\n    const checkLinePosition = () => {\n      const lineOnGreenBar = isLineOnGreenBar();\n\n      if (lineOnGreenBar && !wasLineOnGreenBar && actionButton) {\n        actionButton.click();\n        stopLineWatcher();\n        return;\n      }\n\n      wasLineOnGreenBar = lineOnGreenBar;\n      lineWatcherFrame = requestAnimationFrame(checkLinePosition);\n    };\n\n    lineWatcherFrame = requestAnimationFrame(checkLinePosition);\n  }\n\n  function stopLineWatcher() {\n    if (lineWatcherFrame === null) return;\n\n    cancelAnimationFrame(lineWatcherFrame);\n    lineWatcherFrame = null;\n    wasLineOnGreenBar = false;\n  }\n\n  startLineWatcher();\n})();\n"},{"name":"La definicion al arquero","icon":"🥅","source":"(() => {\n    const SHOOT_INTERVAL = 500; // milliseconds between shots\n    const CONTAINER_SELECTOR = 'div.relative.w-full.overflow-hidden.rounded-t-lg';\n    const KEEPER_SELECTOR = '.elidolo-mueve svg';\n\n    let running = true;\n    let timeoutId = null;\n\n    function getGameContainer() {\n        return document.querySelector(CONTAINER_SELECTOR);\n    }\n\n    function getKeeper(container) {\n        return [...container.querySelectorAll('.elidolo-mueve')]\n            .find(el => el.querySelector('svg'));\n    }\n\n    function getShootingButtons(container) {\n        return [...container.querySelectorAll('button[aria-label^=\"Patear \"]')];\n    }\n\n    function getKeeperCenterX(container) {\n        const keeper = getKeeper(container);\n\n        if (!keeper) {\n            return null;\n        }\n\n        const keeperRect = keeper.getBoundingClientRect();\n        const containerRect = container.getBoundingClientRect();\n\n        return (\n            (keeperRect.left + keeperRect.width / 2 - containerRect.left)\n            / containerRect.width\n        );\n    }\n\n    function getButtonCenter(button, container) {\n        const buttonRect = button.getBoundingClientRect();\n        const containerRect = container.getBoundingClientRect();\n\n        return (\n            (buttonRect.left + buttonRect.width / 2 - containerRect.left)\n            / containerRect.width\n        );\n    }\n\n    function findBestButton(container) {\n        const keeperX = getKeeperCenterX(container);\n        const buttons = getShootingButtons(container);\n\n        if (keeperX === null || buttons.length === 0) {\n            return null;\n        }\n\n        let bestButton = null;\n        let bestDistance = -Infinity;\n\n        for (const button of buttons) {\n            const buttonX = getButtonCenter(button, container);\n            const distance = Math.abs(buttonX - keeperX);\n\n            if (distance > bestDistance) {\n                bestDistance = distance;\n                bestButton = button;\n            }\n        }\n\n        return bestButton;\n    }\n\n    function shoot() {\n        if (!running) {\n            return;\n        }\n\n        const container = getGameContainer();\n\n        if (!container) {\n            timeoutId = setTimeout(shoot, 1000);\n            return;\n        }\n\n        const button = findBestButton(container);\n\n        if (!button) {\n            timeoutId = setTimeout(shoot, 1000);\n            return;\n        }\n   \n\n        button.click();\n\n        timeoutId = setTimeout(shoot, SHOOT_INTERVAL);\n    }\n\n    // Expose a stop function.\n    window.stopAutoShooter = () => {\n        running = false;\n\n        if (timeoutId) {\n            clearTimeout(timeoutId);\n        }\n\n    };\n\n    shoot();\n})();"},{"name":"La definicion al limite","icon":"📊","source":"(function () {\n  let lineWatcherFrame = null;\n  let isCooldown = false;\n\n  function getElements() {\n    const scene = document.querySelector(\".elidolo-escena\");\n    if (!scene) return null;\n\n    const fullBar = scene.querySelector(\".space-y-3 > .relative\");\n    const greenBar = fullBar?.querySelector(\n      \".absolute.inset-y-0.rounded-\\\\[3px\\\\].border-x-2\",\n    );\n    const line = fullBar?.querySelector(\n      \".absolute.inset-y-0.-ml-\\\\[2\\\\.5px\\\\].w-\\\\[5px\\\\].rounded\",\n    );\n\n    const actionButton = [\n      ...scene.querySelectorAll('button[type=\"button\"]'),\n    ].find(\n      (button) =>\n        button.textContent.trim() === \"PARAR\" ||\n        button.textContent.trim() === \"STOP\",\n    );\n\n    if (!fullBar || !greenBar || !line || !actionButton) return null;\n\n    return { fullBar, greenBar, line, actionButton };\n  }\n\n  function getGreenBarRange(fullBar, greenBar) {\n    const leftPct = Number.parseFloat(greenBar.style.left);\n    const widthPct = Number.parseFloat(greenBar.style.width);\n\n    if (Number.isNaN(leftPct) || Number.isNaN(widthPct)) return null;\n\n    const leftPx = fullBar.clientWidth * (leftPct / 100);\n    const rightPx = leftPx + fullBar.clientWidth * (widthPct / 100);\n\n    return { leftPx, rightPx };\n  }\n\n  function getLinePositionPx(line) {\n    const leftPx = Number.parseFloat(getComputedStyle(line).left);\n    const transform = getComputedStyle(line).transform;\n    const translateXPx =\n      transform === \"none\" ? 0 : new DOMMatrixReadOnly(transform).m41;\n\n    return leftPx + translateXPx;\n  }\n\n  function startLineWatcher() {\n    if (lineWatcherFrame !== null) return;\n\n    const checkLinePosition = () => {\n      // Re-query dynamically to get updated dimensions and handle round transitions\n      const elements = getElements();\n\n      if (elements && !isCooldown) {\n        const { fullBar, greenBar, line, actionButton } = elements;\n        const range = getGreenBarRange(fullBar, greenBar);\n        const linePos = getLinePositionPx(line);\n\n        if (\n          range &&\n          linePos !== null &&\n          linePos >= range.leftPx &&\n          linePos <= range.rightPx\n        ) {\n          actionButton.click();\n\n          // Pause checks briefly while the UI transition occurs\n          isCooldown = true;\n          setTimeout(() => {\n            isCooldown = false;\n          }, 1000);\n        }\n      }\n\n      lineWatcherFrame = requestAnimationFrame(checkLinePosition);\n    };\n\n    lineWatcherFrame = requestAnimationFrame(checkLinePosition);\n  }\n\n  startLineWatcher();\n})();\n"},{"name":"La jugada personal","icon":"🏃","source":"(function () {\n  let currentLane = 1;\n  let movementLocked = false;\n  let movementCooldownTimer = null;\n\n  const MOVEMENT_COOLDOWN = 300;\n  const THREAT_DISTANCE = 220;\n\n  let gameStopped = false;\n  let gameStarted = false;\n  let watchedStartButton = null;\n\n  function stopGame(reason) {\n    if (gameStopped) {\n      return;\n    }\n\n    gameStopped = true;\n\n    clearInterval(gameLoop);\n\n    if (movementCooldownTimer) {\n      clearTimeout(movementCooldownTimer);\n      movementCooldownTimer = null;\n    }\n\n    movementLocked = true;\n  }\n\n  function startGame() {\n    if (gameStarted || gameStopped) {\n      return;\n    }\n\n    gameStarted = true;\n    currentLane = 1;\n    movementLocked = false;\n\n    if (movementCooldownTimer) {\n      clearTimeout(movementCooldownTimer);\n      movementCooldownTimer = null;\n    }\n  }\n\n  function pressKey(direction) {\n    if (gameStopped) {\n      return false;\n    }\n\n    if (movementLocked) {\n      return false;\n    }\n\n    let nextLane = currentLane;\n\n    if (direction === \"left\") {\n      nextLane--;\n    } else if (direction === \"right\") {\n      nextLane++;\n    }\n\n    // Prevent invalid lane.\n    if (nextLane < 0 || nextLane > 2) {\n      return false;\n    }\n\n    const key = direction === \"left\" ? \"ArrowLeft\" : \"ArrowRight\";\n\n    const keyCode = direction === \"left\" ? 37 : 39;\n\n    const event = new KeyboardEvent(\"keydown\", {\n      key,\n      code: key,\n      keyCode,\n      which: keyCode,\n      bubbles: true,\n      cancelable: true,\n    });\n\n    document.dispatchEvent(event);\n\n    const previousLane = currentLane;\n\n    currentLane = nextLane;\n\n    // Lock movement.\n    movementLocked = true;\n\n    movementCooldownTimer = setTimeout(() => {\n      movementLocked = false;\n      movementCooldownTimer = null;\n    }, MOVEMENT_COOLDOWN);\n\n    return true;\n  }\n\n  function getShirtLane(element) {\n    const leftVal = element.style.left;\n\n    if (\n      leftVal.includes(\"0%\") &&\n      !leftVal.includes(\"33\") &&\n      !leftVal.includes(\"66\")\n    ) {\n      return 0;\n    }\n\n    if (leftVal.includes(\"33.3333%\")) {\n      return 1;\n    }\n\n    if (leftVal.includes(\"66.6667%\")) {\n      return 2;\n    }\n\n    return -1;\n  }\n\n  function getShirtY(element) {\n    const transform = element.style.transform;\n\n    const match = transform.match(/translate3d\\([^,]+,\\s*([\\d.]+)px/);\n\n    return match ? parseFloat(match[1]) : 0;\n  }\n\n  const gameLoop = setInterval(() => {\n    if (gameStopped) {\n      return;\n    }\n\n    if (!gameStarted) {\n      const startBtn = document.querySelector(\n        'button[type=\"button\"].bg-accent-lime',\n      );\n      if (startBtn && startBtn !== watchedStartButton) {\n        watchedStartButton = startBtn;\n        startBtn.click();\n        startGame();\n      }\n\n      return;\n    }\n\n    const continueBtn = document.querySelector(\n      'button[type=\"button\"].bg-accent-lime',\n    );\n\n    if (continueBtn) {\n      stopGame('Detected \"Continue\" button — run finished.');\n\n      return;\n    }\n\n    const playerLane = currentLane;\n    const activeShirts = Array.from(\n      document.querySelectorAll(\"div.elidolo-mueve.absolute.top-0\"),\n    ).filter((el) => {\n      const opacity = window.getComputedStyle(el).opacity;\n\n      const isVisible = opacity === \"1\" || el.style.opacity === \"1\";\n\n      const yPos = getShirtY(el);\n\n      return isVisible && yPos < 310;\n    });\n\n    if (activeShirts.length === 0) {\n      return;\n    }\n\n    const laneDistances = {\n      0: Infinity,\n      1: Infinity,\n      2: Infinity,\n    };\n\n    activeShirts.forEach((shirt, index) => {\n      const lane = getShirtLane(shirt);\n      const yPos = getShirtY(shirt);\n\n      const distance = 320 - yPos;\n\n      if (lane === -1) {\n        return;\n      }\n\n      if (distance > 0 && distance < laneDistances[lane]) {\n        laneDistances[lane] = distance;\n      }\n    });\n\n    if (movementLocked) {\n      return;\n    }\n\n    const currentLaneDistance = laneDistances[playerLane];\n\n    if (currentLaneDistance >= THREAT_DISTANCE) {\n      return;\n    }\n\n    let safestLane = playerLane;\n    let safestDistance = laneDistances[playerLane];\n\n    [0, 1, 2].forEach((lane) => {\n      if (laneDistances[lane] > safestDistance) {\n        safestLane = lane;\n        safestDistance = laneDistances[lane];\n      }\n    });\n\n    if (safestLane < playerLane) {\n      pressKey(\"left\");\n    } else if (safestLane > playerLane) {\n      pressKey(\"right\");\n    } else {\n      if (playerLane === 0) {\n        pressKey(\"right\");\n      } else if (playerLane === 1) {\n        const direction =\n          laneDistances[0] >= laneDistances[2] ? \"left\" : \"right\";\n\n        pressKey(direction);\n      } else if (playerLane === 2) {\n        pressKey(\"left\");\n      }\n    }\n  }, 100);\n\n  window.addEventListener(\"beforeunload\", () => {\n    clearInterval(gameLoop);\n\n    if (movementCooldownTimer) {\n      clearTimeout(movementCooldownTimer);\n    }\n  });\n\n  window.ElIdoloMenu?.onStop?.(() => {\n    stopGame(\"Stopped from the menu.\");\n  });\n})();\n"},{"name":"La pizarra del DT","icon":"📋","source":"(function () {\n  const startButton = document.querySelector(\n    'button[type=\"button\"].bg-accent-lime',\n  );\n  const containerSelector = \".elidolo-escena\";\n\n  const delay = (milliseconds) =>\n    new Promise((resolve) => setTimeout(resolve, milliseconds));\n\n  startButton.addEventListener(\"click\", () => {\n    requestAnimationFrame(() => {\n      const container = document.querySelector(containerSelector);\n      if (!container) return;\n\n      const cards = [...container.children].flatMap((child) => [\n        ...child.querySelectorAll(\"button.memocarta\"),\n      ]);\n\n      const cardPairs = Object.values(\n        cards.reduce((groups, card) => {\n          const text = card.textContent;\n          (groups[text] ??= []).push(card);\n          return groups;\n        }, {}),\n      ).sort(([firstA], [firstB]) =>\n        firstA.textContent.localeCompare(firstB.textContent),\n      );\n\n      const observer = new MutationObserver(async (mutations, obs) => {\n        const isReady = Array.from(cards).every(\n          (card) => !card.hasAttribute(\"disabled\"),\n        );\n\n        if (isReady) {\n          obs.disconnect();\n\n          for (const [firstSpan, secondSpan] of cardPairs) {\n            firstSpan.click();\n            await delay(100);\n            secondSpan.click();\n            await delay(100);\n          }\n        }\n      });\n\n      observer.observe(container, {\n        childList: true,\n        subtree: true,\n        attributes: true,\n        attributeFilter: [\"disabled\"],\n      });\n    });\n  });\n\n  startButton.click();\n})();\n"},{"name":"La senia del DT","icon":"👁️","source":"(function () {\n  const container = document.querySelector(\".elidolo-escena\");\n\n  const savedButtons = [];\n  let inactivityTimer = null;\n\n  function clickSavedButtons() {\n    while (savedButtons.length > 0) {\n      const button = savedButtons.shift();\n      button.click();\n    }\n  }\n\n  function resetInactivityTimer() {\n    if (inactivityTimer) clearTimeout(inactivityTimer);\n    inactivityTimer = setTimeout(clickSavedButtons, 1000);\n  }\n\n  const observer = new MutationObserver((mutations) => {\n    for (const mutation of mutations) {\n      if (\n        mutation.type === \"attributes\" &&\n        mutation.attributeName === \"style\" &&\n        mutation.target.matches(\"button\")\n      ) {\n        const button = mutation.target;\n\n        if (button.style.transform === \"scale(1.06)\") {\n          if (!savedButtons.includes(button)) {\n            savedButtons.push(button);\n          }\n        }\n      }\n    }\n\n    // Any mutation (matching or not) resets the quiet-period clock\n    resetInactivityTimer();\n  });\n\n  observer.observe(container, {\n    subtree: true,\n    attributes: true,\n    attributeFilter: [\"style\"],\n  });\n\n  const startButton = document.querySelector(\n    'button[type=\"button\"].bg-accent-lime',\n  );\n\n  if (startButton) {\n    startButton.click();\n    resetInactivityTimer();\n  }\n})();\n"},{"name":"Los alcanzapelotas","icon":"👕","source":"(async function() {\n  const sleep = ms => new Promise(r => setTimeout(r, ms));\n\n  const startBtn = document.querySelector('button[type=\"button\"].bg-accent-lime');\n  if (!startBtn) return;\n\n  startBtn.click();\n\n  const percentToIndex = (leftStr) => {\n    const val = parseFloat(leftStr);\n    if (isNaN(val)) return -1;\n    if (val <= 5) return 0;\n    if (val <= 30) return 1;\n    if (val <= 55) return 2;\n    return 3;\n  };\n\n  const scene = document.querySelector(\".elidolo-escena\");\n  const grid = scene.querySelector('.grid.grid-cols-4');\n  const buttons = grid ? Array.from(grid.querySelectorAll('button')) : [];\n\n  if (!buttons.length) {\n    console.log('No shirt buttons found');\n    return;\n  }\n\n  // Helper to check for visible ball based on class name\n  const findBallIndex = () => {\n    return buttons.findIndex(btn => {\n      const ballSpan = btn.querySelector('span');\n      return ballSpan && ballSpan.classList.contains('opacity-100');\n    });\n  };\n\n  // 2. DETECT INITIAL BALL POSITION (Mutation-driven instead of polling)\n  let currentBallPos = findBallIndex();\n\n    if (currentBallPos === -1) {\n    console.log('Waiting for initial ball position...');\n\n    currentBallPos = await new Promise((resolve) => {\n      const initialObserver = new MutationObserver(() => {\n        const index = findBallIndex();\n\n        if (index !== -1) {\n          initialObserver.disconnect();\n\n          console.log(\n            `Initial Ball detected at Position #${index + 1}`\n          );\n\n          resolve(index);\n        }\n      });\n\n      if (grid) {\n        initialObserver.observe(grid, {\n          attributes: true,\n          attributeFilter: ['class'],\n          subtree: true\n        });\n      }\n    });\n  } else {\n    console.log(\n      `Initial Ball detected at Position #${currentBallPos + 1}`\n    );\n  }\n\n  const activeSwaps = new Set();\n\n  const observer = new MutationObserver(() => {\n    const activeElements = Array.from(document.querySelectorAll('.elidolo-mueve'));\n\n    const greenElements = activeElements.filter(el => {\n      const html = el.innerHTML;\n      return html.includes('trileCasacaLime') || html.includes('rgba(34,231,75');\n    });\n\n    if (greenElements.length === 2) {\n      const swappedPositions = greenElements\n        .map(el => percentToIndex(el.style.left))\n        .filter(pos => pos !== -1)\n        .sort((a, b) => a - b);\n\n      if (swappedPositions.length === 2) {\n        const pairKey = swappedPositions.join('-');\n\n        if (!activeSwaps.has(pairKey)) {\n          activeSwaps.add(pairKey);\n          const [posA, posB] = swappedPositions;\n\n          if (currentBallPos === posA) {\n            currentBallPos = posB;\n            console.log(`Swap! Ball moved: #${posA + 1} ➔ #${posB + 1}`);\n          } else if (currentBallPos === posB) {\n            currentBallPos = posA;\n            console.log(`Swap! Ball moved: #${posB + 1} ➔ #${posA + 1}`);\n          }\n\n          setTimeout(() => activeSwaps.delete(pairKey), 300);\n        }\n      }\n    }\n  });\n\n  observer.observe(document.body, { \n    childList: true, \n    subtree: true, \n    attributes: true, \n    attributeFilter: ['style', 'class'] \n  });\n\n  await sleep(6000);\n\n  observer.disconnect();\n  console.log(`Final Result: Ball ended at Position #${currentBallPos + 1}`);\n\n  // 6. CLICK THE WINNING SHIRT BUTTON\n  if (buttons[currentBallPos]) {\n    buttons[currentBallPos].disabled = false;\n    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {\n      buttons[currentBallPos].dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));\n    });\n  }\n})();"},{"name":"Ta-te-ti","icon":"❌⭕","source":"(() => {\n  window.line4Bot?.stop?.();\n\n  const SIZE = 5;\n  const WIN_LENGTH = 4;\n  const ME = \"X\";\n  const THEM = \"O\";\n  const GRID_SELECTOR =\n    \".elidolo-escena .mx-auto.grid.w-full.max-w-\\\\[300px\\\\].gap-1\\\\.5\";\n\n  // Every possible horizontal, vertical, and diagonal group of four cells.\n  const WIN_LINES = [];\n  for (const [rowStep, columnStep] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {\n    for (let row = 0; row < SIZE; row += 1) {\n      for (let column = 0; column < SIZE; column += 1) {\n        const endRow = row + (WIN_LENGTH - 1) * rowStep;\n        const endColumn = column + (WIN_LENGTH - 1) * columnStep;\n        if (endRow < 0 || endRow >= SIZE || endColumn < 0 || endColumn >= SIZE) continue;\n\n        WIN_LINES.push(\n          Array.from({ length: WIN_LENGTH }, (_, offset) =>\n            (row + offset * rowStep) * SIZE + column + offset * columnStep,\n          ),\n        );\n      }\n    }\n  }\n\n  let pending = false;\n  let lastPlayedPosition = null;\n\n  function getGrid() {\n    return document.querySelector(GRID_SELECTOR);\n  }\n\n  function getButtons() {\n    const buttons = [...(getGrid()?.querySelectorAll(':scope > button[type=\"button\"]') ?? [])];\n    return buttons.length === SIZE * SIZE ? buttons : null;\n  }\n\n  function markOf(button) {\n    const mark = button.textContent.trim();\n    if (mark === \"✖\" || mark === \"X\") return ME;\n    if (mark === \"◯\" || mark === \"O\") return THEM;\n    return null;\n  }\n\n  function readBoard(buttons) {\n    return buttons.map(markOf);\n  }\n\n  function emptySquares(board) {\n    return board.flatMap((mark, index) => (mark === null ? [index] : []));\n  }\n\n  function hasWon(board, player) {\n    return WIN_LINES.some((line) => line.every((square) => board[square] === player));\n  }\n\n  function centerWeight(index) {\n    const row = Math.floor(index / SIZE);\n    const column = index % SIZE;\n    // Prefer central squares when all tactical choices are equal.\n    return 4 - Math.abs(row - 2) - Math.abs(column - 2);\n  }\n\n  function evaluate(board) {\n    if (hasWon(board, ME)) return 100000;\n    if (hasWon(board, THEM)) return -100000;\n\n    let score = 0;\n    for (const line of WIN_LINES) {\n      const mine = line.filter((square) => board[square] === ME).length;\n      const theirs = line.filter((square) => board[square] === THEM).length;\n      if (mine && theirs) continue;\n      if (mine) score += [0, 3, 20, 250, 0][mine];\n      if (theirs) score -= [0, 4, 28, 350, 0][theirs];\n    }\n\n    return score + board.reduce(\n      (total, mark, index) => total + (mark === ME ? centerWeight(index) : mark === THEM ? -centerWeight(index) : 0),\n      0,\n    );\n  }\n\n  function orderedMoves(board) {\n    return emptySquares(board).sort((left, right) => centerWeight(right) - centerWeight(left));\n  }\n\n  function minimax(board, depth, maximizing, alpha, beta) {\n    const score = evaluate(board);\n    if (depth === 0 || Math.abs(score) >= 100000) return score;\n\n    const player = maximizing ? ME : THEM;\n    let best = maximizing ? -Infinity : Infinity;\n    for (const move of orderedMoves(board)) {\n      board[move] = player;\n      const nextScore = minimax(board, depth - 1, !maximizing, alpha, beta);\n      board[move] = null;\n\n      if (maximizing) {\n        best = Math.max(best, nextScore);\n        alpha = Math.max(alpha, best);\n      } else {\n        best = Math.min(best, nextScore);\n        beta = Math.min(beta, best);\n      }\n      if (beta <= alpha) break;\n    }\n    return best;\n  }\n\n  function bestMove(board) {\n    const moves = orderedMoves(board);\n\n    for (const move of moves) {\n      board[move] = ME;\n      const wins = hasWon(board, ME);\n      board[move] = null;\n      if (wins) return move;\n    }\n\n    const threats = moves.filter((move) => {\n      board[move] = THEM;\n      const wins = hasWon(board, THEM);\n      board[move] = null;\n      return wins;\n    });\n    if (threats.length === 1) return threats[0];\n\n    let selected = moves[0];\n    let bestScore = -Infinity;\n    for (const move of moves) {\n      board[move] = ME;\n      const score = minimax(board, 3, false, -Infinity, Infinity);\n      board[move] = null;\n      if (score > bestScore) {\n        bestScore = score;\n        selected = move;\n      }\n    }\n    return selected;\n  }\n\n  function play() {\n    pending = false;\n    const buttons = getButtons();\n    if (!buttons) return;\n\n    const board = readBoard(buttons);\n    const signature = board.map((mark) => mark ?? \"-\").join(\"\");\n    if (signature === lastPlayedPosition || hasWon(board, ME) || hasWon(board, THEM)) return;\n\n    const move = bestMove(board);\n    const button = buttons[move];\n    if (!button || button.disabled || markOf(button) !== null) return;\n\n    lastPlayedPosition = signature;\n    button.click();\n  }\n\n  function schedulePlay() {\n    if (pending) return;\n    pending = true;\n    requestAnimationFrame(play);\n  }\n\n  const observer = new MutationObserver(schedulePlay);\n  observer.observe(document.body, {\n    subtree: true,\n    childList: true,\n    characterData: true,\n    attributes: true,\n    attributeFilter: [\"disabled\", \"class\"],\n  });\n\n  window.line4Bot = {\n    stop() {\n      observer.disconnect();\n      delete window.line4Bot;\n    },\n  };\n\n  schedulePlay();\n})();\n"}];
  const EXISTING_ID = "el-idolo-script-menu";

  document.getElementById(EXISTING_ID)?.remove();

  const root = document.createElement("div");
  root.id = EXISTING_ID;

  root.style.cssText =
    "position:fixed;right:20px;bottom:20px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  const shadow = root.attachShadow({ mode: "open" });

  shadow.innerHTML = `<style>
    * {
      box-sizing: border-box;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    .launcher {
      width: 58px;
      height: 58px;
      border: 2px solid #d9ffe0;
      border-radius: 50%;
      background: #08733b;
      color: #fff;
      font-size: 31px;
      line-height: 1;
      box-shadow:
        0 0 0 4px #0c6d36,
        0 12px 27px #001b0db3;
      transition:
        transform .2s,
        background .2s,
        box-shadow .2s;
    }

    .launcher:hover {
      background: #10914c;
      transform: translateY(-3px) scale(1.07);
      box-shadow:
        0 0 0 4px #26b85d,
        0 16px 30px #001b0dcc;
    }

    .panel {
      position: absolute;
      right: 0;
      bottom: 78px;
      width: 318px;
      max-height: min(560px, calc(100vh - 118px));
      overflow: auto;
      border: 2px solid #8ce69f;
      border-radius: 19px;
      background:
        repeating-linear-gradient(
          90deg,
          #08733b 0 42px,
          #0a7c40 42px 84px
        );
      color: #fff;
      box-shadow: 0 20px 56px #001d0fc7;
      padding: 12px;
      transform: translateY(9px) scale(.97);
      opacity: 0;
      pointer-events: none;
      transition: .2s;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 7px;
      border: 1px solid #d7ffdc80;
      border-radius: 12px;
      pointer-events: none;
    }

    .panel.open {
      transform: none;
      opacity: 1;
      pointer-events: auto;
    }

    .title {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 1px 2px 11px;
      padding: 9px 10px;
      border: 1px solid #d9ffdf96;
      border-radius: 10px;
      background: #003d22b8;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: .2px;
      text-transform: uppercase;
    }

    .title::after {
      content: "MATCH DAY";
      margin-left: auto;
      color: #d8f8a2;
      font-size: 9px;
      letter-spacing: 1px;
    }

    .hint {
      display: none;
    }

    .script {
      position: relative;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 10px 7px;
      border-top: 1px solid #e8ffe833;
      background: #003d1d4d;
    }

    .script:first-child {
      border-top: 0;
    }

    .script:hover {
      background: #003a1fcc;
    }

    .name {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      font-weight: 750;
      line-height: 1.25;
    }

    .state {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      color: #d7ffe0;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: .7px;
    }

    .state::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #b7cfbc;
      box-shadow: 0 0 0 2px #003d22;
    }

    .toggle {
      border: 1px solid #cbffdc;
      border-radius: 8px;
      min-width: 64px;
      padding: 7px 8px;
      background: #f2fff4;
      color: #075b30;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .35px;
      text-transform: uppercase;
      box-shadow: 0 2px 0 #075b30;
    }

    .toggle:hover {
      background: #d2ffd8;
    }

    .toggle.running {
      border-color: #ffd1d1;
      background: #be2634;
      color: #fff;
      box-shadow: 0 2px 0 #65131c;
    }

    .script:has(.toggle.running) .state::before {
      background: #baff59;
      box-shadow: 0 0 8px #baff59;
    }

    .stop-all {
      position: relative;
      width: 100%;
      border: 1px solid #fff8bc;
      border-radius: 8px;
      background: #173b27;
      color: #fff8bd;
      padding: 9px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .65px;
      text-transform: uppercase;
      margin-top: 11px;
    }

    .stop-all:hover {
      background: #274e34;
    }
  </style>

  <button
    class="launcher"
    type="button"
    aria-label="Open El Ídolo scripts"
    aria-expanded="false"
  >⚽</button>

  <section class="panel" aria-label="El Ídolo scripts">
    <div class="title">
      ⚽ El Ídolo
      <span class="hint">script controls</span>
    </div>

    <div class="list"></div>

    <button class="stop-all" type="button">
      Stop all scripts
    </button>
  </section>`;

  const panel = shadow.querySelector(".panel");
  const launcher = shadow.querySelector(".launcher");
  const list = shadow.querySelector(".list");

  const active = new Map();

  let startingResources = null;

  function resources() {
    return {
      timeouts: new Set(),
      intervals: new Set(),
      frames: new Set(),
      observers: new Set(),
      listeners: [],
      cleanups: [],
    };
  }

  function stop(name) {
    const item = active.get(name);

    if (!item) return;

    for (const cleanup of item.resources.cleanups) {
      try {
        cleanup();
      } catch (error) {
        console.warn(
          `[El Ídolo] Cleanup failed for ${name}`,
          error
        );
      }
    }

    for (const id of item.resources.timeouts) {
      clearTimeout(id);
    }

    for (const id of item.resources.intervals) {
      clearInterval(id);
    }

    for (const id of item.resources.frames) {
      cancelAnimationFrame(id);
    }

    for (const observer of item.resources.observers) {
      observer.disconnect();
    }

    for (const [
      target,
      type,
      listener,
      options,
    ] of item.resources.listeners) {
      target.removeEventListener(
        type,
        listener,
        options
      );
    }

    active.delete(name);

    item.button.classList.remove("running");
    item.button.textContent = "Start";
    item.state.textContent = "Stopped";
  }

  function start(script, button, state) {
    stop(script.name);

    const tracked = resources();

    const nativeAdd =
      EventTarget.prototype.addEventListener;

    const nativeRemove =
      EventTarget.prototype.removeEventListener;

    const add = function (type, listener, options) {
      tracked.listeners.push([
        this,
        type,
        listener,
        options,
      ]);

      return nativeAdd.call(
        this,
        type,
        listener,
        options
      );
    };

    const makeTimer = (native, set) =>
      (callback, delay, ...args) => {
        const id = native(
          callback,
          delay,
          ...args
        );

        set.add(id);

        return id;
      };

    class TrackedMutationObserver
      extends MutationObserver {
      constructor(callback) {
        super(callback);
        tracked.observers.add(this);
      }
    }

    EventTarget.prototype.addEventListener = add;

    startingResources = tracked;

    try {
      const run = new Function(
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "MutationObserver",
        script.source
      );

      run(
        makeTimer(
          window.setTimeout.bind(window),
          tracked.timeouts
        ),
        window.clearTimeout.bind(window),
        makeTimer(
          window.setInterval.bind(window),
          tracked.intervals
        ),
        window.clearInterval.bind(window),
        makeTimer(
          window.requestAnimationFrame.bind(window),
          tracked.frames
        ),
        window.cancelAnimationFrame.bind(window),
        TrackedMutationObserver
      );
    } catch (error) {
      console.error(
        `[El Ídolo] Could not start ${script.name}`,
        error
      );

      for (const observer of tracked.observers) {
        observer.disconnect();
      }

      for (const [
        target,
        type,
        listener,
        options,
      ] of tracked.listeners) {
        target.removeEventListener(
          type,
          listener,
          options
        );
      }

      state.textContent =
        "Could not start — see console";

      return;
    } finally {
      startingResources = null;

      EventTarget.prototype.addEventListener =
        nativeAdd;
    }

    active.set(script.name, {
      resources: tracked,
      button,
      state,
    });

    button.classList.add("running");
    button.textContent = "Stop";
    state.textContent = "Running";
  }

  for (const script of SCRIPTS) {
    const row = document.createElement("div");
    row.className = "script";

    const copy = document.createElement("div");
    copy.className = "name";

    // Emoji + script name
    copy.textContent = `${script.icon ?? "⚽"} ${script.name}`;

    const state = document.createElement("div");
    state.className = "state";
    state.textContent = "Stopped";

    copy.append(state);

    const button = document.createElement("button");
    button.className = "toggle";
    button.type = "button";
    button.textContent = "Start";

    button.addEventListener("click", () => {
      active.has(script.name)
        ? stop(script.name)
        : start(script, button, state);
    });

    row.append(copy, button);
    list.append(row);
  }

  launcher.addEventListener("click", () => {
    const open = panel.classList.toggle("open");

    launcher.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  shadow
    .querySelector(".stop-all")
    .addEventListener("click", () => {
      [...active.keys()].forEach(stop);
    });

  document.documentElement.append(root);

  window.ElIdoloMenu = {
    start: (name) => {
      const script = SCRIPTS.find(
        (entry) => entry.name === name
      );

      const item = [
        ...shadow.querySelectorAll(".script"),
      ].find(
        (row) =>
          row
            .querySelector(".name")
            .childNodes[0]
            .textContent
            .trim()
            .endsWith(name)
      );

      if (
        script &&
        item &&
        !active.has(name)
      ) {
        start(
          script,
          item.querySelector("button"),
          item.querySelector(".state")
        );
      }
    },

    stop,

    stopAll: () => {
      [...active.keys()].forEach(stop);
    },

    onStop: (cleanup) => {
      if (
        startingResources &&
        typeof cleanup === "function"
      ) {
        startingResources.cleanups.push(cleanup);
      }
    },

    remove: () => {
      [...active.keys()].forEach(stop);

      root.remove();

      delete window.ElIdoloMenu;
    },
  };
})();
