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
const ANALYZED_ELEMENT_COUNT = 6;
const BUBBLE_VARIANTS = [
  { className: "bubble-soft", weight: 5 },
  { className: "bubble-mint", weight: 4 },
  { className: "bubble-deep", weight: 3 },
  { className: "bubble-ring", weight: 2 },
  { className: "bubble-sunrise", weight: 2 },
  { className: "bubble-coral", weight: 1 },
  { className: "bubble-lilac", weight: 1 },
];
const ELEMENT_CANDIDATES = [
  { symbol: "H", name: "水素", number: 1, hue: 210, light: 0.9, sat: 0.2, edge: 0.2 },
  { symbol: "C", name: "炭素", number: 6, hue: 20, light: 0.2, sat: 0.05, edge: 0.72 },
  { symbol: "O", name: "酸素", number: 8, hue: 190, light: 0.72, sat: 0.72, edge: 0.45 },
  { symbol: "Na", name: "ナトリウム", number: 11, hue: 36, light: 0.66, sat: 0.55, edge: 0.36 },
  { symbol: "Mg", name: "マグネシウム", number: 12, hue: 200, light: 0.62, sat: 0.22, edge: 0.5 },
  { symbol: "Al", name: "アルミニウム", number: 13, hue: 210, light: 0.56, sat: 0.12, edge: 0.54 },
  { symbol: "Si", name: "ケイ素", number: 14, hue: 35, light: 0.5, sat: 0.35, edge: 0.63 },
  { symbol: "P", name: "リン", number: 15, hue: 20, light: 0.48, sat: 0.64, edge: 0.58 },
  { symbol: "S", name: "硫黄", number: 16, hue: 55, light: 0.76, sat: 0.78, edge: 0.34 },
  { symbol: "Cl", name: "塩素", number: 17, hue: 104, light: 0.6, sat: 0.7, edge: 0.38 },
  { symbol: "K", name: "カリウム", number: 19, hue: 266, light: 0.56, sat: 0.54, edge: 0.48 },
  { symbol: "Ca", name: "カルシウム", number: 20, hue: 42, light: 0.74, sat: 0.36, edge: 0.42 },
  { symbol: "Fe", name: "鉄", number: 26, hue: 12, light: 0.35, sat: 0.3, edge: 0.78 },
  { symbol: "Cu", name: "銅", number: 29, hue: 22, light: 0.46, sat: 0.5, edge: 0.64 },
  { symbol: "Zn", name: "亜鉛", number: 30, hue: 200, light: 0.58, sat: 0.2, edge: 0.54 },
  { symbol: "Br", name: "臭素", number: 35, hue: 16, light: 0.24, sat: 0.66, edge: 0.52 },
  { symbol: "Ag", name: "銀", number: 47, hue: 215, light: 0.72, sat: 0.08, edge: 0.52 },
  { symbol: "I", name: "ヨウ素", number: 53, hue: 285, light: 0.38, sat: 0.64, edge: 0.5 },
];
const DEFAULT_ELEMENT_POOL = [ELEMENT_CANDIDATES[0], ELEMENT_CANDIDATES[1], ELEMENT_CANDIDATES[2]];

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
const photoInputEl = document.getElementById("photoInput");
const analyzePhotoButtonEl = document.getElementById("analyzePhotoButton");
const photoStatusEl = document.getElementById("photoStatus");
const photoPreviewEl = document.getElementById("photoPreview");
const elementsListEl = document.getElementById("elementsList");
const elementScoreHintEl = document.getElementById("elementScoreHint");
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
let selectedPhotoDataUrl = "";
let activeElements = [...DEFAULT_ELEMENT_POOL];

initSettings();
initializeStageDecor();
renderElementList(activeElements);

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

  const selectedElement = isDangerBubble ? null : pickElementForBubble();

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

  if (selectedElement) {
    const labelEl = document.createElement("span");
    labelEl.className = "bubble-element-label";
    labelEl.textContent = `${selectedElement.symbol} ${selectedElement.number}`;
    bubbleEl.appendChild(labelEl);
  }

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
    const gainedScore = selectedElement ? selectedElement.number : 1;
    score += gainedScore;
    scoreEl.textContent = String(score);
    if (selectedElement) {
      messageEl.textContent = `${selectedElement.name} (${selectedElement.symbol}) +${gainedScore}`;
    }
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

function pickElementForBubble() {
  if (!activeElements.length) {
    return DEFAULT_ELEMENT_POOL[randomInRange(0, DEFAULT_ELEMENT_POOL.length - 1)];
  }
  return activeElements[randomInRange(0, activeElements.length - 1)];
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
  if (currentScore >= 700) {
    return "泡神";
  }
  if (currentScore >= 480) {
    return "泡マスター";
  }
  if (currentScore >= 300) {
    return "泡ハンター";
  }
  if (currentScore >= 160) {
    return "泡トレーニー";
  }
  return "泡ビギナー";
}

function renderElementList(elements) {
  if (!elementsListEl) {
    return;
  }

  elementsListEl.innerHTML = "";
  for (const element of elements) {
    const itemEl = document.createElement("li");
    itemEl.textContent = `${element.symbol} ${element.number}: ${element.name}`;
    elementsListEl.appendChild(itemEl);
  }

  if (elementScoreHintEl) {
    const total = elements.reduce((sum, element) => sum + element.number, 0);
    elementScoreHintEl.textContent = `元素番号（原子番号）が得点です。今回の候補合計は ${total} 点。`;
  }
}

function circularHueDistance(hueA, hueB) {
  const rawDistance = Math.abs(hueA - hueB);
  return Math.min(rawDistance, 360 - rawDistance) / 180;
}

function normalizeValue(value, min, max) {
  if (max <= min) {
    return 0;
  }
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function pickTopHueFromHistogram(hueHistogram) {
  let topIndex = 0;
  let topValue = -1;
  for (let index = 0; index < hueHistogram.length; index += 1) {
    if (hueHistogram[index] > topValue) {
      topValue = hueHistogram[index];
      topIndex = index;
    }
  }
  return topIndex * 30 + 15;
}

function rgbToHsl(red, green, blue) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === normalizedRed) {
      hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
    } else if (max === normalizedGreen) {
      hue = (normalizedBlue - normalizedRed) / delta + 2;
    } else {
      hue = (normalizedRed - normalizedGreen) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const light = (max + min) / 2;
  const sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
  return { hue, sat, light };
}

function extractImageFeatures(imageData) {
  const { data, width, height } = imageData;
  const hueHistogram = new Array(12).fill(0);
  let lightSum = 0;
  let satSum = 0;
  let pixelCount = 0;
  let edgeTotal = 0;
  let edgeSamples = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const { hue, sat, light } = rgbToHsl(red, green, blue);

      lightSum += light;
      satSum += sat;
      pixelCount += 1;

      if (sat > 0.08) {
        const hueBin = Math.floor(hue / 30) % 12;
        hueHistogram[hueBin] += 1;
      }

      if (x < width - 1 && y < height - 1) {
        const rightIndex = index + 4;
        const bottomIndex = index + width * 4;
        const rightDiff = Math.abs(red - data[rightIndex]) + Math.abs(green - data[rightIndex + 1]) + Math.abs(blue - data[rightIndex + 2]);
        const bottomDiff = Math.abs(red - data[bottomIndex]) + Math.abs(green - data[bottomIndex + 1]) + Math.abs(blue - data[bottomIndex + 2]);
        edgeTotal += rightDiff + bottomDiff;
        edgeSamples += 2;
      }
    }
  }

  const dominantHue = pickTopHueFromHistogram(hueHistogram);
  const avgLight = lightSum / Math.max(1, pixelCount);
  const avgSat = satSum / Math.max(1, pixelCount);
  const avgEdge = normalizeValue(edgeTotal / Math.max(1, edgeSamples), 0, 190);

  return {
    dominantHue,
    avgLight,
    avgSat,
    avgEdge,
  };
}

function chooseElementsFromFeatures(features) {
  const scoredElements = ELEMENT_CANDIDATES.map((element, index) => {
    const hueScore = 1 - circularHueDistance(features.dominantHue, element.hue);
    const lightScore = 1 - Math.abs(features.avgLight - element.light);
    const satScore = 1 - Math.abs(features.avgSat - element.sat);
    const edgeScore = 1 - Math.abs(features.avgEdge - element.edge);
    const tinyVariation = (index % 5) * 0.001;
    const scoreValue = hueScore * 0.38 + lightScore * 0.22 + satScore * 0.24 + edgeScore * 0.16 + tinyVariation;
    return { element, scoreValue };
  });

  scoredElements.sort((left, right) => right.scoreValue - left.scoreValue);
  return scoredElements.slice(0, ANALYZED_ELEMENT_COUNT).map((entry) => entry.element);
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("画像読み込みに失敗しました"));
    image.src = dataUrl;
  });
}

async function analyzePhotoToElements(dataUrl) {
  const image = await loadImageFromDataUrl(dataUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Canvasが利用できません");
  }

  const maxSide = 180;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  canvas.width = Math.max(16, Math.floor(image.width * scale));
  canvas.height = Math.max(16, Math.floor(image.height * scale));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const features = extractImageFeatures(imageData);
  return chooseElementsFromFeatures(features);
}

function handlePhotoInputChanged(event) {
  const target = event.target;
  if (!target || !target.files || target.files.length === 0) {
    selectedPhotoDataUrl = "";
    photoStatusEl.textContent = "写真が未選択です。デフォルト元素で遊べます。";
    photoPreviewEl.classList.add("hidden");
    photoPreviewEl.removeAttribute("src");
    return;
  }

  const file = target.files[0];
  if (!file.type.startsWith("image/")) {
    selectedPhotoDataUrl = "";
    photoStatusEl.textContent = "画像ファイルを選択してください。";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const nextDataUrl = typeof reader.result === "string" ? reader.result : "";
    selectedPhotoDataUrl = nextDataUrl;
    if (!selectedPhotoDataUrl) {
      photoStatusEl.textContent = "写真の読み込みに失敗しました。";
      return;
    }

    photoPreviewEl.src = selectedPhotoDataUrl;
    photoPreviewEl.classList.remove("hidden");
    photoStatusEl.textContent = "写真を読み込みました。「写真を解析する」を押してください。";
  };
  reader.onerror = () => {
    selectedPhotoDataUrl = "";
    photoStatusEl.textContent = "写真の読み込みに失敗しました。";
  };
  reader.readAsDataURL(file);
}

async function handleAnalyzePhotoClicked() {
  if (!selectedPhotoDataUrl) {
    photoStatusEl.textContent = "先に写真を選択してください。";
    return;
  }

  analyzePhotoButtonEl.disabled = true;
  photoStatusEl.textContent = "AI風に写真を解析中...";

  try {
    const analyzedElements = await analyzePhotoToElements(selectedPhotoDataUrl);
    if (!analyzedElements.length) {
      throw new Error("元素候補を作れませんでした");
    }

    activeElements = analyzedElements;
    renderElementList(activeElements);
    photoStatusEl.textContent = "解析完了! この元素セットがバブルに反映されます。";
    messageEl.textContent = "写真解析の元素セットを適用しました";
    playTone(760, 0.06, "triangle", 0.05);
  } catch (error) {
    activeElements = [...DEFAULT_ELEMENT_POOL];
    renderElementList(activeElements);
    photoStatusEl.textContent = "解析に失敗したため、デフォルト元素に切り替えました。";
  } finally {
    analyzePhotoButtonEl.disabled = false;
  }
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
photoInputEl.addEventListener("change", handlePhotoInputChanged);
analyzePhotoButtonEl.addEventListener("click", handleAnalyzePhotoClicked);
