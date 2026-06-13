"use strict";

const fs = require("fs");
const vm = require("vm");

class FakeClassList {
  add() {}
  remove() {}
  toggle() {}
  contains() {
    return false;
  }
}

function createFakeElement(id = "") {
  return {
    id,
    value: "",
    checked: false,
    required: false,
    disabled: false,
    hidden: false,
    textContent: "",
    innerHTML: "",
    dataset: {},
    children: [],
    classList: new FakeClassList(),
    style: {
      setProperty() {},
      removeProperty() {}
    },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    replaceChildren(...children) {
      this.children = children;
    },
    querySelector() {
      return createFakeElement();
    },
    getContext() {
      return createFakeCanvasContext();
    }
  };
}

function createFakeCanvasContext() {
  return new Proxy({}, {
    get(target, property) {
      if (!(property in target)) {
        target[property] = typeof property === "string" && property.startsWith("measure")
          ? () => ({ width: 0 })
          : () => {};
      }
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  });
}

const elements = new Map();
const getElement = (id) => {
  if (!elements.has(id)) elements.set(id, createFakeElement(id));
  return elements.get(id);
};

const gameModeInputs = ["couple", "solo"].map((value) => ({
  ...createFakeElement(),
  value,
  checked: value === "couple"
}));

const preferenceInputs = [];
const storage = new Map();

const context = {
  console,
  setTimeout: () => 1,
  clearTimeout() {},
  setInterval: () => 1,
  clearInterval() {},
  requestAnimationFrame: () => 1,
  cancelAnimationFrame() {},
  Audio: function Audio() {
    return {
      loop: false,
      preload: "",
      volume: 0,
      muted: false,
      play: () => Promise.resolve(),
      pause() {},
      addEventListener() {}
    };
  },
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    }
  },
  navigator: {
    vibrate() {},
    serviceWorker: {
      register: () => Promise.resolve()
    },
    clipboard: {
      writeText: () => Promise.resolve()
    }
  },
  document: {
    addEventListener() {},
    getElementById: getElement,
    querySelector(selector) {
      if (selector === ".wheel-shell") return getElement("wheel-shell");
      return createFakeElement();
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="gameMode"]') return gameModeInputs;
      if (selector === "[data-pref-scope]") return preferenceInputs;
      return [];
    },
    createElement: createFakeElement
  },
  window: {}
};

context.window = {
  devicePixelRatio: 1,
  addEventListener() {},
  setTimeout: context.setTimeout,
  clearTimeout: context.clearTimeout,
  setInterval: context.setInterval,
  clearInterval: context.clearInterval,
  requestAnimationFrame: context.requestAnimationFrame,
  cancelAnimationFrame: context.cancelAnimationFrame
};

vm.createContext(context);
vm.runInContext(fs.readFileSync("data/challenges.js", "utf8"), context, { filename: "data/challenges.js" });

const appSource = fs.readFileSync("app.js", "utf8");
const tests = `
function assertSmoke(condition, message) {
  if (!condition) throw new Error(message);
}

assertSmoke(normalizeProgressionMode("short") === "short", "short progression should be valid");
assertSmoke(normalizeProgressionMode("slow") === "slow", "slow progression should be valid");
assertSmoke(normalizeProgressionMode("unknown") === "standard", "invalid progression should fall back to standard");

state.progressionMode = "slow";
startFreshSession({ active: false, progressionMode: "short" });
assertSmoke(state.progressionMode === "short", "fresh session should preserve selected progression mode");

state.gameMode = "solo";
state.partners = [{ name: "Você", preset: "feminine" }];
state.turnIndex = 0;
state.preferences = createDefaultSessionPreferences(state.partners);
state.preferences.limits["Você"].anal = true;

const soloAnalChallenge = {
  id: "smoke-solo-limit",
  mode: "solo",
  rank: 4,
  title: "Teste de limite",
  text: "{actor}, pressione o períneo com calma.",
  seconds: 0
};

assertSmoke(challengeMatchesPreferences(soloAnalChallenge) === false, "solo receiver alias should respect the current profile limits");
state.preferences.limits["Você"].anal = false;
assertSmoke(challengeMatchesPreferences(soloAnalChallenge) === true, "solo challenge should pass once the limit is cleared");

state.gameMode = "couple";
state.partners = [
  { name: "Ana", preset: "feminine" },
  { name: "Leo", preset: "masculine" }
];
assertSmoke(getCoupleSceneImage(1) === "assets/couples/hm/r1.jpg", "mixed couple rank 1 image should exist");
assertSmoke(getCoupleSceneImage(8) === "", "mixed couple rank 8 image should not point to a missing file");

state.partners = [
  { name: "Leo", preset: "masculine" },
  { name: "Rui", preset: "masculine" }
];
assertSmoke(getCoupleSceneImage(1) === "", "same-preset contexts should use fallback images until assets exist");

assertSmoke(getCountdownSoundCue(31) === null, "timer should stay quiet before 30 seconds");
assertSmoke(Boolean(getCountdownSoundCue(30)), "timer should beep at 30 seconds");
assertSmoke(getCountdownSoundCue(24) === null, "timer should not beep every second before 20 seconds");
assertSmoke(getCountdownSoundCue(20).gain > getCountdownSoundCue(30).gain, "timer should intensify at 20 seconds");
assertSmoke(Boolean(getCountdownSoundCue(10)), "timer should beep in the final 10 seconds");
assertSmoke(getCountdownSoundCue(10).gain > getCountdownSoundCue(20).gain, "final 10 seconds should be louder than the 20-second cue");

state.musicMuted = true;
state.musicVolume = 0.5;
assertSmoke(getSoundEffectGain(0.04) === 0, "muted sound should silence effects");
state.musicMuted = false;
state.musicVolume = 0;
assertSmoke(getSoundEffectGain(0.04) === 0, "zero sound volume should silence effects");
state.musicVolume = 0.25;
assertSmoke(Math.abs(getSoundEffectGain(0.04) - 0.02) < 0.001, "sound slider should scale effects volume");

console.log("smoke-test-ok");
`;

vm.runInContext(`${appSource}\n${tests}`, context, { filename: "app.js" });
