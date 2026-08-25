(() => {
    const SHOOT_INTERVAL = 500; // milliseconds between shots
    const CONTAINER_SELECTOR = 'div.relative.w-full.overflow-hidden.rounded-t-lg';
    const KEEPER_SELECTOR = '.elidolo-mueve svg';

    let running = true;
    let timeoutId = null;

    function getGameContainer() {
        return document.querySelector(CONTAINER_SELECTOR);
    }

    function getKeeper(container) {
        return [...container.querySelectorAll('.elidolo-mueve')]
            .find(el => el.querySelector('svg'));
    }

    function getShootingButtons(container) {
        return [...container.querySelectorAll('button[aria-label^="Patear "]')];
    }

    function getKeeperCenterX(container) {
        const keeper = getKeeper(container);

        if (!keeper) {
            return null;
        }

        const keeperRect = keeper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return (
            (keeperRect.left + keeperRect.width / 2 - containerRect.left)
            / containerRect.width
        );
    }

    function getButtonCenter(button, container) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return (
            (buttonRect.left + buttonRect.width / 2 - containerRect.left)
            / containerRect.width
        );
    }

    function findBestButton(container) {
        const keeperX = getKeeperCenterX(container);
        const buttons = getShootingButtons(container);

        if (keeperX === null || buttons.length === 0) {
            return null;
        }

        let bestButton = null;
        let bestDistance = -Infinity;

        for (const button of buttons) {
            const buttonX = getButtonCenter(button, container);
            const distance = Math.abs(buttonX - keeperX);

            if (distance > bestDistance) {
                bestDistance = distance;
                bestButton = button;
            }
        }

        return bestButton;
    }

    function shoot() {
        if (!running) {
            return;
        }

        const container = getGameContainer();

        if (!container) {
            timeoutId = setTimeout(shoot, 1000);
            return;
        }

        const button = findBestButton(container);

        if (!button) {
            timeoutId = setTimeout(shoot, 1000);
            return;
        }
   

        button.click();

        timeoutId = setTimeout(shoot, SHOOT_INTERVAL);
    }

    // Expose a stop function.
    window.stopAutoShooter = () => {
        running = false;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

    };

    shoot();
})();