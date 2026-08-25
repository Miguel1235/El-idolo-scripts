(function () {
  const startButton = document.querySelector(
    'button[type="button"].bg-accent-lime',
  );
  const containerSelector = ".elidolo-escena";

  const delay = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  startButton.addEventListener("click", () => {
    requestAnimationFrame(() => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const cards = [...container.children].flatMap((child) => [
        ...child.querySelectorAll("button.memocarta"),
      ]);

      const cardPairs = Object.values(
        cards.reduce((groups, card) => {
          const text = card.textContent;
          (groups[text] ??= []).push(card);
          return groups;
        }, {}),
      ).sort(([firstA], [firstB]) =>
        firstA.textContent.localeCompare(firstB.textContent),
      );

      const observer = new MutationObserver(async (mutations, obs) => {
        const isReady = Array.from(cards).every(
          (card) => !card.hasAttribute("disabled"),
        );

        if (isReady) {
          obs.disconnect();

          for (const [firstSpan, secondSpan] of cardPairs) {
            firstSpan.click();
            await delay(100);
            secondSpan.click();
            await delay(100);
          }
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled"],
      });
    });
  });

  startButton.click();
})();
