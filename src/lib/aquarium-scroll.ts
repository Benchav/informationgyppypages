import { aquariumAudio } from "./aquarium-audio";

/**
 * High-performance, silky-smooth scroll to surface (#inicio)
 * Optimized to prevent layout thrashing, bypass heavy intermediate repaints,
 * and provide tactile audio feedback.
 */
export function scrollToSurface() {
  if (typeof window === "undefined") return;

  // Play subtle initial bubble sweep
  aquariumAudio.playBubblePlop(640);

  // If user prefers reduced motion, jump immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (window.location.hash !== "#inicio") {
      window.history.replaceState(null, "", "#inicio");
    }
    return;
  }

  const startY = window.scrollY;
  if (startY <= 5) return;

  const targetY = 0;
  const distance = targetY - startY;
  // Calculate dynamic duration: ~600ms to 780ms max (fast, buoyant and lightweight)
  const duration = Math.min(780, Math.max(520, Math.abs(distance) * 0.08));
  const startTime = performance.now();

  // Temporarily disable pointer events and hover states during the rapid ascent
  document.documentElement.classList.add("is-ascending");
  document.body.classList.add("is-ascending");

  // Quartic ease out: steep initial ascent that smoothly settles at the surface like an air bubble
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);

    window.scrollTo(0, Math.round(startY + distance * easedProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, 0);
      document.documentElement.classList.remove("is-ascending");
      document.body.classList.remove("is-ascending");
      if (window.location.hash !== "#inicio") {
        window.history.replaceState(null, "", "#inicio");
      }
      // Light surface bubble plop when breaking the surface
      aquariumAudio.playBubblePlop(880);
    }
  };

  requestAnimationFrame(step);
}
