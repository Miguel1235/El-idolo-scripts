(function () {
  let lineWatcherFrame = null;
  let isCooldown = false;

  function getElements() {
    const scene = document.querySelector(".elidolo-escena");
    if (!scene) return null;

    const fullBar = scene.querySelector(".space-y-3 > .relative");
    const greenBar = fullBar?.querySelector(
      ".absolute.inset-y-0.rounded-\\[3px\\].border-x-2",
    );
    const line = fullBar?.querySelector(
      ".absolute.inset-y-0.-ml-\\[2\\.5px\\].w-\\[5px\\].rounded",
    );

    const actionButton = [
      ...scene.querySelectorAll('button[type="button"]'),
    ].find(
      (button) =>
        button.textContent.trim() === "PARAR" ||
        button.textContent.trim() === "STOP",
    );

    if (!fullBar || !greenBar || !line || !actionButton) return null;

    return { fullBar, greenBar, line, actionButton };
  }

  function getGreenBarRange(fullBar, greenBar) {
    const leftPct = Number.parseFloat(greenBar.style.left);
    const widthPct = Number.parseFloat(greenBar.style.width);

    if (Number.isNaN(leftPct) || Number.isNaN(widthPct)) return null;

    const leftPx = fullBar.clientWidth * (leftPct / 100);
    const rightPx = leftPx + fullBar.clientWidth * (widthPct / 100);

    return { leftPx, rightPx };
  }

  function getLinePositionPx(line) {
    const leftPx = Number.parseFloat(getComputedStyle(line).left);
    const transform = getComputedStyle(line).transform;
    const translateXPx =
      transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;

    return leftPx + translateXPx;
  }

  function startLineWatcher() {
    if (lineWatcherFrame !== null) return;

    const checkLinePosition = () => {
      // Re-query dynamically to get updated dimensions and handle round transitions
      const elements = getElements();

      if (elements && !isCooldown) {
        const { fullBar, greenBar, line, actionButton } = elements;
        const range = getGreenBarRange(fullBar, greenBar);
        const linePos = getLinePositionPx(line);

        if (
          range &&
          linePos !== null &&
          linePos >= range.leftPx &&
          linePos <= range.rightPx
        ) {
          actionButton.click();

          // Pause checks briefly while the UI transition occurs
          isCooldown = true;
          setTimeout(() => {
            isCooldown = false;
          }, 1000);
        }
      }

      lineWatcherFrame = requestAnimationFrame(checkLinePosition);
    };

    lineWatcherFrame = requestAnimationFrame(checkLinePosition);
  }

  startLineWatcher();
})();
