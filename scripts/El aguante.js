(() => {
  let autoPlayInterval = null;
  let isSpacePressed = false;

  function getTranslateY(element) {
    if (!element) return null;
    const transform = element.style.transform || '';
    const match = transform.match(/translate3d\(\s*[^,]+,\s*([0-9.]+)px/);
    return match ? parseFloat(match[1]) : null;
  }

  function pressSpace() {
    if (!isSpacePressed) {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        which: 32,
        bubbles: true,
        cancelable: true
      }));
      isSpacePressed = true;
    }
  }

  function releaseSpace() {
    if (isSpacePressed) {
      document.dispatchEvent(new KeyboardEvent('keyup', {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        which: 32,
        bubbles: true,
        cancelable: true
      }));
      isSpacePressed = false;
    }
  }

  function stopAutoplay() {
    releaseSpace();
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function startAutoplay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);

    autoPlayInterval = setInterval(() => {
      // Check if the "Continue" button is present to stop the script
      const continueBtn = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent.trim().toLowerCase() === 'continue'
      );

      if (continueBtn) {
        stopAutoplay();
        return;
      }

      // Find ball via emoji text or transform style
      const ballElement = Array.from(document.querySelectorAll('div')).find(
        el => el.textContent.includes('⚽') && el.style.transform.includes('translate3d')
      );

      // Find player bar containing 'YOUR CONTROL'
      const playerElement = Array.from(document.querySelectorAll('div')).find(
        el => el.textContent.includes('YOUR CONTROL') && el.style.transform.includes('translate3d')
      );

      if (!ballElement || !playerElement) {
        return;
      }

      const ballY = getTranslateY(ballElement);
      const playerY = getTranslateY(playerElement);

      if (ballY === null || playerY === null) return;

      const playerHeight = playerElement.getBoundingClientRect().height || 66;
      const playerCenterY = playerY + (playerHeight / 2);

      if (playerCenterY > ballY) {
        pressSpace();
      } else {
        releaseSpace();
      }
    }, 16);
  }

  // Auto-click "Shield it" button if available
  const startBtn = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.toLowerCase().includes('shield it') || 
    btn.textContent.toLowerCase().includes('shield the ball')
  );

  if (startBtn) {
    startBtn.click();
    setTimeout(startAutoplay, 300);
  } else {
    startAutoplay();
  }
})();