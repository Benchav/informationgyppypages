import { memo, useMemo } from "react";
import { swimmers } from "@/data/fishImages";

/** Rising bubbles, pure CSS. */
export const Bubbles = memo(function Bubbles({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        size: 3 + ((i * 7) % 9),
        dur: 9 + ((i * 13) % 12),
        delay: -((i * 3.7) % 18),
        drift: ((i % 5) - 2) * 18,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-20px] rounded-full border border-glow/40 bg-glow/10"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animation: `rise ${b.dur}s linear ${b.delay}s infinite`,
            ["--drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
});

/** Stylised SVG guppy silhouette. */
export function GuppyGlyph({
  className,
  tail = "var(--live)",
}: {
  className?: string;
  tail?: string;
}) {
  return (
    <svg viewBox="0 0 120 50" className={className} aria-hidden>
      <defs>
        <linearGradient id="gb" x1="0" x2="1">
          <stop offset="0" stopColor={tail} stopOpacity=".9" />
          <stop offset="1" stopColor="var(--glow)" stopOpacity=".7" />
        </linearGradient>
      </defs>
      <g
        style={{
          transformOrigin: "42px 25px",
          animation: "tail .5s ease-in-out infinite alternate",
        }}
      >
        <path
          d="M44 25 C30 4, 8 2, 2 10 C6 20, 6 30, 2 40 C8 48, 30 46, 44 25Z"
          fill={tail}
          opacity=".75"
        />
      </g>
      <path
        d="M40 25 C55 14, 92 14, 112 22 C116 24, 116 26, 112 28 C92 36, 55 36, 40 25Z"
        fill="url(#gb)"
      />
      <path d="M62 17 C70 6, 84 8, 88 16Z" fill={tail} opacity=".6" />
      <circle cx="104" cy="23.5" r="2" fill="var(--abyss)" />
    </svg>
  );
}

/** A few slow fish drifting across a section at different depths. */
export const SwimmingFish = memo(function SwimmingFish({ count = 4 }: { count?: number }) {
  const fish = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        top: 15 + ((i * 23) % 70),
        w: 70 + ((i * 17) % 60),
        dur: 38 + i * 11,
        delay: -i * 9,
        o: 0.25 + (i % 3) * 0.18,
        blur: i % 3 === 0 ? 2 : 0,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {fish.map((f, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: `${f.top}%`,
            animation: `swim ${f.dur}s ease-in-out ${f.delay}s infinite`,
            ["--o" as string]: f.o,
            filter: f.blur ? `blur(${f.blur}px)` : undefined,
          }}
        >
          <div style={{ width: f.w }}>
            <img src={swimmers[i % swimmers.length]} alt="" className="h-auto w-full" />
          </div>
        </div>
      ))}
    </div>
  );
});
