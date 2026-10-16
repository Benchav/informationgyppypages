/**
 * Pure Web Audio API procedural sound synthesizer for aquarium ambiance.
 * Generates soft underwater bubbling and aquatic click feedback without external audio files.
 */

class AquariumAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private bubbleTimer: number | null = null;

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
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbient();
      this.playBubblePlop();
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
    if (!this.ctx) return;

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
  private startAmbient() {
    if (!this.ctx) return;

    const scheduleNextBubble = () => {
      if (this.isMuted) return;
      this.playBubblePlop(450 + Math.random() * 400);
      const nextDelay = 1200 + Math.random() * 2800;
      this.bubbleTimer = window.setTimeout(scheduleNextBubble, nextDelay);
    };

    scheduleNextBubble();
  }

  private stopAmbient() {
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = null;
    }
  }
}

export const aquariumAudio = new AquariumAudio();
