import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { defaultHabitat, habitat, type HabitatState } from "@/data/habitat";
import { Bubbles } from "./Ambient";
import { swimmers } from "@/data/fishImages";
import { Reveal, SectionLabel } from "./Reveal";

const lightTint = { day: "oklch(0.9 0.05 200 / 0.18)", dusk: "oklch(0.75 0.12 60 / 0.22)", night: "oklch(0.4 0.12 260 / 0.45)" } as const;
const substrateFill = { sand: "oklch(0.78 0.04 80)", gravel: "oklch(0.3 0.02 250)", soil: "oklch(0.28 0.04 50)" } as const;

function Tank({ s }: { s: HabitatState }) {
  const fishCount = Number(s.fish);
  const plantCount = s.plants === "dense" ? 14 : s.plants === "light" ? 6 : 0;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border border-border bg-water">
      <div className="absolute inset-0 transition-colors duration-1000" style={{ background: lightTint[s.light as keyof typeof lightTint] }} />
      {s.light !== "night" && <div className="light-rays absolute inset-0" />}
      <Bubbles count={8} />
      <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        {/* substrate */}
        <path d="M0 215 Q100 205 200 212 T400 208 V250 H0Z" fill={substrateFill[s.substrate as keyof typeof substrateFill]} className="transition-[fill] duration-700" />
        {/* rocks */}
        {s.rocks !== "none" && (
          <g fill={s.rocks === "seiryu" ? "oklch(0.55 0.02 240)" : "oklch(0.4 0.04 60)"}>
            <path d="M250 215 L270 165 L300 150 L320 180 L330 215Z" />
            <path d="M300 215 L315 190 L345 185 L355 215Z" opacity=".8" />
          </g>
        )}
        {s.decor === "wood" && <path d="M40 212 C70 170, 110 140, 160 120 L165 128 C120 150, 90 180, 70 212Z" fill="oklch(0.35 0.05 50)" />}
        {s.decor === "cave" && <path d="M150 215 Q150 175 185 172 Q220 175 220 215 H200 Q200 195 185 195 Q170 195 170 215Z" fill="oklch(0.45 0.03 40)" />}
      </svg>
      {/* plants */}
      {Array.from({ length: plantCount }).map((_, i) => (
        <div key={`p${i}`} className="absolute bottom-[10%] origin-bottom" style={{ left: `${4 + ((i * 41) % 90)}%`, height: `${30 + ((i * 13) % 45)}%`, width: 10, animation: `sway ${4 + (i % 3)}s ease-in-out ${-i}s infinite alternate` }}>
          <div className="h-full w-full rounded-t-full" style={{ background: `oklch(${0.45 + (i % 3) * 0.08} 0.14 ${140 + (i % 4) * 8})` }} />
        </div>
      ))}
      {/* fish */}
      {Array.from({ length: fishCount }).map((_, i) => (
        <motion.div key={`f${i}`} className="absolute w-[12%]" style={{ top: `${18 + ((i * 29) % 50)}%`, left: `${8 + ((i * 37) % 75)}%` }}
          animate={{ x: [0, 30 + (i % 3) * 15, 0], y: [0, -8, 0], scaleX: [1, 1, -1, -1, 1] }} transition={{ duration: 7 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}>
          <img src={swimmers[i % swimmers.length]} alt="" className="h-auto w-full drop-shadow-lg" />
        </motion.div>
      ))}
      <div className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
        {fishCount} peces · {s.light === "day" ? "6500K" : s.light === "dusk" ? "3000K" : "Luna"}
      </div>
    </div>
  );
}

export function Habitat() {
  const [s, setS] = useState<HabitatState>(defaultHabitat);
  const [cat, setCat] = useState<keyof HabitatState>("plants");
  const category = habitat.find((c) => c.id === cat) ?? habitat[0];
  const current = category?.options.find((o) => o.id === s[cat]);

  if (!category || !current) return null;

  return (
    <section id="acuario" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionLabel index="03">Configurador</SectionLabel></Reveal>
        <Reveal><h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">Construye el <em className="text-live">hábitat perfecto</em></h2></Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Reveal><Tank s={s} /></Reveal>
          <Reveal delay={0.1} className="glass min-w-0 flex flex-col rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-3 gap-1.5">
              {habitat.map((c) => (
                <Button variant="aquarium" size="touch" key={c.id} onClick={() => setCat(c.id)} className={`rounded-full px-3 py-1.5 text-xs transition-colors ${cat === c.id ? "bg-live text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{c.label}</Button>
              ))}
            </div>
            <div className="mt-6 grid gap-2">
              {category.options.map((o) => (
                <Button variant="aquarium" size="touch" key={o.id} onClick={() => setS((p) => ({ ...p, [cat]: o.id }))}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${s[cat] === o.id ? "border-live bg-live/10" : "border-border hover:border-live/50"}`}>
                  <span>{o.label}</span>
                  <span className={`h-2 w-2 rounded-full ${s[cat] === o.id ? "bg-live" : "bg-muted"}`} />
                </Button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={current.id + cat} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                {current.info}
              </motion.p>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
