import { describe, expect, it, vi, beforeEach } from "vitest";
import { aquariumAudio } from "@/lib/aquarium-audio";
import { scrollToSurface } from "@/lib/aquarium-scroll";

describe("Aquarium Audio System", () => {
  it("initializes with audio enabled (not muted)", () => {
    // Should be unmuted by default so bubbles sound on entry
    expect(aquariumAudio.getMuted()).toBe(false);
  });

  it("subscribes to audio state updates and synchronizes components", () => {
    const listener = vi.fn();
    const unsubscribe = aquariumAudio.subscribe(listener);

    // Initial notification on subscribe
    expect(listener).toHaveBeenCalledWith(false);

    // Toggle mute
    aquariumAudio.toggleMute();
    expect(listener).toHaveBeenCalledWith(true);

    // Toggle back
    aquariumAudio.toggleMute();
    expect(listener).toHaveBeenCalledWith(false);

    unsubscribe();
  });

  it("handles bubble sound synthesis gracefully", () => {
    expect(() => aquariumAudio.playBubblePlop(600)).not.toThrow();
  });
});

describe("Aquarium Scroll to Surface System", () => {
  beforeEach(() => {
    window.scrollY = 2500;
    window.scrollTo = vi.fn((x: number | ScrollToOptions, y?: number) => {
      if (typeof x === "object") {
        window.scrollY = x.top ?? 0;
      } else if (typeof y === "number") {
        window.scrollY = y;
      }
    }) as unknown as typeof window.scrollTo;
  });

  it("triggers smooth ascent without errors", () => {
    expect(() => scrollToSurface()).not.toThrow();
  });
});
