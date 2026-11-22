(function () {
  "use strict";

  var AUDIO_ROOT = "./assets/audio/";
  var STORAGE_KEY = "kouzi-audio-muted";
  var DEFAULT_BGM_VOLUME = 0.26;
  var DEFAULT_SFX_VOLUME = 0.72;

  var manifest = {
    bgmHub: { src: AUDIO_ROOT + "bgm-hub.mp3", loop: true, volume: 0.22 },
    bgmGame: { src: AUDIO_ROOT + "bgm-game.mp3", loop: true, volume: 0.24 },
    uiHover: { src: AUDIO_ROOT + "ui-hover.mp3", volume: 0.22 },
    uiClick: { src: AUDIO_ROOT + "ui-click.mp3", volume: 0.42 },
    hit: { src: AUDIO_ROOT + "hit-brass.mp3", volume: 0.58 },
    good: { src: AUDIO_ROOT + "success-chime.mp3", volume: 0.38 },
    wrong: { src: AUDIO_ROOT + "wrong.mp3", volume: 0.5 },
    wrongGliss: { src: AUDIO_ROOT + "wrong-gliss.mp3", volume: 0.58 },
    clear: { src: AUDIO_ROOT + "clear-fanfare.mp3", volume: 0.62 },
    combo: { src: AUDIO_ROOT + "success-chime.mp3", volume: 0.52 }
  };

  var cache = {};
  var bgm = null;
  var currentBgmKey = null;
  var context = "hub";
  var initialized = false;
  var unlocked = false;
  var muted = window.localStorage.getItem(STORAGE_KEY) === "true";
  var masterVolume = 1;
  var toggleButton = null;
  var hoverGate = 0;

  function makeAudio(key) {
    var item = manifest[key];
    if (!item) {
      return null;
    }

    var audio = new Audio(item.src);
    audio.preload = "auto";
    audio.loop = !!item.loop;
    audio.volume = computeVolume(item);
    return audio;
  }

  function computeVolume(item) {
    var base = item.loop ? DEFAULT_BGM_VOLUME : DEFAULT_SFX_VOLUME;
    return muted ? 0 : Math.max(0, Math.min(1, masterVolume * base * (item.volume || 1)));
  }

  function preload() {
    Object.keys(manifest).forEach(function (key) {
      if (!cache[key]) {
        cache[key] = makeAudio(key);
      }
      if (bgm && cache[key] === bgm) {
        return;
      }
      if (cache[key] && cache[key].load) {
        try {
          cache[key].load();
        } catch (error) {
          // Loading can fail under file:// before first use; playback path retries.
        }
      }
    });
  }

  function syncDebugState() {
    var root = document.documentElement;
    if (!root) {
      return;
    }
    root.dataset.audioContext = context;
    root.dataset.audioBgm = currentBgmKey || "";
    root.dataset.audioUnlocked = String(unlocked);
    root.dataset.audioMuted = String(muted);
    root.dataset.audioBgmPaused = String(bgm ? bgm.paused : true);
  }

  function play(key, options) {
    var item = manifest[key];
    if (!item || muted) {
      return;
    }

    if (!unlocked) {
      unlocked = true;
    }
    if (!item.loop) {
      playBgm(currentBgmKey || (context === "hub" ? "bgmHub" : "bgmGame"));
    }

    var source = cache[key] || makeAudio(key);
    cache[key] = source;
    var audio = source.cloneNode(true);
    audio.volume = computeVolume(item) * ((options && options.volume) || 1);
    audio.loop = false;

    try {
      audio.currentTime = 0;
      var promise = audio.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    } catch (error) {
      // Non-fatal: audio should never block game input.
    }
  }

  function playBgm(key) {
    if (!manifest[key]) {
      return;
    }

    currentBgmKey = key;
    if (bgm && bgm.datasetKey === key) {
      updateVolumes();
      requestBgmPlayback();
      return;
    }

    stopBgm();
    bgm = cache[key] || makeAudio(key);
    cache[key] = bgm;
    bgm.datasetKey = key;
    bgm.loop = true;
    bgm.volume = computeVolume(manifest[key]);

    requestBgmPlayback();
  }

  function requestBgmPlayback() {
    if (!bgm || muted || !unlocked) {
      return;
    }

    try {
      bgm.volume = computeVolume(manifest[currentBgmKey]);
      var promise = bgm.play();
      if (promise && promise.catch) {
        promise.then(syncDebugState).catch(function () {
          syncDebugState();
        });
      }
    } catch (error) {
      // Non-fatal: browsers may still deny playback until a trusted gesture.
    }
    syncDebugState();
  }

  function stopBgm() {
    if (!bgm) {
      return;
    }
    try {
      bgm.pause();
      bgm.currentTime = 0;
    } catch (error) {}
    bgm = null;
    syncDebugState();
  }

  function updateVolumes() {
    Object.keys(cache).forEach(function (key) {
      if (cache[key]) {
        cache[key].volume = computeVolume(manifest[key]);
      }
    });
    updateToggle();
    syncDebugState();
  }

  function unlock() {
    if (!unlocked) {
      unlocked = true;
    }
    if (!muted) {
      playBgm(currentBgmKey || (context === "hub" ? "bgmHub" : "bgmGame"));
    }
    preload();
    syncDebugState();
  }

  function setMuted(nextMuted) {
    muted = !!nextMuted;
    window.localStorage.setItem(STORAGE_KEY, String(muted));
    updateVolumes();
    if (muted) {
      stopBgm();
      return;
    }
    unlock();
    playBgm(currentBgmKey || (context === "hub" ? "bgmHub" : "bgmGame"));
  }

  function updateToggle() {
    if (!toggleButton) {
      return;
    }
    toggleButton.setAttribute("aria-pressed", String(!muted));
    toggleButton.textContent = muted ? "SOUND OFF" : "SOUND ON";
    toggleButton.title = muted ? "开启音效和背景音乐" : "关闭音效和背景音乐";
    syncDebugState();
  }

  function installToggle() {
    if (toggleButton) {
      updateToggle();
      return;
    }
    toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "audio-toggle";
    toggleButton.addEventListener("click", function (event) {
      event.stopPropagation();
      var next = !muted;
      setMuted(next);
      if (!next) {
        play("uiClick");
      }
    });
    document.body.appendChild(toggleButton);
    updateToggle();
  }

  function bindUiSfx() {
    document.addEventListener("pointerover", function (event) {
      var target = event.target.closest ? event.target.closest("button, a, .position-button, .mode-button") : null;
      if (!target || target.disabled) {
        return;
      }
      var now = Date.now();
      if (now - hoverGate < 70) {
        return;
      }
      hoverGate = now;
      play("uiHover");
    }, true);

    document.addEventListener("click", function (event) {
      var target = event.target.closest ? event.target.closest("button, a, .position-button, .mode-button") : null;
      if (!target || target.disabled || target.classList.contains("audio-toggle")) {
        return;
      }
      play("uiClick");
    }, true);
  }

  function init(options) {
    if (initialized) {
      return;
    }
    initialized = true;
    options = options || {};
    context = options.context || (window.REHEARSAL_GAME_CONFIG ? "game" : "hub");
    currentBgmKey = context === "hub" ? "bgmHub" : "bgmGame";
    preload();
    installToggle();
    bindUiSfx();
    playBgm(currentBgmKey);
    syncDebugState();

    ["pointerdown", "click", "keydown", "touchstart"].forEach(function (eventName) {
      window.addEventListener(eventName, unlock, { once: true, passive: true, capture: true });
    });
  }

  window.AudioManager = {
    init: init,
    preload: preload,
    play: play,
    playBgm: playBgm,
    stopBgm: stopBgm,
    setMuted: setMuted,
    setVolume: function (value) {
      masterVolume = Math.max(0, Math.min(1, Number(value) || 0));
      updateVolumes();
    },
    isMuted: function () {
      return muted;
    },
    getState: function () {
      return {
        context: context,
        currentBgmKey: currentBgmKey,
        unlocked: unlocked,
        muted: muted,
        bgmPaused: bgm ? bgm.paused : true,
        bgmReadyState: bgm ? bgm.readyState : 0
      };
    },
    unlock: unlock
  };

  window.addEventListener("DOMContentLoaded", function () {
    init();
  });
})();
