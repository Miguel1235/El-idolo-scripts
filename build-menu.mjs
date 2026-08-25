import { readdir, readFile, writeFile } from "node:fs/promises";

const directory = new URL("./", import.meta.url);

const outputName = "El Idolo menu.js";

// Customize the emoji for each script here.
const SCRIPT_ICONS = {
  "El aguante": "🛡️",
  "La corrida": "🎯",
  "La definicion al arquero": "🥅",
  "La definicion al limite": "📊",
  "La jugada personal": "🏃",
  "La pizarra del DT": "📋",
  "La senia del DT": "👁️",
  "Los alcanzapelotas": "👕",
  "Ta-te-ti": "❌⭕",
};

const files = (await readdir(directory, { withFileTypes: true }))
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".js") &&
      entry.name !== outputName
  )
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "es"));

const scripts = await Promise.all(
  files.map(async (name) => {
    const scriptName = name.replace(/\.js$/, "");

    return {
      name: scriptName,
      icon: SCRIPT_ICONS[scriptName] ?? "⚽",
      source: await readFile(new URL(name, directory), "utf8"),
    };
  })
);

const runtime = `(() => {
  const SCRIPTS = __SCRIPTS__;
  const EXISTING_ID = "el-idolo-script-menu";

  document.getElementById(EXISTING_ID)?.remove();

  const root = document.createElement("div");
  root.id = EXISTING_ID;

  root.style.cssText =
    "position:fixed;right:20px;bottom:20px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  const shadow = root.attachShadow({ mode: "open" });

  shadow.innerHTML = \`<style>
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
  </section>\`;

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
          \`[El Ídolo] Cleanup failed for \${name}\`,
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
        \`[El Ídolo] Could not start \${script.name}\`,
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
    copy.textContent = \`\${script.icon ?? "⚽"} \${script.name}\`;

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
})();`;

await writeFile(
  new URL(outputName, directory),
  runtime.replace(
    "__SCRIPTS__",
    JSON.stringify(scripts)
  ) + "\n"
);