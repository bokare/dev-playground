const { GlobalKeyboardListener } = require("node-global-key-listener");
const { spawn, execSync } = require("child_process");
const path = require("path");

// ── Audio ──────────────────────────────────────────────────────────────────
let currentProcess = null;

function stopCurrent() {
  if (currentProcess) {
    currentProcess.kill("SIGKILL");
    currentProcess = null;
  }
  // Also nuke any stray afplay instances by name
  try { execSync("pkill -KILL afplay", { stdio: "ignore" }); } catch (_) {}
}

function play(file) {
  stopCurrent();
  const sound = path.join(__dirname, file);
  console.log("▶", file);
  currentProcess = spawn("afplay", [sound], { stdio: "ignore" });
  currentProcess.on("exit",  () => { currentProcess = null; });
  currentProcess.on("error", () => { currentProcess = null; });
}

// ── Key → note file map ────────────────────────────────────────────────────
// Bottom row (Z-M) : C3 – B3   (low)
// Home row  (A-L)  : C4 – D5   (mid)
// Top row   (Q-P)  : E5 – G6   (high)

const keyMap = {
  Z: "note_Z.wav",  // C3
  X: "note_X.wav",  // D3
  C: "note_C.wav",  // E3
  V: "note_V.wav",  // F3
  B: "note_B.wav",  // G3
  N: "note_N.wav",  // A3
  M: "note_M.wav",  // B3

  A: "note_A.wav",  // C4 middle C
  S: "note_S.wav",  // D4
  D: "note_D.wav",  // E4
  F: "note_F.wav",  // F4
  G: "note_G.wav",  // G4
  H: "note_H.wav",  // A4  440 Hz
  J: "note_J.wav",  // B4
  K: "note_K.wav",  // C5
  L: "note_L.wav",  // D5

  Q: "note_Q.wav",  // E5
  W: "note_W.wav",  // F5
  E: "note_E.wav",  // G5
  R: "note_R.wav",  // A5
  T: "note_T.wav",  // B5
  Y: "note_Y.wav",  // C6
  U: "note_U.wav",  // D6
  I: "note_I.wav",  // E6
  O: "note_O.wav",  // F6
  P: "note_P.wav",  // G6
};

// ── Listener ───────────────────────────────────────────────────────────────
const keyboard = new GlobalKeyboardListener();

// Per-key debounce to silence OS auto-repeat while key is held
const lastFired  = {};
const DEBOUNCE_MS = 80;

keyboard.addListener((e) => {
  if (e.state !== "DOWN") return;

  // e.name is e.g. "A", "S", "LEFT ARROW", etc.
  const key  = e.name?.toUpperCase();
  const file = keyMap[key];
  if (!file) return;

  const now = Date.now();
  if (now - (lastFired[key] || 0) < DEBOUNCE_MS) return;
  lastFired[key] = now;

  play(file);
});

// ── Shutdown ───────────────────────────────────────────────────────────────
process.on("SIGINT", () => {
  stopCurrent();
  process.exit(0);
});

console.log("🎸 Guitar keyboard ready!");
console.log("   Bottom row (Z-M) → low notes  C3–B3");
console.log("   Home row  (A-L)  → mid notes  C4–D5");
console.log("   Top row   (Q-P)  → high notes E5–G6");
console.log("   Ctrl+C to quit\n");
