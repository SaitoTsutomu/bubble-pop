const GAME_SECONDS = 30;
const SPAWN_INTERVAL_MS = 500;
const DANGER_SPAWN_INTERVAL_MS = 4700;
const BURST_PIECE_COUNT = 9;
const MAX_ACTIVE_BURST_PIECES = 160;
const MAX_ACTIVE_LABEL_GLYPH_PIECES = 160;
const PRESSURE_START_SECONDS = 7;
const PRESSURE_FULL_SECONDS = 27;
const MAX_LANE_PRESSURE_RATIO = 0.32;
const NICKNAME_STORAGE_KEY = "bubble-pop-nickname";
const SOUND_STORAGE_KEY = "bubble-pop-sound-enabled";
const AI_COMMENTARY_STORAGE_KEY = "bubble-pop-ai-commentary-enabled";
const DEFAULT_NICKNAME = "ゲスト";
const ANALYZED_ELEMENT_COUNT = 6;
const AI_COMMENTARY_INTERVAL_MS = 6500;
const AI_COMMENTARY_EVENT_WINDOW_MS = 9000;
const AI_COMMENTARY_MODEL_CANDIDATES = [{ name: "Xenova/distilgpt2", quantized: true }];
const AI_COMMENTARY_TRANSFORMERS_JS_URL = "https://esm.sh/@xenova/transformers@2.17.2?bundle";
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
const ELEMENT_EFFECT_OVERRIDES = {
  H: {
    categoryLabel: "水素スパーク",
    pattern: "prism",
    ringCount: 3,
    ringScale: 0.5,
    ringDurationMs: 240,
    pieceCount: 16,
    pieceDistanceScale: 1.45,
    pieceLiftScale: 1.3,
    pieceDurationMs: 390,
    stageFlashMs: 230,
    stageBorderColor: "hsla(204, 100%, 88%, 0.98)",
    stageGlowColor: "hsla(196, 100%, 60%, 0.38)",
    stageOverlayA: "hsla(194, 100%, 92%, 0.82)",
    stageOverlayB: "hsla(206, 100%, 70%, 0.2)",
    ringColor: "hsla(205, 100%, 92%, 0.98)",
    ringGlow: "hsla(194, 96%, 68%, 0.74)",
    pieceCore: "hsla(205, 100%, 97%, 0.98)",
    pieceEdge: "hsla(196, 96%, 72%, 0.92)",
    pieceGlow: "hsla(190, 98%, 76%, 0.82)",
    tones: [
      { frequency: 1240, duration: 0.032, type: "sine", gain: 0.026, delayMs: 0 },
      { frequency: 1680, duration: 0.024, type: "triangle", gain: 0.018, delayMs: 26 },
      { frequency: 1980, duration: 0.018, type: "sine", gain: 0.015, delayMs: 52 },
    ],
  },
  O: {
    categoryLabel: "酸素ウェーブ",
    pattern: "wave",
    ringCount: 2,
    ringScale: 0.96,
    ringDurationMs: 420,
    pieceCount: 11,
    pieceDistanceScale: 1.05,
    pieceLiftScale: 0.62,
    pieceDurationMs: 540,
    stageFlashMs: 340,
    stageBorderColor: "hsla(178, 92%, 72%, 0.95)",
    stageGlowColor: "hsla(188, 90%, 50%, 0.46)",
    stageOverlayA: "hsla(182, 94%, 72%, 0.74)",
    stageOverlayB: "hsla(195, 100%, 38%, 0.24)",
    ringColor: "hsla(176, 96%, 82%, 0.97)",
    ringGlow: "hsla(187, 92%, 56%, 0.72)",
    pieceCore: "hsla(176, 95%, 92%, 0.96)",
    pieceEdge: "hsla(188, 88%, 62%, 0.9)",
    pieceGlow: "hsla(192, 95%, 58%, 0.82)",
    tones: [
      { frequency: 690, duration: 0.058, type: "triangle", gain: 0.026, delayMs: 0 },
      { frequency: 840, duration: 0.048, type: "sine", gain: 0.021, delayMs: 36 },
      { frequency: 540, duration: 0.078, type: "sine", gain: 0.015, delayMs: 82 },
    ],
  },
};
const EFFECT_PROFILE_PATTERNS = ["halo", "wave", "pulse", "spark", "prism", "comet"];
const EFFECT_PROFILE_WAVE_TYPES = ["sine", "triangle", "square", "sawtooth"];
const ELEMENT_MEANING_TRAITS = {
  H: { motif: "軽量点火", pattern: "prism", semanticHue: 198, toneShift: 340, ringBoost: 1, pieceBoost: 2, flashBoost: -20 },
  C: { motif: "炭素コア", pattern: "comet", semanticHue: 24, toneShift: -160, ringBoost: 0, pieceBoost: 2, flashBoost: 18 },
  O: { motif: "酸化ウェーブ", pattern: "wave", semanticHue: 182, toneShift: -60, ringBoost: 1, pieceBoost: 1, flashBoost: 30 },
  Na: { motif: "ナトリウム炎", pattern: "spark", semanticHue: 34, toneShift: 100, ringBoost: 1, pieceBoost: 3, flashBoost: 10 },
  Mg: { motif: "白色閃光", pattern: "pulse", semanticHue: 208, toneShift: 140, ringBoost: 1, pieceBoost: 2, flashBoost: -10 },
  Al: { motif: "軽金属グライド", pattern: "halo", semanticHue: 214, toneShift: 26, ringBoost: 0, pieceBoost: 1, flashBoost: 0 },
  Si: { motif: "結晶プリズム", pattern: "prism", semanticHue: 38, toneShift: 38, ringBoost: 1, pieceBoost: 1, flashBoost: 8 },
  P: { motif: "燐光スパーク", pattern: "spark", semanticHue: 20, toneShift: 90, ringBoost: 0, pieceBoost: 2, flashBoost: 12 },
  S: { motif: "硫黄フレア", pattern: "pulse", semanticHue: 56, toneShift: 82, ringBoost: 1, pieceBoost: 3, flashBoost: 14 },
  Cl: { motif: "塩素スティング", pattern: "spark", semanticHue: 108, toneShift: 55, ringBoost: 0, pieceBoost: 2, flashBoost: 12 },
  K: { motif: "紫炎パルス", pattern: "pulse", semanticHue: 268, toneShift: 76, ringBoost: 1, pieceBoost: 1, flashBoost: 10 },
  Ca: { motif: "石灰ハロー", pattern: "halo", semanticHue: 42, toneShift: 32, ringBoost: 1, pieceBoost: 1, flashBoost: 4 },
  Fe: { motif: "鍛造スパーク", pattern: "comet", semanticHue: 16, toneShift: -74, ringBoost: 1, pieceBoost: 4, flashBoost: 20 },
  Cu: { motif: "銅電アーク", pattern: "comet", semanticHue: 28, toneShift: -28, ringBoost: 1, pieceBoost: 3, flashBoost: 16 },
  Zn: { motif: "亜鉛シールド", pattern: "halo", semanticHue: 206, toneShift: 18, ringBoost: 0, pieceBoost: 1, flashBoost: 2 },
  Br: { motif: "臭素ミスト", pattern: "wave", semanticHue: 18, toneShift: -96, ringBoost: 0, pieceBoost: 2, flashBoost: 24 },
  Ag: { motif: "銀鏡フラッシュ", pattern: "prism", semanticHue: 216, toneShift: 84, ringBoost: 1, pieceBoost: 2, flashBoost: -12 },
  I: { motif: "ヨウ素トワイライト", pattern: "wave", semanticHue: 286, toneShift: -22, ringBoost: 1, pieceBoost: 2, flashBoost: 22 },
};

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
const aiCommentaryToggleButtonEl = document.getElementById("aiCommentaryToggleButton");
const aiCommentaryStatusEl = document.getElementById("aiCommentaryStatus");
const photoInputEl = document.getElementById("photoInput");
const analyzePhotoButtonEl = document.getElementById("analyzePhotoButton");
const photoStatusEl = document.getElementById("photoStatus");
const photoPreviewEl = document.getElementById("photoPreview");
const aiCommentaryEl = document.getElementById("aiCommentary");
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
let stageElementHitTimeoutId = null;
let stageComboHitTimeoutId = null;
let comboElementSymbol = "";
let comboStreak = 0;
let activeLabelGlyphPieces = 0;
let aiCommentaryEnabled = false;
let aiCommentaryTickId = null;
let aiCommentaryRequestInFlight = false;
let aiCommentaryEvents = [];
let aiLanePressureLogged = false;
let lastAiCommentaryText = "";
let aiFallbackCommentaryCursor = 0;
let aiCommentaryPipeline = null;
let aiCommentaryPipelinePromise = null;
let aiCommentaryModelReady = false;
let aiCommentaryLastError = "";
let aiCommentaryActiveModel = AI_COMMENTARY_MODEL_CANDIDATES[0].name;
let aiCommentarySetupFailed = false;
const effectProfileCache = new Map();

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
  setAiCommentaryText(aiCommentaryEnabled ? "AI実況待機中。スタートで解析を開始します。" : "AI実況はOFFです。タイトル画面からONにできます。");
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
  aiLanePressureLogged = false;
  aiCommentaryEvents = [];
  setAiCommentaryText(aiCommentaryEnabled ? "開幕。最初の一手を観測中..." : "AI実況はOFFです。タイトル画面からONにできます。");
  scoreEl.textContent = String(score);
  timeEl.textContent = String(remaining);
  messageEl.textContent = "泡をできるだけ多く割ろう";
  resultTitleEl.textContent = "";
  resetComboState();
  hideResultScreen();
  setStartOverlayVisible(false);
  startButtonEl.disabled = true;
  startButtonEl.textContent = "プレイ中...";
  resetStage();
  beginLanePressureLoop();
  beginAiCommentaryLoop();
  playTone(740, 0.08, "square", 0.05);

  timerId = setInterval(() => {
    remaining -= 1;
    timeEl.textContent = String(remaining);
    if (remaining === 20 || remaining === 10 || remaining === 5) {
      recordAiCommentaryEvent("time", { remaining });
    }
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
  stopAiCommentaryLoop();
  stopLanePressureLoop();
  setLanePressure(0);
  timerId = null;
  spawnId = null;
  dangerSpawnId = null;
  resetComboState();
  startButtonEl.disabled = false;
  startButtonEl.textContent = "もう一回遊ぶ";
  setStartOverlayVisible(true);
  const rank = titleByScore(score);
  messageEl.textContent = `終了! ${playerName} のスコア: ${score}`;
  if (aiCommentaryEnabled) {
    setAiCommentaryText(`AI総評: ${buildResultAiSummary(rank)}`);
  }
  resultTitleEl.textContent = `称号: ${rank}`;
  showResultScreen(rank);
  playTone(330, 0.12, "triangle", 0.07);
}

function backToTitle() {
  if (running) {
    clearInterval(timerId);
    clearInterval(spawnId);
    clearInterval(dangerSpawnId);
    stopAiCommentaryLoop();
    stopLanePressureLoop();
    timerId = null;
    spawnId = null;
    dangerSpawnId = null;
    running = false;
  }

  score = 0;
  remaining = GAME_SECONDS;
  resetComboState();
  resetStage();
  setLanePressure(0);
  startButtonEl.disabled = false;
  startButtonEl.textContent = "スタート";
  setStartOverlayVisible(true);
  setAiCommentaryText(aiCommentaryEnabled ? "タイトルへ戻りました。次の実況準備OK。" : "AI実況はOFFです。タイトル画面からONにできます。");
  resultTitleEl.textContent = "";
  showTitleScreen();
}

function setStartOverlayVisible(visible) {
  if (visible) {
    startOverlayEl.classList.remove("hidden");
    startOverlayEl.setAttribute("aria-hidden", "false");
    stageEl.classList.add("stage-idle");
    return;
  }

  startOverlayEl.classList.add("hidden");
  startOverlayEl.setAttribute("aria-hidden", "true");
  stageEl.classList.remove("stage-idle");
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
  const hitProfile = selectedElement ? getElementHitProfile(selectedElement) : null;

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
    const palette = buildElementPalette(selectedElement, hitProfile);
    const pattern = hitProfile?.pattern || "halo";
    bubbleEl.classList.add("bubble-element-themed", `bubble-element-pattern-${pattern}`);
    bubbleEl.style.setProperty("--element-hue", String(palette.hue));
    bubbleEl.style.setProperty("--element-bubble-top", palette.bubbleTop);
    bubbleEl.style.setProperty("--element-bubble-mid", palette.bubbleMid);
    bubbleEl.style.setProperty("--element-bubble-bottom", palette.bubbleBottom);
    bubbleEl.style.setProperty("--element-aura-soft", palette.auraSoft);
    bubbleEl.style.setProperty("--element-aura-strong", palette.auraStrong);
    bubbleEl.style.setProperty("--element-label-color", palette.labelColor);
    bubbleEl.style.setProperty("--element-label-glow", palette.labelGlow);

    const auraEl = document.createElement("span");
    auraEl.className = "bubble-element-aura";
    auraEl.setAttribute("aria-hidden", "true");
    bubbleEl.appendChild(auraEl);

    const flareEl = document.createElement("span");
    flareEl.className = "bubble-element-flare";
    flareEl.setAttribute("aria-hidden", "true");
    bubbleEl.appendChild(flareEl);

    const labelEl = document.createElement("span");
    labelEl.className = `bubble-element-label label-pattern-${pattern} label-enter-${pattern}`;

    const symbolEl = document.createElement("span");
    symbolEl.className = "bubble-element-symbol";
    symbolEl.textContent = selectedElement.symbol;

    const numberEl = document.createElement("span");
    numberEl.className = "bubble-element-number";
    numberEl.textContent = String(selectedElement.number);

    labelEl.appendChild(symbolEl);
    labelEl.appendChild(numberEl);
    bubbleEl.appendChild(labelEl);
  }

  bubbleEl.addEventListener("click", () => {
    if (!running) {
      return;
    }

    if (isDangerBubble) {
      resetComboState();
      recordAiCommentaryEvent("danger-hit", {});
      triggerDangerHitEffect(bubbleEl, size);
      clearBubblesWithoutScoring(bubbleEl);
      bubbleEl.classList.add("pop");
      setTimeout(() => {
        bubbleEl.remove();
      }, 180);
      return;
    }

    const safeHitProfile = hitProfile || getElementHitProfile(selectedElement);
    createBurstEffect(bubbleEl, size, safeHitProfile);
    if (selectedElement) {
      createLabelGlyphBurst(bubbleEl, selectedElement, safeHitProfile);
      updateComboState(selectedElement.symbol);
      if (comboStreak >= 2) {
        recordAiCommentaryEvent("combo", { symbol: selectedElement.symbol, streak: comboStreak });
        triggerComboChainEffect(selectedElement, comboStreak, bubbleEl, safeHitProfile);
      }
    }
    triggerElementHitEffect(safeHitProfile, bubbleEl);
    const gainedScore = selectedElement ? selectedElement.number : 1;
    score += gainedScore;
    recordAiCommentaryEvent("hit", {
      symbol: selectedElement ? selectedElement.symbol : "",
      gainedScore,
      score,
      remaining,
    });
    scoreEl.textContent = String(score);
    if (selectedElement) {
      const comboSuffix = comboStreak >= 2 ? ` / ${selectedElement.symbol} CHAIN x${comboStreak}` : "";
      messageEl.textContent = `${selectedElement.name} (${selectedElement.symbol}) +${gainedScore} [${safeHitProfile.categoryLabel}]${comboSuffix}`;
    }
    playElementHitSound(safeHitProfile);
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

function toHsla(hue, sat, light, alpha) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const normalizedSat = Math.min(100, Math.max(0, sat));
  const normalizedLight = Math.min(100, Math.max(0, light));
  return `hsla(${Math.round(normalizedHue)}, ${normalizedSat}%, ${normalizedLight}%, ${alpha})`;
}

function shiftAwayFromDangerHue(hue) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  if (normalizedHue <= 24 || normalizedHue >= 336) {
    return (normalizedHue + 48) % 360;
  }
  return normalizedHue;
}

function getElementSemanticHue(element) {
  if (!element) {
    return 198;
  }
  const trait = ELEMENT_MEANING_TRAITS[element.symbol] || {};
  const fallbackHue = typeof element.hue === "number" ? element.hue : 198;
  const semanticHue = typeof trait.semanticHue === "number" ? trait.semanticHue : fallbackHue;
  return shiftAwayFromDangerHue(semanticHue);
}

function buildElementPalette(element, hitProfile) {
  const semanticHue = getElementSemanticHue(element);
  const saturation = Math.round(68 + (element?.sat || 0.4) * 30);
  const lightness = Math.round(42 + (element?.light || 0.5) * 30);
  const symbolLightness = Math.max(18, Math.round(lightness * 0.28));

  return {
    hue: semanticHue,
    bubbleTop: toHsla(semanticHue + 14, Math.min(100, saturation + 20), 98, 0.98),
    bubbleMid: toHsla(semanticHue + 3, Math.min(100, saturation + 12), Math.min(92, lightness + 22), 0.84),
    bubbleBottom: toHsla(semanticHue - 10, Math.min(100, saturation + 16), Math.max(34, lightness - 8), 0.96),
    auraSoft: toHsla(semanticHue + 2, Math.min(100, saturation + 8), Math.min(92, lightness + 18), 0.62),
    auraStrong: hitProfile?.ringGlow || toHsla(semanticHue - 4, Math.min(100, saturation + 10), Math.max(36, lightness - 6), 0.62),
    labelColor: toHsla(semanticHue + 6, Math.min(100, saturation + 20), symbolLightness, 0.98),
    labelGlow: hitProfile?.pieceGlow || toHsla(semanticHue - 8, Math.min(100, saturation + 16), Math.min(82, lightness + 4), 0.84),
    chipBg: toHsla(semanticHue + 2, Math.min(100, saturation + 10), Math.min(86, lightness + 8), 0.24),
    chipBorder: toHsla(semanticHue - 4, Math.min(100, saturation + 12), Math.min(90, lightness + 16), 0.56),
    chipText: toHsla(semanticHue + 10, Math.min(100, saturation + 24), 92, 0.98),
  };
}

function buildGeneratedElementHitProfile(element) {
  const trait = ELEMENT_MEANING_TRAITS[element.symbol] || {};
  const patternIndex = (element.number + element.symbol.length) % EFFECT_PROFILE_PATTERNS.length;
  const pattern = trait.pattern || EFFECT_PROFILE_PATTERNS[patternIndex];
  const hueShift = (element.number * 17 + element.symbol.charCodeAt(0)) % 48;
  const rawBaseHue = typeof trait.semanticHue === "number" ? trait.semanticHue : (element.hue + hueShift) % 360;
  const baseHue = shiftAwayFromDangerHue(rawBaseHue);
  const brightnessFactor = 0.8 + (element.light - 0.5) * 0.32;
  const toneBase = Math.max(220, 420 + baseHue * 1.62 + element.number * 3.8 + (trait.toneShift || 0));
  const toneTypeIndex = (element.number + Math.round(element.sat * 10)) % EFFECT_PROFILE_WAVE_TYPES.length;
  const toneTypeA = EFFECT_PROFILE_WAVE_TYPES[toneTypeIndex];
  const toneTypeB = EFFECT_PROFILE_WAVE_TYPES[(toneTypeIndex + 1) % EFFECT_PROFILE_WAVE_TYPES.length];
  const ringCount = Math.max(1, Math.min(4, 1 + (element.number % 3) + (trait.ringBoost || 0)));
  const ringScale = 0.58 + ((element.number * 5) % 13) * 0.04;
  const pieceCount = Math.max(6, Math.min(18, 8 + (element.number % 8) + (trait.pieceBoost || 0)));
  const stageFlashMs = Math.max(210, 240 + (element.number % 4) * 34 + (trait.flashBoost || 0));

  return {
    categoryLabel: `${element.name}${trait.motif ? ` ${trait.motif}` : " エフェクト"}`,
    pattern,
    ringCount,
    ringScale,
    ringDurationMs: 280 + (element.number % 5) * 45,
    pieceCount,
    pieceDistanceScale: 0.88 + (element.number % 6) * 0.13,
    pieceLiftScale: 0.65 + (element.number % 5) * 0.16,
    pieceDurationMs: 380 + (element.number % 7) * 28,
    stageFlashMs,
    stageBorderColor: toHsla(shiftAwayFromDangerHue(baseHue + 8), 94, 82 * brightnessFactor, 0.96),
    stageGlowColor: toHsla(shiftAwayFromDangerHue(baseHue - 6), 92, 54 * brightnessFactor, 0.38),
    stageOverlayA: toHsla(shiftAwayFromDangerHue(baseHue + 2), 96, 72 * brightnessFactor, 0.72),
    stageOverlayB: toHsla(shiftAwayFromDangerHue(baseHue - 14), 90, 48 * brightnessFactor, 0.22),
    ringColor: toHsla(shiftAwayFromDangerHue(baseHue + 4), 96, 86 * brightnessFactor, 0.98),
    ringGlow: toHsla(shiftAwayFromDangerHue(baseHue - 8), 92, 60 * brightnessFactor, 0.7),
    pieceCore: toHsla(shiftAwayFromDangerHue(baseHue + 8), 100, 96 * brightnessFactor, 0.98),
    pieceEdge: toHsla(shiftAwayFromDangerHue(baseHue - 6), 96, 68 * brightnessFactor, 0.9),
    pieceGlow: toHsla(shiftAwayFromDangerHue(baseHue - 14), 100, 72 * brightnessFactor, 0.8),
    tones: [
      { frequency: toneBase, duration: 0.034, type: toneTypeA, gain: 0.024, delayMs: 0 },
      { frequency: toneBase * (1.16 + (element.number % 3) * 0.07), duration: 0.03, type: toneTypeB, gain: 0.018, delayMs: 28 },
      { frequency: toneBase * (0.86 + (element.number % 4) * 0.05), duration: 0.045, type: "sine", gain: 0.014, delayMs: 66 },
    ],
  };
}

function getElementHitProfile(element) {
  if (!element || !element.symbol) {
    return refineHitProfileForElegance({
      categoryLabel: "元素エフェクト",
      pattern: "halo",
      ringCount: 1,
      ringScale: 0.72,
      ringDurationMs: 320,
      pieceCount: BURST_PIECE_COUNT,
      pieceDistanceScale: 1,
      pieceLiftScale: 1,
      pieceDurationMs: 460,
      stageFlashMs: 260,
      stageBorderColor: "rgba(166, 233, 255, 0.9)",
      stageGlowColor: "rgba(112, 209, 255, 0.24)",
      stageOverlayA: "rgba(187, 241, 255, 0.7)",
      stageOverlayB: "rgba(87, 191, 255, 0.2)",
      ringColor: "rgba(214, 246, 255, 0.95)",
      ringGlow: "rgba(148, 233, 255, 0.48)",
      pieceCore: "rgba(255, 255, 255, 0.96)",
      pieceEdge: "rgba(122, 199, 255, 0.78)",
      pieceGlow: "rgba(178, 231, 255, 0.72)",
      tones: [{ frequency: 960, duration: 0.045, type: "sine", gain: 0.03, delayMs: 0 }],
    });
  }

  if (effectProfileCache.has(element.symbol)) {
    return effectProfileCache.get(element.symbol);
  }

  const generated = buildGeneratedElementHitProfile(element);
  const override = ELEMENT_EFFECT_OVERRIDES[element.symbol] || {};
  const merged = refineHitProfileForElegance({
    ...generated,
    ...override,
    tones: override.tones || generated.tones,
  });
  effectProfileCache.set(element.symbol, merged);
  return merged;
}

function refineHitProfileForElegance(profile) {
  const ringCount = Math.max(1, Math.min(2, profile.ringCount || 1));
  const ringDurationMs = Math.max(360, Math.min(820, Math.round((profile.ringDurationMs || 320) * 1.28)));
  const pieceCount = Math.max(5, Math.min(9, profile.pieceCount || BURST_PIECE_COUNT));
  const pieceDistanceScale = Math.max(0.52, Math.min(0.86, (profile.pieceDistanceScale || 1) * 0.58));
  const pieceLiftScale = Math.max(0.26, Math.min(0.6, (profile.pieceLiftScale || 1) * 0.46));
  const pieceDurationMs = Math.max(620, Math.min(980, Math.round((profile.pieceDurationMs || 460) * 1.34)));
  const stageFlashMs = Math.max(200, Math.min(300, Math.round((profile.stageFlashMs || 260) * 0.72)));
  const tones = Array.isArray(profile.tones)
    ? profile.tones.map((tone) => ({
        ...tone,
        gain: typeof tone.gain === "number" ? Math.max(0.008, tone.gain * 0.86) : tone.gain,
      }))
    : profile.tones;

  return {
    ...profile,
    ringCount,
    ringDurationMs,
    pieceCount,
    pieceDistanceScale,
    pieceLiftScale,
    pieceDurationMs,
    stageFlashMs,
    tones,
  };
}

function triggerElementHitEffect(hitProfile, bubbleEl) {
  const patternClass = "stage-hit-pattern-halo";
  const stagePatternClasses = EFFECT_PROFILE_PATTERNS.map((pattern) => `stage-hit-pattern-${pattern}`);

  let hitX = "50%";
  let hitY = "50%";
  if (bubbleEl) {
    const bubbleRect = bubbleEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();
    const localX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
    const localY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;
    const xPercent = Math.min(96, Math.max(4, (localX / stageRect.width) * 100));
    const yPercent = Math.min(96, Math.max(4, (localY / stageRect.height) * 100));
    hitX = `${xPercent}%`;
    hitY = `${yPercent}%`;
  }

  stageEl.style.setProperty("--hit-border-color", hitProfile.stageBorderColor);
  stageEl.style.setProperty("--hit-glow-color", hitProfile.stageGlowColor);
  stageEl.style.setProperty("--hit-overlay-a", hitProfile.stageOverlayA);
  stageEl.style.setProperty("--hit-overlay-b", hitProfile.stageOverlayB);
  stageEl.style.setProperty("--hit-flash-duration", `${hitProfile.stageFlashMs || 260}ms`);
  stageEl.style.setProperty("--hit-x", hitX);
  stageEl.style.setProperty("--hit-y", hitY);

  stageEl.classList.remove("stage-element-hit", ...stagePatternClasses);
  void stageEl.offsetWidth;
  stageEl.classList.add("stage-element-hit", patternClass);

  if (stageElementHitTimeoutId !== null) {
    clearTimeout(stageElementHitTimeoutId);
  }

  stageElementHitTimeoutId = setTimeout(() => {
    stageEl.classList.remove("stage-element-hit", patternClass);
    stageElementHitTimeoutId = null;
  }, hitProfile.stageFlashMs || 260);
}

function playElementHitSound(hitProfile) {
  if (!hitProfile || !Array.isArray(hitProfile.tones)) {
    playTone(960, 0.045, "sine", 0.03);
    return;
  }

  for (const tone of hitProfile.tones) {
    const delayMs = typeof tone.delayMs === "number" ? tone.delayMs : 0;
    setTimeout(() => {
      playTone(tone.frequency, tone.duration, tone.type, tone.gain);
    }, delayMs);
  }
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
  activeBurstPieces = 0;
  activeLabelGlyphPieces = 0;
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

  if (lanePressureRatio > 0.01 && !aiLanePressureLogged) {
    aiLanePressureLogged = true;
    recordAiCommentaryEvent("lane-pressure", { remaining });
  }

  if (lanePressureRatio > 0.01) {
    messageEl.textContent = "左右から壁が迫る! 中央レーンを狙おう";
  } else if (running) {
    messageEl.textContent = "泡をできるだけ多く割ろう";
  }
}

function createBurstEffect(bubbleEl, bubbleSize, hitProfile) {
  if (activeBurstPieces >= MAX_ACTIVE_BURST_PIECES) {
    return;
  }

  const bubbleRect = bubbleEl.getBoundingClientRect();
  const stageRect = stageEl.getBoundingClientRect();
  const centerX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
  const centerY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;

  const safeProfile = hitProfile || getElementHitProfile(null);
  const ringCount = Math.max(1, Math.min(4, safeProfile.ringCount || 1));
  const ringDurationMs = Math.max(200, safeProfile.ringDurationMs || 320);

  for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
    const ringEl = document.createElement("span");
    const ringScaleMultiplier = (safeProfile.ringScale || 0.72) + ringIndex * 0.09;

    ringEl.className = "pop-ring";
    ringEl.style.left = `${Math.round(centerX)}px`;
    ringEl.style.top = `${Math.round(centerY)}px`;
    ringEl.style.setProperty("--ring-size", `${Math.round(bubbleSize * ringScaleMultiplier)}px`);
    ringEl.style.setProperty("--ring-color", safeProfile.ringColor);
    ringEl.style.setProperty("--ring-glow", safeProfile.ringGlow);
    ringEl.style.setProperty("--ring-duration", `${ringDurationMs}ms`);
    ringEl.style.animationDelay = `${ringIndex * 56}ms`;
    ringEl.addEventListener(
      "animationend",
      () => {
        ringEl.remove();
      },
      { once: true }
    );
    stageEl.appendChild(ringEl);
  }

  const requestedPieceCount = Math.max(6, Math.min(18, safeProfile.pieceCount || BURST_PIECE_COUNT));
  const availablePieceCount = Math.min(requestedPieceCount, MAX_ACTIVE_BURST_PIECES - activeBurstPieces);
  if (availablePieceCount <= 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  activeBurstPieces += availablePieceCount;

  for (let index = 0; index < availablePieceCount; index += 1) {
    const pieceEl = document.createElement("span");
    const angle = (Math.PI * 2 * index) / availablePieceCount + Math.random() * 0.22;
    const distance = randomInRange(Math.round(bubbleSize * 0.24), Math.round(bubbleSize * (safeProfile.pieceDistanceScale || 0.86)));
    const arcLift = randomInRange(2, Math.round(12 * (safeProfile.pieceLiftScale || 0.6)));
    const targetX = Math.round(Math.cos(angle) * distance);
    const targetY = Math.round(Math.sin(angle) * distance - arcLift * 0.42);
    const driftX = randomInRange(-3, 3);
    const driftY = randomInRange(-4, 3);

    pieceEl.className = `burst-piece burst-piece-${safeProfile.pattern || "halo"}`;
    pieceEl.style.left = `${Math.round(centerX)}px`;
    pieceEl.style.top = `${Math.round(centerY)}px`;
    pieceEl.style.setProperty("--tx-mid", `${Math.round(targetX * 0.34)}px`);
    pieceEl.style.setProperty("--ty-mid", `${Math.round(targetY * 0.34)}px`);
    pieceEl.style.setProperty("--tx-end", `${Math.round(targetX * 0.42 + driftX)}px`);
    pieceEl.style.setProperty("--ty-end", `${Math.round(targetY * 0.42 + driftY)}px`);
    pieceEl.style.setProperty("--rot", `${randomInRange(-220, 220)}deg`);
    pieceEl.style.setProperty("--size", `${randomInRange(2, 5)}px`);
    pieceEl.style.setProperty("--burst-core", safeProfile.pieceCore);
    pieceEl.style.setProperty("--burst-edge", safeProfile.pieceEdge);
    pieceEl.style.setProperty("--burst-glow", safeProfile.pieceGlow);
    pieceEl.style.setProperty("--burst-duration", `${safeProfile.pieceDurationMs || 460}ms`);

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

function resetComboState() {
  comboElementSymbol = "";
  comboStreak = 0;
  stageEl.classList.remove("stage-combo-hit");
  if (stageComboHitTimeoutId !== null) {
    clearTimeout(stageComboHitTimeoutId);
    stageComboHitTimeoutId = null;
  }
}

function updateComboState(elementSymbol) {
  if (!elementSymbol) {
    resetComboState();
    return;
  }

  if (comboElementSymbol === elementSymbol) {
    comboStreak += 1;
    return;
  }

  comboElementSymbol = elementSymbol;
  comboStreak = 1;
}

function triggerComboChainEffect(element, streak, bubbleEl, hitProfile) {
  if (!bubbleEl || !element || streak < 2) {
    return;
  }

  const stageRect = stageEl.getBoundingClientRect();
  const bubbleRect = bubbleEl.getBoundingClientRect();
  const centerX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
  const centerY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;
  const palette = buildElementPalette(element, hitProfile);

  const badgeEl = document.createElement("span");
  badgeEl.className = "combo-chain-badge";
  badgeEl.style.left = `${Math.round(centerX)}px`;
  badgeEl.style.top = `${Math.round(centerY)}px`;
  badgeEl.style.setProperty("--combo-text-color", palette.chipText);
  badgeEl.style.setProperty("--combo-glow", palette.labelGlow);
  badgeEl.textContent = `${element.symbol} CHAIN x${streak}`;
  badgeEl.addEventListener(
    "animationend",
    () => {
      badgeEl.remove();
    },
    { once: true }
  );
  stageEl.appendChild(badgeEl);

  stageEl.style.setProperty("--combo-hit-color", palette.labelGlow);
  stageEl.classList.remove("stage-combo-hit");
  void stageEl.offsetWidth;
  stageEl.classList.add("stage-combo-hit");

  if (stageComboHitTimeoutId !== null) {
    clearTimeout(stageComboHitTimeoutId);
  }

  stageComboHitTimeoutId = setTimeout(() => {
    stageEl.classList.remove("stage-combo-hit");
    stageComboHitTimeoutId = null;
  }, 320);

  if (streak >= 3) {
    playTone(1040 + streak * 22, 0.045, "triangle", 0.024);
  }
}

function createLabelGlyphBurst(bubbleEl, element, hitProfile) {
  if (!bubbleEl || !element || activeLabelGlyphPieces >= MAX_ACTIVE_LABEL_GLYPH_PIECES) {
    return;
  }

  const glyphText = `${element.symbol}${element.number}`;
  const glyphs = glyphText.split("");
  if (!glyphs.length) {
    return;
  }

  const stageRect = stageEl.getBoundingClientRect();
  const bubbleRect = bubbleEl.getBoundingClientRect();
  const centerX = bubbleRect.left - stageRect.left + bubbleRect.width / 2;
  const centerY = bubbleRect.top - stageRect.top + bubbleRect.height / 2;
  const allowedCount = Math.min(glyphs.length, MAX_ACTIVE_LABEL_GLYPH_PIECES - activeLabelGlyphPieces);
  if (allowedCount <= 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  activeLabelGlyphPieces += allowedCount;

  for (let index = 0; index < allowedCount; index += 1) {
    const glyphEl = document.createElement("span");
    const angle = (Math.PI * 2 * index) / allowedCount + Math.random() * 0.38;
    const distance = randomInRange(16, 36);
    const targetX = Math.round(Math.cos(angle) * distance);
    const targetY = Math.round(Math.sin(angle) * distance - randomInRange(8, 16));

    glyphEl.className = `label-glyph-piece glyph-pattern-${hitProfile?.pattern || "halo"}`;
    glyphEl.textContent = glyphs[index];
    glyphEl.style.left = `${Math.round(centerX)}px`;
    glyphEl.style.top = `${Math.round(centerY)}px`;
    glyphEl.style.setProperty("--glyph-tx", `${targetX}px`);
    glyphEl.style.setProperty("--glyph-ty", `${targetY}px`);
    glyphEl.style.setProperty("--glyph-rot", `${randomInRange(-140, 140)}deg`);
    glyphEl.style.setProperty("--glyph-color", hitProfile?.pieceCore || "rgba(239, 251, 255, 0.94)");
    glyphEl.style.setProperty("--glyph-glow", hitProfile?.pieceGlow || "rgba(145, 222, 255, 0.74)");

    glyphEl.addEventListener(
      "animationend",
      () => {
        activeLabelGlyphPieces = Math.max(0, activeLabelGlyphPieces - 1);
        glyphEl.remove();
      },
      { once: true }
    );

    fragment.appendChild(glyphEl);
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
    const hitProfile = getElementHitProfile(element);
    const palette = buildElementPalette(element, hitProfile);

    itemEl.className = "element-list-item";
    itemEl.style.setProperty("--element-chip-bg", palette.chipBg);
    itemEl.style.setProperty("--element-chip-border", palette.chipBorder);
    itemEl.style.setProperty("--element-chip-text", palette.chipText);

    const symbolEl = document.createElement("span");
    symbolEl.className = "element-list-symbol";
    symbolEl.textContent = element.symbol;

    const detailEl = document.createElement("span");
    detailEl.className = "element-list-detail";
    detailEl.textContent = `${element.number}: ${element.name}`;

    itemEl.appendChild(symbolEl);
    itemEl.appendChild(detailEl);
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

  const storedAiCommentary = localStorage.getItem(AI_COMMENTARY_STORAGE_KEY);
  if (storedAiCommentary !== null) {
    aiCommentaryEnabled = storedAiCommentary === "true";
  }

  nicknameInputEl.value = playerName;
  playerNameDisplayEl.textContent = playerName;
  updateSoundButtonLabel();
  updateAiCommentaryToggleLabel();
  setAiCommentaryStatusText();
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

function toggleAiCommentary() {
  aiCommentaryEnabled = !aiCommentaryEnabled;
  localStorage.setItem(AI_COMMENTARY_STORAGE_KEY, String(aiCommentaryEnabled));
  updateAiCommentaryToggleLabel();
  if (aiCommentaryEnabled) {
    aiCommentarySetupFailed = false;
    aiCommentaryLastError = "";
  }
  setAiCommentaryStatusText();

  if (running) {
    if (aiCommentaryEnabled) {
      setAiCommentaryText("AI実況を開始します。");
      warmupAiCommentaryModel();
      beginAiCommentaryLoop();
    } else {
      stopAiCommentaryLoop();
      setAiCommentaryText("AI実況をOFFにしました。");
    }
  } else {
    setAiCommentaryText(aiCommentaryEnabled ? "AI実況はONです。ゲーム開始で実況します。" : "AI実況はOFFです。タイトル画面からONにできます。");
  }
}

function updateSoundButtonLabel() {
  soundToggleButtonEl.textContent = `効果音: ${soundEnabled ? "ON" : "OFF"}`;
}

function updateAiCommentaryToggleLabel() {
  aiCommentaryToggleButtonEl.textContent = `AI実況: ${aiCommentaryEnabled ? "ON" : "OFF"}`;
  aiCommentaryToggleButtonEl.classList.toggle("is-active", aiCommentaryEnabled);
}

function setAiCommentaryStatusText() {
  if (!aiCommentaryEnabled) {
    aiCommentaryStatusEl.textContent = "ローカルLLM実況はOFFです。";
    return;
  }

  if (!isBrowserLocalLlmRuntimeSupported()) {
    aiCommentaryStatusEl.textContent = "ローカルLLMは file:// では使えません。http://localhost で開いてください（フォールバック実況を継続）。";
    return;
  }

  if (aiCommentaryModelReady) {
    aiCommentaryStatusEl.textContent = `ローカルLLM実況はONです（ブラウザ内推論: ${aiCommentaryActiveModel}）。`;
    return;
  }

  if (aiCommentaryLastError) {
    aiCommentaryStatusEl.textContent = `ローカルLLM準備失敗: ${aiCommentaryLastError}（フォールバック実況を継続）`;
    return;
  }

  if (aiCommentaryPipelinePromise) {
    aiCommentaryStatusEl.textContent = "ローカルLLM準備中: 現在モデル取得の通信中です（初回のみ）。";
    return;
  }

  aiCommentaryStatusEl.textContent = "ローカルLLMはONです。通信はまだ開始していません。ゲーム開始時に準備を開始します（初回のみ通信）。";
}

function isBrowserLocalLlmRuntimeSupported() {
  return window.location.protocol !== "file:";
}

function setAiCommentaryText(nextText) {
  if (!nextText) {
    return;
  }
  aiCommentaryEl.textContent = `実況: ${nextText}`;
}

function recordAiCommentaryEvent(type, payload) {
  const event = {
    type,
    at: Date.now(),
    remaining,
    score,
    ...payload,
  };

  aiCommentaryEvents.push(event);
  trimAiCommentaryEvents(event.at);
}

function trimAiCommentaryEvents(now = Date.now()) {
  const minAt = now - AI_COMMENTARY_EVENT_WINDOW_MS;
  aiCommentaryEvents = aiCommentaryEvents.filter((event) => event.at >= minAt);
}

function beginAiCommentaryLoop() {
  stopAiCommentaryLoop();
  if (!aiCommentaryEnabled || !running) {
    return;
  }

  warmupAiCommentaryModel();

  aiCommentaryTickId = setInterval(() => {
    requestAiCommentaryUpdate();
  }, AI_COMMENTARY_INTERVAL_MS);

  setTimeout(() => {
    if (running && aiCommentaryEnabled) {
      requestAiCommentaryUpdate();
    }
  }, 1600);
}

function stopAiCommentaryLoop() {
  if (aiCommentaryTickId !== null) {
    clearInterval(aiCommentaryTickId);
    aiCommentaryTickId = null;
  }
  aiCommentaryRequestInFlight = false;
}

async function warmupAiCommentaryModel() {
  if (!aiCommentaryEnabled) {
    return null;
  }

  if (!isBrowserLocalLlmRuntimeSupported()) {
    aiCommentaryModelReady = false;
    aiCommentarySetupFailed = true;
    aiCommentaryLastError = "file:// ではブラウザ内モデルを起動できません";
    setAiCommentaryStatusText();
    return null;
  }

  if (aiCommentarySetupFailed) {
    return null;
  }

  try {
    const generator = await getAiCommentaryPipeline();
    aiCommentaryModelReady = Boolean(generator);
    aiCommentaryLastError = "";
    setAiCommentaryStatusText();
    return generator;
  } catch (error) {
    aiCommentaryModelReady = false;
    aiCommentarySetupFailed = true;
    const reason = error instanceof Error ? error.message : String(error || "unknown");
    aiCommentaryLastError = `ブラウザ内モデルの読み込みに失敗 (${reason.slice(0, 88)})`;
    setAiCommentaryStatusText();
    throw error;
  }
}

function summarizeAiCommentaryEvents() {
  trimAiCommentaryEvents();

  let hits = 0;
  let dangerHits = 0;
  let totalGain = 0;
  let comboMax = 0;
  let lanePressureSeen = false;
  let latestSymbol = "";

  for (const event of aiCommentaryEvents) {
    if (event.type === "hit") {
      hits += 1;
      totalGain += Number(event.gainedScore || 0);
      latestSymbol = event.symbol || latestSymbol;
    }
    if (event.type === "danger-hit") {
      dangerHits += 1;
    }
    if (event.type === "combo") {
      comboMax = Math.max(comboMax, Number(event.streak || 0));
    }
    if (event.type === "lane-pressure") {
      lanePressureSeen = true;
    }
  }

  return {
    hits,
    dangerHits,
    totalGain,
    comboMax,
    lanePressureSeen,
    latestSymbol,
    remaining,
    score,
  };
}

async function requestAiCommentaryUpdate() {
  if (!running || !aiCommentaryEnabled || aiCommentaryRequestInFlight) {
    return;
  }

  const summary = summarizeAiCommentaryEvents();
  if (summary.hits === 0 && summary.dangerHits === 0) {
    return;
  }

  if (aiCommentarySetupFailed) {
    const fallbackCommentary = createFallbackCommentary(summary);
    if (fallbackCommentary !== lastAiCommentaryText) {
      setAiCommentaryText(fallbackCommentary);
      lastAiCommentaryText = fallbackCommentary;
    }
    return;
  }

  aiCommentaryRequestInFlight = true;
  try {
    const llmCommentary = await createLocalLlmCommentary(summary);
    const safeCommentary = sanitizeAiCommentary(llmCommentary);
    if (safeCommentary && safeCommentary !== lastAiCommentaryText) {
      setAiCommentaryText(safeCommentary);
      lastAiCommentaryText = safeCommentary;
      return;
    }
  } catch (error) {
    aiCommentaryModelReady = false;
    const reason = error instanceof Error ? error.message : String(error || "unknown");
    aiCommentaryLastError = `ブラウザ内モデルの実行に失敗 (${reason.slice(0, 88)})`;
    setAiCommentaryStatusText();
  } finally {
    aiCommentaryRequestInFlight = false;
  }

  const fallbackCommentary = createFallbackCommentary(summary);
  if (fallbackCommentary !== lastAiCommentaryText) {
    setAiCommentaryText(fallbackCommentary);
    lastAiCommentaryText = fallbackCommentary;
  }
}

async function createLocalLlmCommentary(summary) {
  const prompt = [
    "あなたはテンポの良いゲーム実況AIです。",
    "次の情報を使って、短い日本語の実況を1文だけ返してください。",
    "命令:",
    "- 22文字以内",
    "- 句点は1つまで",
    "- 上から目線禁止",
    "- アドバイス寄り",
    `状況: score=${summary.score}, remaining=${summary.remaining}, hits=${summary.hits}, dangerHits=${summary.dangerHits}, comboMax=${summary.comboMax}, gain=${summary.totalGain}, latestSymbol=${summary.latestSymbol || "none"}, lanePressure=${summary.lanePressureSeen}`,
  ].join("\n");

  const generator = await warmupAiCommentaryModel();
  if (!generator) {
    throw new Error("local-model-not-ready");
  }

  const outputs = await generator(prompt, {
    max_new_tokens: 44,
    do_sample: true,
    temperature: 0.7,
    top_p: 0.9,
    repetition_penalty: 1.05,
    return_full_text: false,
  });

  const generatedText = extractGeneratedText(outputs);
  if (!generatedText) {
    throw new Error("local-model-empty-response");
  }

  return generatedText;
}

async function getAiCommentaryPipeline() {
  if (aiCommentaryPipeline) {
    return aiCommentaryPipeline;
  }

  if (aiCommentaryPipelinePromise) {
    return aiCommentaryPipelinePromise;
  }

  aiCommentaryPipelinePromise = (async () => {
    const module = await import(AI_COMMENTARY_TRANSFORMERS_JS_URL);
    const pipelineFactory = module.pipeline;
    const envConfig = module.env;
    if (!pipelineFactory) {
      throw new Error("transformers-pipeline-not-found");
    }

    if (envConfig) {
      envConfig.allowRemoteModels = true;
      envConfig.allowLocalModels = false;
      envConfig.useBrowserCache = true;
    }

    const setupErrors = [];
    for (const candidate of AI_COMMENTARY_MODEL_CANDIDATES) {
      const modelName = candidate.name;
      try {
        const generator = await pipelineFactory("text-generation", modelName, {
          quantized: candidate.quantized,
        });
        aiCommentaryActiveModel = modelName;
        aiCommentaryPipeline = generator;
        return generator;
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error || "unknown");
        setupErrors.push(`${modelName}: ${reason}`);
      }
    }

    throw new Error(setupErrors.join(" | "));
  })();

  setAiCommentaryStatusText();

  try {
    return await aiCommentaryPipelinePromise;
  } finally {
    aiCommentaryPipelinePromise = null;
  }
}

function extractGeneratedText(outputs) {
  if (typeof outputs === "string") {
    return outputs;
  }

  if (Array.isArray(outputs) && outputs.length > 0) {
    const firstOutput = outputs[0];
    if (typeof firstOutput === "string") {
      return firstOutput;
    }
    if (firstOutput && typeof firstOutput.generated_text === "string") {
      return firstOutput.generated_text;
    }
  }

  if (outputs && typeof outputs.generated_text === "string") {
    return outputs.generated_text;
  }

  return "";
}

function sanitizeAiCommentary(rawCommentary) {
  if (typeof rawCommentary !== "string") {
    return "";
  }

  const normalizedText = rawCommentary
    .replace(/[\r\n]+/g, " ")
    .replace(/["'`]/g, "")
    .trim();

  if (!normalizedText) {
    return "";
  }

  const sanitized = normalizedText.slice(0, 26);
  if (!isNaturalJapaneseCommentary(sanitized)) {
    return "";
  }

  return sanitized;
}

function isNaturalJapaneseCommentary(text) {
  if (!text) {
    return false;
  }

  if (/[{}=<>#@;]/.test(text)) {
    return false;
  }

  if (/\b(true|false|null|undefined|function|return|kill|attack)\b/i.test(text)) {
    return false;
  }

  const jpCharCount = (text.match(/[ぁ-んァ-ン一-龠々ー]/g) || []).length;
  if (jpCharCount < 4) {
    return false;
  }

  const alphaNumCount = (text.match(/[A-Za-z0-9_]/g) || []).length;
  if (alphaNumCount > Math.floor(text.length * 0.35)) {
    return false;
  }

  return true;
}

function createFallbackCommentary(summary) {
  if (summary.dangerHits > 0) {
    return "危険後は中央を取り返そう";
  }
  if (summary.comboMax >= 3 && summary.latestSymbol) {
    return `${summary.latestSymbol}連鎖、維持しよう`;
  }
  if (summary.lanePressureSeen) {
    return "壁が来る、中央レーン優先";
  }
  if (summary.remaining <= 8) {
    return "終盤、確実タップで伸ばそう";
  }

  const genericLines = ["高得点元素を狙っていこう", "視線を絞ると精度が上がる", "次は連鎖を意識してみよう"];
  const line = genericLines[aiFallbackCommentaryCursor % genericLines.length];
  aiFallbackCommentaryCursor += 1;
  return line;
}

function buildResultAiSummary(rank) {
  const summary = summarizeAiCommentaryEvents();
  if (summary.dangerHits > 0) {
    return `${rank}。危険回避でさらに伸びる`;
  }
  if (summary.comboMax >= 3) {
    return `${rank}。連鎖の安定感が強い`;
  }
  return `${rank}。次は終盤の集中が鍵`;
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
aiCommentaryToggleButtonEl.addEventListener("click", toggleAiCommentary);
retryFromResultButtonEl.addEventListener("click", retryFromResult);
resultToTitleButtonEl.addEventListener("click", backToTitle);
photoInputEl.addEventListener("change", handlePhotoInputChanged);
analyzePhotoButtonEl.addEventListener("click", handleAnalyzePhotoClicked);
