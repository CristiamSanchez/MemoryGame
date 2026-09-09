const symbols = ["🌙", "☀️", "⭐", "🎵", "🍀", "⚡", "🎯", "🔥"];
const STORAGE_KEY = "memory-game-scoreboard-v1";
let audioContext = null;

const defaultScoreboard = {
  "Player 1": { wins: 0, attempts: 0, bestTime: null },
  "Player 2": { wins: 0, attempts: 0, bestTime: null },
};

const state = {
  deck: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: symbols.length,
  currentTurn: 0,
  isLocked: false,
  timer: 0,
  timerId: null,
  pendingTimeoutId: null,
  hasStarted: false,
  gameFinished: false,
  gamesPlayed: 0,
  players: [
    { name: "Player 1", pairs: 0, attempts: 0, time: 0 },
    { name: "Player 2", pairs: 0, attempts: 0, time: 0 },
  ],
  scoreboard: loadScoreboard(),
};

const boardEl = document.getElementById("board");
const pairsEl = document.getElementById("pairs");
const timerEl = document.getElementById("timer");
const turnLabelEl = document.getElementById("turnLabel");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const passTurnBtn = document.getElementById("passTurnBtn");
const winnerModal = document.getElementById("winnerModal");
const winnerText = document.getElementById("winnerText");
const playAgainBtn = document.getElementById("playAgainBtn");
const gamesCounterEl = document.getElementById("gamesCounter");
const player1Panel = document.getElementById("player1Panel");
const player2Panel = document.getElementById("player2Panel");

const p1PairsEl = document.getElementById("p1Pairs");
const p1AttemptsEl = document.getElementById("p1Attempts");
const p1TimeEl = document.getElementById("p1Time");
const p2PairsEl = document.getElementById("p2Pairs");
const p2AttemptsEl = document.getElementById("p2Attempts");
const p2TimeEl = document.getElementById("p2Time");

function loadScoreboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultScoreboard, ...JSON.parse(raw) } : { ...defaultScoreboard };
  } catch (error) {
    return { ...defaultScoreboard };
  }
}

function saveScoreboard() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scoreboard));
}

function ensureAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration, volume = 0.04, wave = "square") {
  const ctx = ensureAudioContext();
  if (!ctx) {
    return;
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = wave;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
}

function playMatchSound() {
  playTone(660, 0.12, 0.035, "square");
  window.setTimeout(() => playTone(880, 0.1, 0.03, "triangle"), 80);
}

function playFailSound() {
  playTone(180, 0.18, 0.03, "sawtooth");
}

function playWinSound() {
  playTone(440, 0.15, 0.04, "triangle");
  window.setTimeout(() => playTone(660, 0.16, 0.04, "triangle"), 120);
  window.setTimeout(() => playTone(880, 0.2, 0.04, "triangle"), 240);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const deck = symbols.flatMap((symbol, index) => [
    { id: `${symbol}-${index}-a`, symbol, matched: false },
    { id: `${symbol}-${index}-b`, symbol, matched: false },
  ]);

  return shuffle(deck);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getActivePlayer() {
  return state.players[state.currentTurn];
}

function showWinnerModal(winner) {
  winnerText.textContent = `${winner.name} gana con ${formatTime(winner.time)} y ${winner.attempts} intentos.`;
  winnerModal.hidden = false;
}

function hideWinnerModal() {
  winnerModal.hidden = true;
}

function updateHud() {
  const activePlayer = getActivePlayer();
  pairsEl.textContent = `${state.matchedPairs} / ${state.totalPairs}`;
  timerEl.textContent = formatTime(state.timer);
  turnLabelEl.textContent = activePlayer.name;

  p1PairsEl.textContent = String(state.players[0].pairs);
  p1AttemptsEl.textContent = String(state.players[0].attempts);
  p1TimeEl.textContent = formatTime(state.players[0].time);

  p2PairsEl.textContent = String(state.players[1].pairs);
  p2AttemptsEl.textContent = String(state.players[1].attempts);
  p2TimeEl.textContent = formatTime(state.players[1].time);

  gamesCounterEl.textContent = String(state.gamesPlayed);
  player1Panel.classList.toggle("active", state.currentTurn === 0 && !state.gameFinished);
  player2Panel.classList.toggle("active", state.currentTurn === 1 && !state.gameFinished);
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
    state.players[state.currentTurn].time += 1;
    updateHud();
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function clearPendingTurnTimeout() {
  if (state.pendingTimeoutId) {
    clearTimeout(state.pendingTimeoutId);
    state.pendingTimeoutId = null;
  }
}

function finishGame() {
  state.gameFinished = true;
  state.gamesPlayed += 1;
  stopTimer();
  passTurnBtn.hidden = true;

  const sortedPlayers = [...state.players].sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.attempts - b.attempts;
  });

  const winner = sortedPlayers[0];
  state.scoreboard[winner.name].wins += 1;
  state.scoreboard[winner.name].attempts += winner.attempts;
  const currentBest = state.scoreboard[winner.name].bestTime;
  if (currentBest === null || winner.time < currentBest) {
    state.scoreboard[winner.name].bestTime = winner.time;
  }
  saveScoreboard();

  showWinnerModal(winner);
  playWinSound();
  setMessage(`¡Partida terminada! ${winner.name} gana con ${formatTime(winner.time)} y ${winner.attempts} intentos.`);
  updateHud();
}

function resetGame() {
  stopTimer();
  clearPendingTurnTimeout();
  hideWinnerModal();
  state.deck = buildDeck();
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.currentTurn = 0;
  state.isLocked = false;
  state.timer = 0;
  state.hasStarted = false;
  state.gameFinished = false;
  state.players = [
    { name: "Player 1", pairs: 0, attempts: 0, time: 0 },
    { name: "Player 2", pairs: 0, attempts: 0, time: 0 },
  ];
  passTurnBtn.hidden = true;

  setMessage("Encuentra todas las parejas.");
  updateHud();
  renderBoard();
}

function passTurn() {
  if (state.gameFinished || !state.isLocked) {
    return;
  }

  state.flippedCards = [];
  state.isLocked = false;
  state.currentTurn = state.currentTurn === 0 ? 1 : 0;
  passTurnBtn.hidden = true;
  renderBoard();
  updateHud();
  setMessage(`${getActivePlayer().name} puede jugar ahora.`);
}

function compareFlippedCards() {
  const [firstCard, secondCard] = state.flippedCards;
  const activePlayer = getActivePlayer();

  if (firstCard.symbol === secondCard.symbol) {
    state.deck = state.deck.map((card) => {
      if (card.id === firstCard.id || card.id === secondCard.id) {
        return { ...card, matched: true };
      }
      return card;
    });

    activePlayer.pairs += 1;
    state.matchedPairs += 1;
    state.flippedCards = [];
    state.isLocked = false;
    playMatchSound();
    updateHud();
    setMessage(`${activePlayer.name} encontró una pareja.`);

    if (state.matchedPairs === state.totalPairs) {
      finishGame();
      return;
    }

    renderBoard();
    return;
  }

  state.isLocked = true;
  passTurnBtn.hidden = false;
  playFailSound();
  setMessage(`${activePlayer.name} falló. Pulsa “Siguiente turno” para pasar el turno.`);
  renderBoard();
}

function triggerTurnTimeout() {
  clearPendingTurnTimeout();
  state.pendingTimeoutId = window.setTimeout(() => {
    state.pendingTimeoutId = null;
    state.flippedCards = [];
    state.isLocked = false;
    state.currentTurn = state.currentTurn === 0 ? 1 : 0;
    renderBoard();
    updateHud();
  }, 750);
}

function handleCardClick(cardId) {
  if (state.gameFinished || state.isLocked) {
    return;
  }

  ensureAudioContext();

  if (!state.hasStarted) {
    startTimer();
  }

  const clickedCard = state.deck.find((card) => card.id === cardId);

  if (!clickedCard || clickedCard.matched) {
    return;
  }

  if (state.flippedCards.some((card) => card.id === cardId)) {
    return;
  }

  state.flippedCards = [...state.flippedCards, clickedCard];
  renderBoard();

  if (state.flippedCards.length === 2) {
    const activePlayer = getActivePlayer();
    activePlayer.attempts += 1;
    state.isLocked = true;
    updateHud();
    clearPendingTurnTimeout();
    state.pendingTimeoutId = window.setTimeout(compareFlippedCards, 180);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";

  state.deck.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.id = card.id;
    button.setAttribute(
      "aria-label",
      card.matched || state.flippedCards.some((item) => item.id === card.id)
        ? `Carta ${card.symbol}`
        : "Carta oculta"
    );

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

restartBtn.addEventListener("click", () => {
  resetGame();
});

passTurnBtn.addEventListener("click", passTurn);
playAgainBtn.addEventListener("click", () => {
  resetGame();
});

resetGame();
