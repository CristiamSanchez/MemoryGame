const symbols = ["🌙", "☀️", "⭐", "🎵", "🍀", "⚡", "🎯", "🔥"];

const state = {
  deck: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  isLocked: false,
  timer: 0,
  timerId: null,
  hasStarted: false,
  gameFinished: false,
};

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const deck = symbols
    .flatMap((symbol, index) => [
      { id: `${symbol}-${index}-a`, symbol, matched: false },
      { id: `${symbol}-${index}-b`, symbol, matched: false },
    ])
    .map((card, index) => ({ ...card, order: index }));

  return shuffle(deck);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateHud() {
  movesEl.textContent = String(state.moves);
  pairsEl.textContent = `${state.matchedPairs} / ${symbols.length}`;
  timerEl.textContent = formatTime(state.timer);
}

function setMessage(text) {
  messageEl.textContent = text;
}

function startTimer() {
  if (state.timerId || state.gameFinished) {
    return;
  }

  state.hasStarted = true;
  state.timerId = window.setInterval(() => {
    state.timer += 1;
    updateHud();
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function checkWin() {
  if (state.matchedPairs === symbols.length) {
    state.gameFinished = true;
    stopTimer();
    setMessage(`¡Ganaste! Tiempo total: ${formatTime(state.timer)} con ${state.moves} movimientos.`);
  }
}

function resetGame() {
  stopTimer();
  state.deck = buildDeck();
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.isLocked = false;
  state.timer = 0;
  state.hasStarted = false;
  state.gameFinished = false;
  setMessage("Encuentra todas las parejas.");
  updateHud();
  renderBoard();
}

function unlockBoard() {
  state.isLocked = false;
  state.flippedCards = [];
  renderBoard();
}

function compareFlippedCards() {
  const [firstCard, secondCard] = state.flippedCards;

  if (firstCard.symbol === secondCard.symbol) {
    state.deck = state.deck.map((card) => {
      if (card.id === firstCard.id || card.id === secondCard.id) {
        return { ...card, matched: true };
      }
      return card;
    });

    state.matchedPairs += 1;
    state.flippedCards = [];
    updateHud();
    setMessage("¡Pareja correcta!");
    checkWin();
    return;
  }

  state.isLocked = true;
  setMessage("No coincide. Inténtalo otra vez.");

  window.setTimeout(() => {
    state.flippedCards = [];
    state.isLocked = false;
    renderBoard();
  }, 750);
}

function handleCardClick(cardId) {
  if (state.gameFinished) {
    return;
  }

  if (!state.hasStarted) {
    startTimer();
  }

  const clickedCard = state.deck.find((card) => card.id === cardId);

  if (!clickedCard || clickedCard.matched || state.isLocked) {
    return;
  }

  if (state.flippedCards.some((card) => card.id === cardId)) {
    return;
  }

  state.flippedCards = [...state.flippedCards, clickedCard];
  renderBoard();

  if (state.flippedCards.length === 2) {
    state.isLocked = true;
    state.moves += 1;
    updateHud();
    window.setTimeout(compareFlippedCards, 180);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";

  state.deck.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.id = card.id;
    button.setAttribute("aria-label", card.matched || state.flippedCards.some((item) => item.id === card.id) ? `Carta ${card.symbol}` : "Carta oculta");

    if (card.matched || state.flippedCards.some((item) => item.id === card.id)) {
      button.classList.add("flipped");
    }

    if (card.matched) {
      button.classList.add("matched");
    }

    button.disabled = state.isLocked || card.matched;

    button.innerHTML = `
      <span class="card-inner">
        <span class="card-face card-back" aria-hidden="true"></span>
        <span class="card-face card-front" aria-hidden="true">${card.matched || state.flippedCards.some((item) => item.id === card.id) ? card.symbol : "?"}</span>
      </span>
    `;

    button.addEventListener("click", () => handleCardClick(card.id));
    boardEl.appendChild(button);
  });
}

restartBtn.addEventListener("click", resetGame);
resetGame();
