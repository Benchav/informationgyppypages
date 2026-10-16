import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { defaultHabitat, habitat, type HabitatState } from "@/data/habitat";
import { Bubbles } from "./Ambient";
import { swimmers } from "@/data/fishImages";
import { Reveal, SectionLabel } from "./Reveal";
import { aquariumAudio } from "@/lib/aquarium-audio";
import { Info, Check, AlertCircle, Droplets, SunMedium } from "lucide-react";

const lightTint = {
  day: "oklch(0.9 0.05 200 / 0.18)",
  dusk: "oklch(0.75 0.12 60 / 0.22)",
  night: "oklch(0.4 0.12 260 / 0.45)",
} as const;

const substrateFill = {
  sand: "oklch(0.78 0.04 80)",
  gravel: "oklch(0.3 0.02 250)",
  soil: "oklch(0.28 0.04 50)",
} as const;

function Tank({ s }: { s: HabitatState }) {
  const fishCount = Number(s.fish);
  const plantCount = s.plants === "dense" ? 14 : s.plants === "light" ? 6 : 0;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-border/80 bg-water shadow-2xl">
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: lightTint[s.light as keyof typeof lightTint] }}
      />
      {s.light !== "night" && <div className="light-rays absolute inset-0 opacity-70" />}
      <div className="caustics absolute inset-0 opacity-40" />
      <Bubbles count={12} />

      <svg
        viewBox="0 0 400 250"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* substrate */}
        <path
          d="M0 215 Q100 205 200 212 T400 208 V250 H0Z"
          fill={substrateFill[s.substrate as keyof typeof substrateFill]}
          className="transition-[fill] duration-700"
        />
        {/* rocks */}
        {s.rocks !== "none" && (
          <g fill={s.rocks === "seiryu" ? "oklch(0.55 0.02 240)" : "oklch(0.4 0.04 60)"}>
            <path d="M250 215 L270 165 L300 150 L320 180 L330 215Z" />
            <path d="M300 215 L315 190 L345 185 L355 215Z" opacity=".8" />
          </g>
        )}
        {s.decor === "wood" && (
          <path
            d="M40 212 C70 170, 110 140, 160 120 L165 128 C120 150, 90 180, 70 212Z"
            fill="oklch(0.35 0.05 50)"
          />
        )}
        {s.decor === "cave" && (
          <path
            d="M150 215 Q150 175 185 172 Q220 175 220 215 H200 Q200 195 185 195 Q170 195 170 215Z"
            fill="oklch(0.45 0.03 40)"
          />
        )}
      </svg>

      {/* plants */}
      {Array.from({ length: plantCount }).map((_, i) => (
        <div
          key={`p${i}`}
          className="absolute bottom-[10%] origin-bottom"
          style={{
            left: `${4 + ((i * 41) % 90)}%`,
            height: `${30 + ((i * 13) % 45)}%`,
            width: 10,
            animation: `sway ${4 + (i % 3)}s ease-in-out ${-i}s infinite alternate`,
          }}
        >
          <div
            className="h-full w-full rounded-t-full shadow-lg"
            style={{ background: `oklch(${0.45 + (i % 3) * 0.08} 0.14 ${140 + (i % 4) * 8})` }}
          />
        </div>
      ))}

      {/* fish swimming */}
      {Array.from({ length: fishCount }).map((_, i) => (
        <motion.div
          key={`f${i}`}
          className="absolute w-[12%]"
          style={{ top: `${18 + ((i * 29) % 50)}%`, left: `${8 + ((i * 37) % 75)}%` }}
          animate={{ x: [0, 30 + (i % 3) * 15, 0], y: [0, -8, 0], scaleX: [1, 1, -1, -1, 1] }}
          transition={{
            duration: 7 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <img
            src={swimmers[i % swimmers.length]}
            alt=""
            className="h-auto w-full drop-shadow-xl"
          />
        </motion.div>
      ))}

      {/* Live Tank Stats HUD */}
      <div className="glass absolute left-4 top-4 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-white/10">
        {fishCount} Guppys ·{" "}
        {s.light === "day"
          ? "Luz 6500K Día"
          : s.light === "dusk"
            ? "Luz Cálida 3000K"
            : "Modo Luna Bioluminiscente"}
      </div>

      <div className="glass absolute right-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] text-live backdrop-blur-md border border-white/10">
        {s.plants === "dense"
          ? "Platado High-Tech"
          : s.plants === "light"
            ? "Plantado Moderado"
            : "Biotopo Rocoso"}
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

  // Real-time biological calculations
  const fishNum = Number(s.fish);
  const recommendedLiters = Math.max(40, fishNum * 5);
  const plantFiltrationBonus = s.plants === "dense" ? 40 : s.plants === "light" ? 18 : 0;
  const bioloadPercentage = Math.round((fishNum / 12) * 100);

  return (
    <section id="acuario" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="03">Configurador de Biotopo</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
            Construye el <em className="text-live">hábitat perfecto</em>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Personaliza el entorno del acuario: iluminación, vegetación, sustrato y densidad
            poblacional para calcular en tiempo real la estabilidad biológica.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
          <div className="space-y-6">
            <Reveal>
              <Tank s={s} />
            </Reveal>

            {/* Live Bioload & Tank Equilibrium Card */}
            <Reveal
              delay={0.15}
              className="glass rounded-2xl p-5 sm:p-6 border border-border/80 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-live" />
                  <span className="font-display text-lg">
                    Carga Biológica & Capacidad Recomendada
                  </span>
                </div>
                <span className="font-mono text-xs text-live bg-live/15 px-2.5 py-1 rounded-full">
                  Volumen mínimo: {recommendedLiters} Litros
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl bg-abyss/80 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Densidad Poblacional
                  </span>
                  <p className="mt-1 font-semibold text-foreground text-sm">
                    {fishNum} Guppys adultos
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Ratio ideal: 1 macho / 2–3 hembras
                  </p>
                </div>

                <div className="rounded-xl bg-abyss/80 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Filtración Vegetal
                  </span>
                  <p className="mt-1 font-semibold text-emerald-400 text-sm">
                    +{plantFiltrationBonus}% Asimilación
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {s.plants === "dense"
                      ? "Excelente reducción de nitratos"
                      : s.plants === "light"
                        ? "Ayuda al ciclado biológico"
                        : "Requiere cambios de agua semanales"}
                  </p>
                </div>

                <div className="rounded-xl bg-abyss/80 p-3 border border-border/60">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                    Fotoperiodo Óptimo
                  </span>
                  <p className="mt-1 font-semibold text-foreground text-sm">8–10 horas / día</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Previene algas filamentosas
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Interactive controls palette */}
          <Reveal
            delay={0.1}
            className="glass min-w-0 flex flex-col rounded-2xl p-5 sm:p-7 border border-border/80 shadow-2xl"
          >
            <span className="eyebrow text-[10px] text-live mb-4">
              Herramientas de configuración
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 rounded-full bg-abyss/60 border border-border/60">
              {habitat.map((c) => (
                <Button
                  variant="aquarium"
                  size="touch"
                  key={c.id}
                  onClick={() => {
                    aquariumAudio.playBubblePlop(600);
                    setCat(c.id);
                  }}
                  className={`rounded-full px-2.5 py-1.5 text-xs transition-all ${
                    cat === c.id
                      ? "bg-live text-primary-foreground font-semibold shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </Button>
              ))}
            </div>

            <div className="mt-6 grid gap-2.5">
              {category.options.map((o) => (
                <Button
                  variant="aquarium"
                  size="touch"
                  key={o.id}
                  onClick={() => {
                    aquariumAudio.playBubblePlop(720);
                    setS((p) => ({ ...p, [cat]: o.id }));
                  }}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                    s[cat] === o.id
                      ? "border-live bg-live/15 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "border-border hover:border-live/50 bg-abyss/40"
                  }`}
                >
                  <span className="font-medium text-sm text-foreground">{o.label}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      s[cat] === o.id
                        ? "bg-live scale-125 shadow-[0_0_8px_var(--live)]"
                        : "bg-muted"
                    }`}
                  />
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + cat}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border-t border-border pt-5"
              >
                <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <Info className="h-4 w-4 text-live shrink-0 mt-0.5" />
                  <p>{current.info}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
