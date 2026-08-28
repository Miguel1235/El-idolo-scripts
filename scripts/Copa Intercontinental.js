(() => {
  const el = document.querySelector(".elidolo-escena");

  if (!el) {
    console.log("Element not found");
    return;
  }

  const fiberKey = Object.keys(el).find(
    key => key.startsWith("__reactFiber$")
  );

  if (!fiberKey) {
    console.log("No React Fiber found");
    return;
  }

  const seen = new WeakSet();

  function findLayout(value) {
    if (!value || typeof value !== "object") return null;

    if (seen.has(value)) return null;
    seen.add(value);

    if (Array.isArray(value.layout)) {
      return value.layout;
    }

    for (const key of Object.keys(value)) {
      const result = findLayout(value[key]);

      if (result) return result;
    }

    return null;
  }

  let fiber = el[fiberKey];
  let layout = null;

  while (fiber && !layout) {
    let hook = fiber.memoizedState;

    while (hook && !layout) {
      layout = findLayout(hook.memoizedState);
      hook = hook.next;
    }

    fiber = fiber.return;
  }

  if (!layout) {
    console.log("Could not find layout");
    return;
  }

  console.log("layout:", layout);

  const buttons = [
    ...document.querySelectorAll(
      '.mx-auto.grid.max-w-\\[300px\\] button[aria-label="Tirar acá"]'
    )
  ];

  if (!buttons.length) {
    console.log("Grid buttons not found");
    return;
  }

  layout.forEach((value, index) => {
    if (value === true && buttons[index]) {
      buttons[index].click();
      console.log(`Clicked button ${index}`);
    }
  });
})();