(() => {
  window.line4Bot?.stop?.();

  const SIZE = 5;
  const WIN_LENGTH = 4;
  const ME = "X";
  const THEM = "O";
  const GRID_SELECTOR =
    ".elidolo-escena .mx-auto.grid.w-full.max-w-\\[300px\\].gap-1\\.5";

  // Every possible horizontal, vertical, and diagonal group of four cells.
  const WIN_LINES = [];
  for (const [rowStep, columnStep] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const endRow = row + (WIN_LENGTH - 1) * rowStep;
        const endColumn = column + (WIN_LENGTH - 1) * columnStep;
        if (endRow < 0 || endRow >= SIZE || endColumn < 0 || endColumn >= SIZE) continue;

        WIN_LINES.push(
          Array.from({ length: WIN_LENGTH }, (_, offset) =>
            (row + offset * rowStep) * SIZE + column + offset * columnStep,
          ),
        );
      }
    }
  }

  let pending = false;
  let lastPlayedPosition = null;

  function getGrid() {
    return document.querySelector(GRID_SELECTOR);
  }

  function getButtons() {
    const buttons = [...(getGrid()?.querySelectorAll(':scope > button[type="button"]') ?? [])];
    return buttons.length === SIZE * SIZE ? buttons : null;
  }

  function markOf(button) {
    const mark = button.textContent.trim();
    if (mark === "✖" || mark === "X") return ME;
    if (mark === "◯" || mark === "O") return THEM;
    return null;
  }

  function readBoard(buttons) {
    return buttons.map(markOf);
  }

  function emptySquares(board) {
    return board.flatMap((mark, index) => (mark === null ? [index] : []));
  }

  function hasWon(board, player) {
    return WIN_LINES.some((line) => line.every((square) => board[square] === player));
  }

  function centerWeight(index) {
    const row = Math.floor(index / SIZE);
    const column = index % SIZE;
    // Prefer central squares when all tactical choices are equal.
    return 4 - Math.abs(row - 2) - Math.abs(column - 2);
  }

  function evaluate(board) {
    if (hasWon(board, ME)) return 100000;
    if (hasWon(board, THEM)) return -100000;

    let score = 0;
    for (const line of WIN_LINES) {
      const mine = line.filter((square) => board[square] === ME).length;
      const theirs = line.filter((square) => board[square] === THEM).length;
      if (mine && theirs) continue;
      if (mine) score += [0, 3, 20, 250, 0][mine];
      if (theirs) score -= [0, 4, 28, 350, 0][theirs];
    }

    return score + board.reduce(
      (total, mark, index) => total + (mark === ME ? centerWeight(index) : mark === THEM ? -centerWeight(index) : 0),
      0,
    );
  }

  function orderedMoves(board) {
    return emptySquares(board).sort((left, right) => centerWeight(right) - centerWeight(left));
  }

  function minimax(board, depth, maximizing, alpha, beta) {
    const score = evaluate(board);
    if (depth === 0 || Math.abs(score) >= 100000) return score;

    const player = maximizing ? ME : THEM;
    let best = maximizing ? -Infinity : Infinity;
    for (const move of orderedMoves(board)) {
      board[move] = player;
      const nextScore = minimax(board, depth - 1, !maximizing, alpha, beta);
      board[move] = null;

      if (maximizing) {
        best = Math.max(best, nextScore);
        alpha = Math.max(alpha, best);
      } else {
        best = Math.min(best, nextScore);
        beta = Math.min(beta, best);
      }
      if (beta <= alpha) break;
    }
    return best;
  }

  function bestMove(board) {
    const moves = orderedMoves(board);

    for (const move of moves) {
      board[move] = ME;
      const wins = hasWon(board, ME);
      board[move] = null;
      if (wins) return move;
    }

    const threats = moves.filter((move) => {
      board[move] = THEM;
      const wins = hasWon(board, THEM);
      board[move] = null;
      return wins;
    });
    if (threats.length === 1) return threats[0];

    let selected = moves[0];
    let bestScore = -Infinity;
    for (const move of moves) {
      board[move] = ME;
      const score = minimax(board, 3, false, -Infinity, Infinity);
      board[move] = null;
      if (score > bestScore) {
        bestScore = score;
        selected = move;
      }
    }
    return selected;
  }

  function play() {
    pending = false;
    const buttons = getButtons();
    if (!buttons) return;

    const board = readBoard(buttons);
    const signature = board.map((mark) => mark ?? "-").join("");
    if (signature === lastPlayedPosition || hasWon(board, ME) || hasWon(board, THEM)) return;

    const move = bestMove(board);
    const button = buttons[move];
    if (!button || button.disabled || markOf(button) !== null) return;

    lastPlayedPosition = signature;
    button.click();
  }

  function schedulePlay() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(play);
  }

  const observer = new MutationObserver(schedulePlay);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["disabled", "class"],
  });

  window.line4Bot = {
    stop() {
      observer.disconnect();
      delete window.line4Bot;
    },
  };

  schedulePlay();
})();
