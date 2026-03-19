const GAME_SECONDS = 30;
const SPAWN_INTERVAL_MS = 500;
const DANGER_SPAWN_INTERVAL_MS = 4700;
const BURST_PIECE_COUNT = 9;
const MAX_ACTIVE_BURST_PIECES = 160;
const PRESSURE_START_SECONDS = 7;
const PRESSURE_FULL_SECONDS = 27;
const MAX_LANE_PRESSURE_RATIO = 0.32;
const NICKNAME_STORAGE_KEY = "bubble-pop-nickname";
const SOUND_STORAGE_KEY = "bubble-pop-sound-enabled";
const DEFAULT_NICKNAME = "ゲスト";
const BUBBLE_VARIANTS = [
  { className: "bubble-soft", weight: 5 },
  { className: "bubble-mint", weight: 4 },
  { className: "bubble-deep", weight: 3 },
  { className: "bubble-ring", weight: 2 },
  { className: "bubble-sunrise", weight: 2 },
  { className: "bubble-coral", weight: 1 },
  { className: "bubble-lilac", weight: 1 },
];

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");
const stageEl = document.getElementById("stage");
const startOverlayEl = document.getElementById("startOverlay");
const startButtonEl = document.getElementById("startButton");
const titleScreenEl = document.getElementById("titleScreen");
const gameScreenEl = document.getElementById("gameScreen");
const enterGameButtonEl = document.getElementById("enterGameButton");
const backToTitleButtonEl = document.getElementById("backToTitleButton");
const nicknameInputEl = document.getElementById("nicknameInput");
const soundToggleButtonEl = document.getElementById("soundToggleButton");
const playerNameDisplayEl = document.getElementById("playerNameDisplay");
const resultTitleEl = document.getElementById("resultTitle");
const resultScreenEl = document.getElementById("resultScreen");
const resultPlayerEl = document.getElementById("resultPlayer");
const resultScoreEl = document.getElementById("resultScore");
const resultRankEl = document.getElementById("resultRank");
const retryFromResultButtonEl = document.getElementById("retryFromResultButton");
const resultToTitleButtonEl = document.getElementById("resultToTitleButton");

let score = 0;
let remaining = GAME_SECONDS;
let timerId = null;
let spawnId = null;
let dangerSpawnId = null;
let running = false;
let playerName = DEFAULT_NICKNAME;
let soundEnabled = true;
let audioContext = null;
let activeBurstPieces = 0;
let gameStartedAt = 0;
let lanePressureRatio = 0;
let lanePressureFrameId = null;
let lanePressureLeftEl = null;
let lanePressureRightEl = null;

initSettings();
initializeStageDecor();

function showTitleScreen() {
  titleScreenEl.classList.remove("hidden");
  gameScreenEl.classList.add("hidden");
  gameScreenEl.setAttribute("aria-hidden", "true");
  hideResultScreen();
}

function showGameScreen() {
  titleScreenEl.classList.add("hidden");
  gameScreenEl.classList.remove("hidden");
  gameScreenEl.setAttribute("aria-hidden", "false");
  hideResultScreen();
  playerNameDisplayEl.textContent = playerName;
  scoreEl.textContent = String(score);
  timeEl.textContent = String(remaining);
  messageEl.textContent = "中央のスタートボタンでゲーム開始";
  resultTitleEl.textContent = "";
  startButtonEl.textContent = "スタート";
  setStartOverlayVisible(true);
}

function startGame() {
  if (running) {
    return;
  }

  running = true;
  score = 0;
  remaining = GAME_SECONDS;
  gameStartedAt = performance.now();
  lanePressureRatio = 0;
  scoreEl.textContent = String(score);
  timeEl.textContent = String(remaining);
  messageEl.textContent = "泡をできるだけ多く割ろう";
  resultTitleEl.textContent = "";
  hideResultScreen();
  setStartOverlayVisible(false);
  startButtonEl.disabled = true;
  startButtonEl.textContent = "プレイ中...";
  resetStage();
  beginLanePressureLoop();
  playTone(740, 0.08, "square", 0.05);

  timerId = setInterval(() => {
    remaining -= 1;
    timeEl.textContent = String(remaining);
    if (remaining <= 0) {
      endGame();
    }
  }, 1000);

  spawnId = setInterval(spawnBubble, SPAWN_INTERVAL_MS);
  dangerSpawnId = setInterval(spawnDangerBubble, DANGER_SPAWN_INTERVAL_MS);
}

function endGame() {
  running = false;
  clearInterval(timerId);
  clearInterval(spawnId);
  clearInterval(dangerSpawnId);
  stopLanePressureLoop();
  setLanePressure(0);
  timerId = null;
  spawnId = null;
  dangerSpawnId = null;
  startButtonEl.disabled = false;
  startButtonEl.textContent = "もう一回遊ぶ";
  setStartOverlayVisible(true);
  const rank = titleByScore(score);
  messageEl.textContent = `終了! ${playerName} のスコア: ${score}`;
  resultTitleEl.textContent = `称号: ${rank}`;
  showResultScreen(rank);
  playTone(330, 0.12, "triangle", 0.07);
}

function backToTitle() {
  if (running) {
    clearInterval(timerId);
    clearInterval(spawnId);
    clearInterval(dangerSpawnId);
    stopLanePressureLoop();
    timerId = null;
    spawnId = null;
    dangerSpawnId = null;
    running = false;
  }

  score = 0;
  remaining = GAME_SECONDS;
  resetStage();
  setLanePressure(0);
  startButtonEl.disabled = false;
  startButtonEl.textContent = "スタート";
  setStartOverlayVisible(true);
  resultTitleEl.textContent = "";
  showTitleScreen();
}

function setStartOverlayVisible(visible) {
  if (visible) {
    startOverlayEl.classList.remove("hidden");
    startOverlayEl.setAttribute("aria-hidden", "false");
    return;
  }

  startOverlayEl.classList.add("hidden");
  startOverlayEl.setAttribute("aria-hidden", "true");
}

function showResultScreen(rank) {
  resultPlayerEl.textContent = playerName;
  resultScoreEl.textContent = String(score);
  resultRankEl.textContent = rank;
  resultScreenEl.classList.remove("hidden");
  resultScreenEl.setAttribute("aria-hidden", "false");
}

function hideResultScreen() {
  resultScreenEl.classList.add("hidden");
  resultScreenEl.setAttribute("aria-hidden", "true");
}

function retryFromResult() {
  if (running) {
    return;
  }
  startGame();
}

function spawnBubble() {
  spawnBubbleByType(false);
}

function spawnDangerBubble() {
  if (!running) {
    return;
  }

  spawnBubbleByType(true);
}

function spawnBubbleByType(isDangerBubble) {
  if (!running) {
    return;
  }

  const stageRect = stageEl.getBoundingClientRect();
  const size = isDangerBubble ? randomInRange(58, 94) : randomInRange(40, 98);
  const pressureMargin = Math.floor(stageRect.width * lanePressureRatio);
  const maxX = Math.max(pressureMargin, Math.floor(stageRect.width - pressureMargin - size));
  const x = randomInRange(pressureMargin, maxX);
  const y = stageRect.height + size;
  const pressureStrength = lanePressureRatio / MAX_LANE_PRESSURE_RATIO;
  const baseDuration = randomInRange(2400, 4200);
  const speedMultiplier = 1 - pressureStrength * 0.45;
  const duration = Math.max(1200, Math.floor(baseDuration * speedMultiplier));
  const riseDistance = Math.ceil(stageRect.height + size * 2);
  const swayDistance = randomInRange(10, 26);
  const driftDirection = Math.random() < 0.5 ? -1 : 1;
  const driftOffset = randomInRange(0, 18) * driftDirection;

  const bubbleEl = document.createElement("button");
  bubbleEl.className = isDangerBubble ? "bubble bubble-danger" : `bubble ${pickBubbleVariantClass()}`;
  bubbleEl.style.width = `${size}px`;
  bubbleEl.style.height = `${size}px`;
  bubbleEl.style.left = `${x}px`;
  bubbleEl.style.top = `${y}px`;
  bubbleEl.style.animationDuration = `${duration}ms`;
  bubbleEl.style.setProperty("--rise-distance", `${riseDistance}px`);
  bubbleEl.style.setProperty("--rise-25", `${Math.round(riseDistance * 0.25)}px`);
  bubbleEl.style.setProperty("--rise-50", `${Math.round(riseDistance * 0.5)}px`);
  bubbleEl.style.setProperty("--rise-75", `${Math.round(riseDistance * 0.75)}px`);
  bubbleEl.style.setProperty("--sway-distance", `${swayDistance}px`);
  bubbleEl.style.setProperty("--drift-offset", `${driftOffset}px`);
  bubbleEl.setAttribute("aria-label", isDangerBubble ? "danger-bubble" : "bubble");

  bubbleEl.addEventListener("click", () => {
    if (!running) {
      return;
    }

    if (isDangerBubble) {
      triggerDangerHitEffect(bubbleEl, size);
      clearBubblesWithoutScoring(bubbleEl);
      bubbleEl.classList.add("pop");
      setTimeout(() => {
        bubbleEl.remove();
      }, 180);
      return;
    }

    createBurstEffect(bubbleEl, size);
    score += 1;
    scoreEl.textContent = String(score);
    playTone(960, 0.045, "sine", 0.03);
    bubbleEl.classList.add("pop");
    setTimeout(() => {
      bubbleEl.remove();
    }, 180);
  });

  stageEl.appendChild(bubbleEl);

  setTimeout(() => {
    bubbleEl.remove();
  }, duration + 50);
}

function clearBubblesWithoutScoring(exceptBubbleEl) {
  const bubbleEls = stageEl.querySelectorAll(".bubble");
  for (const bubbleEl of bubbleEls) {
    if (bubbleEl === exceptBubbleEl) {
      continue;
    }
    bubbleEl.classList.add("drain");
    setTimeout(() => {
      bubbleEl.remove();
    }, 160);
  }
}

function triggerDangerHitEffect(bubbleEl, bubbleSize) {
  createDangerSplashEffect(bubbleEl, bubbleSize);
  stageEl.classList.remove("stage-bad-hit");
  document.body.classList.remove("screen-bad-hit");

  void stageEl.offsetWidth;
  stageEl.classList.add("stage-bad-hit");
  document.body.classList.add("screen-bad-hit");

  messageEl.textContent = "危険バブル! 泡が全部消えた...";
  playTone(220, 0.07, "square", 0.05);
  setTimeout(() => {
    playTone(170, 0.09, "sawtooth", 0.042);
  }, 55);
  setTimeout(() => {
    playTone(110, 0.2, "triangle", 0.038);
  }, 120);

  setTimeout(() => {
    stageEl.classList.remove("stage-bad-hit");
    document.body.classList.remove("screen-bad-hit");
  }, 680);
}

function createDangerSplashEffect(bubbleEl, bubbleSize) {
  const bubbleRect = bubbleEl.getBoundingClientRect();
  const stageRect = stageEl.getBoundingClientRect();
  const centerX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
  const centerY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;

  const splashEl = document.createElement("span");
  splashEl.className = "danger-splash";
  splashEl.style.left = `${Math.round(centerX)}px`;
  splashEl.style.top = `${Math.round(centerY)}px`;
  splashEl.style.setProperty("--danger-size", `${Math.round(bubbleSize * 1.18)}px`);
  splashEl.addEventListener(
    "animationend",
    () => {
      splashEl.remove();
    },
    { once: true }
  );
  stageEl.appendChild(splashEl);
}

function pickBubbleVariantClass() {
  const totalWeight = BUBBLE_VARIANTS.reduce((sum, variant) => sum + variant.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const variant of BUBBLE_VARIANTS) {
    randomWeight -= variant.weight;
    if (randomWeight <= 0) {
      return variant.className;
    }
  }

  return BUBBLE_VARIANTS[0].className;
}

function initializeStageDecor() {
  if (!lanePressureLeftEl) {
    lanePressureLeftEl = document.createElement("div");
    lanePressureLeftEl.className = "lane-pressure lane-pressure-left";
    lanePressureLeftEl.setAttribute("aria-hidden", "true");
  }

  if (!lanePressureRightEl) {
    lanePressureRightEl = document.createElement("div");
    lanePressureRightEl.className = "lane-pressure lane-pressure-right";
    lanePressureRightEl.setAttribute("aria-hidden", "true");
  }

  if (!stageEl.contains(lanePressureLeftEl)) {
    stageEl.appendChild(lanePressureLeftEl);
  }
  if (!stageEl.contains(lanePressureRightEl)) {
    stageEl.appendChild(lanePressureRightEl);
  }
}

function resetStage() {
  stageEl.innerHTML = "";
  initializeStageDecor();
}

function beginLanePressureLoop() {
  stopLanePressureLoop();

  const updateLanePressure = () => {
    if (!running) {
      setLanePressure(0);
      return;
    }

    const elapsedSeconds = (performance.now() - gameStartedAt) / 1000;
    if (elapsedSeconds < PRESSURE_START_SECONDS) {
      setLanePressure(0);
    } else {
      const rampDuration = Math.max(1, PRESSURE_FULL_SECONDS - PRESSURE_START_SECONDS);
      const rawProgress = (elapsedSeconds - PRESSURE_START_SECONDS) / rampDuration;
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));
      const easedProgress = clampedProgress * clampedProgress;
      setLanePressure(easedProgress * MAX_LANE_PRESSURE_RATIO);
    }

    lanePressureFrameId = requestAnimationFrame(updateLanePressure);
  };

  lanePressureFrameId = requestAnimationFrame(updateLanePressure);
}

function stopLanePressureLoop() {
  if (lanePressureFrameId !== null) {
    cancelAnimationFrame(lanePressureFrameId);
    lanePressureFrameId = null;
  }
}

function setLanePressure(nextRatio) {
  lanePressureRatio = Math.min(MAX_LANE_PRESSURE_RATIO, Math.max(0, nextRatio));
  const widthPercent = lanePressureRatio * 100;
  const pressureStrength = lanePressureRatio / MAX_LANE_PRESSURE_RATIO;
  const wallOpacity = 0.16 + pressureStrength * 0.84;

  if (!lanePressureLeftEl || !lanePressureRightEl) {
    return;
  }

  lanePressureLeftEl.style.width = `${widthPercent}%`;
  lanePressureRightEl.style.width = `${widthPercent}%`;
  lanePressureLeftEl.style.opacity = lanePressureRatio > 0 ? String(wallOpacity) : "0";
  lanePressureRightEl.style.opacity = lanePressureRatio > 0 ? String(wallOpacity) : "0";

  if (lanePressureRatio > 0.01) {
    messageEl.textContent = "左右から壁が迫る! 中央レーンを狙おう";
  } else if (running) {
    messageEl.textContent = "泡をできるだけ多く割ろう";
  }
}

function createBurstEffect(bubbleEl, bubbleSize) {
  if (activeBurstPieces >= MAX_ACTIVE_BURST_PIECES) {
    return;
  }

  const bubbleRect = bubbleEl.getBoundingClientRect();
  const stageRect = stageEl.getBoundingClientRect();
  const centerX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
  const centerY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;

  const ringEl = document.createElement("span");
  ringEl.className = "pop-ring";
  ringEl.style.left = `${Math.round(centerX)}px`;
  ringEl.style.top = `${Math.round(centerY)}px`;
  ringEl.style.setProperty("--ring-size", `${Math.round(bubbleSize * 0.7)}px`);
  ringEl.addEventListener(
    "animationend",
    () => {
      ringEl.remove();
    },
    { once: true }
  );
  stageEl.appendChild(ringEl);

  const availablePieceCount = Math.min(BURST_PIECE_COUNT, MAX_ACTIVE_BURST_PIECES - activeBurstPieces);
  if (availablePieceCount <= 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  activeBurstPieces += availablePieceCount;

  for (let index = 0; index < availablePieceCount; index += 1) {
    const pieceEl = document.createElement("span");
    const angle = (Math.PI * 2 * index) / availablePieceCount + Math.random() * 0.22;
    const distance = randomInRange(Math.round(bubbleSize * 0.46), Math.round(bubbleSize * 1.3));
    const arcLift = randomInRange(12, 40);

    pieceEl.className = "burst-piece";
    pieceEl.style.left = `${Math.round(centerX)}px`;
    pieceEl.style.top = `${Math.round(centerY)}px`;
    pieceEl.style.setProperty("--tx", `${Math.round(Math.cos(angle) * distance)}px`);
    pieceEl.style.setProperty("--ty", `${Math.round(Math.sin(angle) * distance - arcLift)}px`);
    pieceEl.style.setProperty("--rot", `${randomInRange(-220, 220)}deg`);
    pieceEl.style.setProperty("--size", `${randomInRange(4, 8)}px`);

    pieceEl.addEventListener(
      "animationend",
      () => {
        activeBurstPieces = Math.max(0, activeBurstPieces - 1);
        pieceEl.remove();
      },
      { once: true }
    );

    fragment.appendChild(pieceEl);
  }

  stageEl.appendChild(fragment);
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function titleByScore(currentScore) {
  if (currentScore >= 45) {
    return "泡神";
  }
  if (currentScore >= 35) {
    return "泡マスター";
  }
  if (currentScore >= 25) {
    return "泡ハンター";
  }
  if (currentScore >= 15) {
    return "泡トレーニー";
  }
  return "泡ビギナー";
}

function initSettings() {
  const storedName = localStorage.getItem(NICKNAME_STORAGE_KEY);
  if (storedName) {
    playerName = sanitizeName(storedName);
  }

  const storedSound = localStorage.getItem(SOUND_STORAGE_KEY);
  if (storedSound !== null) {
    soundEnabled = storedSound === "true";
  }

  nicknameInputEl.value = playerName;
  playerNameDisplayEl.textContent = playerName;
  updateSoundButtonLabel();
}

function sanitizeName(rawName) {
  const trimmed = rawName.trim().slice(0, 16);
  return trimmed || DEFAULT_NICKNAME;
}

function setPlayerName(nextName) {
  playerName = sanitizeName(nextName);
  nicknameInputEl.value = playerName;
  playerNameDisplayEl.textContent = playerName;
  localStorage.setItem(NICKNAME_STORAGE_KEY, playerName);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  updateSoundButtonLabel();
  if (soundEnabled) {
    playTone(680, 0.06, "sine", 0.04);
  }
}

function updateSoundButtonLabel() {
  soundToggleButtonEl.textContent = `効果音: ${soundEnabled ? "ON" : "OFF"}`;
}

function playTone(frequency, durationSeconds, type = "sine", gain = 0.04) {
  if (!soundEnabled) {
    return;
  }

  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + durationSeconds);
}

startButtonEl.addEventListener("click", startGame);
enterGameButtonEl.addEventListener("click", showGameScreen);
backToTitleButtonEl.addEventListener("click", backToTitle);
nicknameInputEl.addEventListener("change", (event) => {
  setPlayerName(event.target.value);
});
soundToggleButtonEl.addEventListener("click", toggleSound);
retryFromResultButtonEl.addEventListener("click", retryFromResult);
resultToTitleButtonEl.addEventListener("click", backToTitle);
