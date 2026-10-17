/**
 * Pure Web Audio API procedural sound synthesizer for aquarium ambiance.
 * Generates soft underwater bubbling and aquatic click feedback without external audio files.
 * Enabled by default on entry with automated user gesture unlocking for browser autoplay policies.
 */

class AquariumAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bubbleTimer: number | null = null;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private unlockRegistered: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Auto-start ambient audio on load
      this.initAutoStart();
    }
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isMuted);
      } catch {
        // ignore listener errors
      }
    });
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Initializes audio to start playing on entry.
   * If the browser restricts autoplay, listens for the first user interaction
   * (touch, scroll, click, keydown) to immediately unlock and resume the sound.
   */
  private initAutoStart() {
    // Attempt immediate start if browser permissions already allow it
    this.initContext();

    if (this.ctx && this.ctx.state === "running") {
      this.startAmbient();
      return;
    }

    if (this.unlockRegistered) return;
    this.unlockRegistered = true;

    const unlock = () => {
      if (this.isMuted) {
        cleanup();
        return;
      }

      this.initContext();
      if (this.ctx) {
        if (this.ctx.state === "suspended") {
          this.ctx
            .resume()
            .then(() => {
              if (!this.isMuted) {
                this.startAmbient();
                this.playBubblePlop(500);
              }
            })
            .catch(() => {});
        } else if (this.ctx.state === "running") {
          if (!this.isMuted) {
            this.startAmbient();
          }
        }
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("click", unlock);
      this.unlockRegistered = false;
    };

    window.addEventListener("pointerdown", unlock, { passive: true, once: true });
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("scroll", unlock, { passive: true, once: true });
    window.addEventListener("keydown", unlock, { passive: true, once: true });
    window.addEventListener("click", unlock, { passive: true, once: true });
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    this.notify();

    if (!this.isMuted) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().then(() => {
          this.startAmbient();
          this.playBubblePlop();
        }).catch(() => {});
      } else {
        this.startAmbient();
        this.playBubblePlop();
      }
    } else {
      this.stopAmbient();
    }

    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /** Synthesizes a soft organic water bubble plop sound */
  public playBubblePlop(frequency = 550 + Math.random() * 250) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Natural bubble sweep up-then-down
      osc.frequency.setValueAtTime(frequency * 0.7, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Audio playback fails gracefully if blocked by autoplay policy
    }
  }

  /** Synthesizes subtle ambient underwater bubbling */
  public startAmbient() {
    if (!this.ctx || this.isMuted) return;
    if (this.bubbleTimer) return; // Prevent duplicate timers

    const scheduleNextBubble = () => {
      if (this.isMuted) {
        this.stopAmbient();
        return;
      }
      this.playBubblePlop(450 + Math.random() * 400);
      const nextDelay = 1200 + Math.random() * 2600;
      this.bubbleTimer = window.setTimeout(scheduleNextBubble, nextDelay);
    };

    scheduleNextBubble();
  }

  public stopAmbient() {
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = null;
    }
  }
}

export const aquariumAudio = new AquariumAudio();
