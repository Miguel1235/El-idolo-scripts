(function () {
  const scene = document.querySelector(".elidolo-escena");

  const greenBar = scene?.querySelector(
    ".relative.h-6.overflow-hidden.rounded-full > .absolute.inset-y-0\\.5.rounded-full",
  );

  const fullBar = scene?.querySelector(
    ".relative.h-6.overflow-hidden.rounded-full",
  );

  const line = scene?.querySelector(
    ".relative.h-6.overflow-hidden.rounded-full > .absolute.inset-y-0.-ml-\\[2\\.5px\\].w-\\[5px\\].rounded-full",
  );

  const actionButton = document.querySelector('button[type="button"].bg-accent-lime');


  let lineWatcherFrame = null;
  let wasLineOnGreenBar = false;

  function getGreenBarLeftPx() {
    if (!greenBar || !fullBar) return null;

    const leftPercentage = Number.parseFloat(greenBar.style.left);
    if (Number.isNaN(leftPercentage)) return null;

    return fullBar.clientWidth * (leftPercentage / 100);
  }

  function getGreenBarWidthPx() {
    if (!greenBar || !fullBar) return null;

    const widthPercentage = Number.parseFloat(greenBar.style.width);
    if (Number.isNaN(widthPercentage)) return null;

    return fullBar.clientWidth * (widthPercentage / 100);
  }

  function getGreenBarRightPx() {
    const leftPx = getGreenBarLeftPx();
    const widthPx = getGreenBarWidthPx();

    if (leftPx === null || widthPx === null) return null;

    return leftPx + widthPx;
  }

  function getLinePositionPx() {
    if (!line) return null;

    const leftPx = Number.parseFloat(getComputedStyle(line).left);
    const transform = getComputedStyle(line).transform;

    const translateXPx =
      transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;

    return leftPx + translateXPx;
  }

  function isLineOnGreenBar() {
    const linePositionPx = getLinePositionPx();
    const greenBarLeftPx = getGreenBarLeftPx();
    const greenBarRightPx = getGreenBarRightPx();

    if (
      linePositionPx === null ||
      greenBarLeftPx === null ||
      greenBarRightPx === null
    ) {
      return false;
    }

    return (
      linePositionPx >= greenBarLeftPx && linePositionPx <= greenBarRightPx
    );
  }

  function startLineWatcher() {
    if (lineWatcherFrame !== null) return;

    const checkLinePosition = () => {
      const lineOnGreenBar = isLineOnGreenBar();

      if (lineOnGreenBar && !wasLineOnGreenBar && actionButton) {
        actionButton.click();
        stopLineWatcher();
        return;
      }

      wasLineOnGreenBar = lineOnGreenBar;
      lineWatcherFrame = requestAnimationFrame(checkLinePosition);
    };

    lineWatcherFrame = requestAnimationFrame(checkLinePosition);
  }

  function stopLineWatcher() {
    if (lineWatcherFrame === null) return;

    cancelAnimationFrame(lineWatcherFrame);
    lineWatcherFrame = null;
    wasLineOnGreenBar = false;
  }

  startLineWatcher();
})();
