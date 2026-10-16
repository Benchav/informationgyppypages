import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import type { Variety } from "@/data/varieties";
import { varieties } from "@/data/varieties";
import { fishImages } from "@/data/fishImages";
import { Reveal, SectionLabel } from "./Reveal";
import { aquariumAudio } from "@/lib/aquarium-audio";
import { Box, Sparkles, ArrowUpRight } from "lucide-react";

export function Varieties({
  active,
  onChange,
}: {
  active: Variety;
  onChange: (v: Variety) => void;
}) {
  return (
    <section id="variedades" className="relative overflow-hidden px-5 py-16 sm:py-24 lg:py-32">
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 70% 45%, color-mix(in oklab, ${active.color} 30%, transparent), transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="02">Catálogo Genético</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="mt-8 max-w-3xl font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
            Elige una variedad. <em className="text-live">El acuario cambia de luz.</em>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Cada línea genética altera la tonalidad del biotopo y sincroniza la iluminación del
            modelo 3D en tiempo real.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Selector — a vertical spectrum on desktop, a swipeable strip on mobile */}
          <div
            role="tablist"
            aria-label="Variedades de Guppy"
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {varieties.map((v, i) => {
              const on = v.id === active.id;
              return (
                <Button
                  variant="aquarium"
                  size="touch"
                  key={v.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    aquariumAudio.playBubblePlop(450 + i * 40);
                    onChange(v);
                  }}
                  className={`group relative flex shrink-0 snap-start items-center justify-between rounded-full px-4 py-3 text-left transition-all lg:rounded-2xl border ${
                    on ? "glass border-live/50 shadow-lg" : "border-transparent hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full transition-transform group-hover:scale-125"
                      style={{
                        background: v.color,
                        boxShadow: on ? `0 0 16px ${v.color}` : undefined,
                      }}
                    />
                    <span
                      className={`text-sm font-medium ${on ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                    >
                      {v.name}
                    </span>
                  </div>
                  {on && (
                    <motion.span
                      layoutId="var-line"
                      className="hidden text-[10px] font-mono text-live lg:inline"
                    >
                      ● Activo
                    </motion.span>
                  )}
                </Button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center"
            >
              <div className="relative flex min-w-0 min-h-[260px] sm:min-h-[340px] items-center justify-center rounded-3xl border border-border/60 bg-abyss/40 backdrop-blur-md p-6">
                <div
                  className="absolute h-80 w-80 rounded-full blur-3xl transition-colors duration-700"
                  style={{ background: active.color, opacity: 0.35 }}
                />
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full max-w-md"
                >
                  <img
                    src={fishImages[active.id]}
                    alt={`Guppy ${active.name}`}
                    width={900}
                    height={585}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full drop-shadow-[0_20px_50px_oklch(0_0_0/0.75)]"
                  />
                </motion.div>
                <span className="pointer-events-none absolute bottom-2 left-4 max-w-full overflow-hidden font-display text-4xl sm:text-6xl sm:text-8xl lg:text-9xl leading-none opacity-[0.06]">
                  {active.name}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-live">{active.latin}</span>
                  <span className="h-1 w-1 rounded-full bg-live" />
                  <span className="text-[11px] font-mono text-muted-foreground">Línea Pura</span>
                </div>

                <h3 className="mt-2 font-display text-4xl sm:text-6xl text-foreground">
                  {active.name}
                </h3>
                <p className="mt-2 font-display text-2xl italic text-live">{active.tagline}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground text-sm sm:text-base">
                  {active.description}
                </p>

                <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-border/80 pt-6">
                  <div>
                    <dt className="eyebrow text-[10px]">Dificultad de Cría</dt>
                    <dd className="mt-2.5 flex gap-1.5" aria-label={`${active.difficulty} de 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-6 rounded-full transition-all ${
                            n <= active.difficulty
                              ? "bg-live shadow-[0_0_6px_var(--live)]"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[10px]">Tamaño Adulto</dt>
                    <dd className="mt-2 font-mono text-sm font-semibold text-foreground">
                      {active.size}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="eyebrow text-[10px]">Comportamiento Social</dt>
                    <dd className="mt-1.5 text-xs text-muted-foreground">{active.behavior}</dd>
                  </div>
                </dl>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {active.traits.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-live/40 bg-live/5 px-3 py-1 text-xs text-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-4 border-t border-border/80">
                  <a
                    href="#inicio"
                    className="inline-flex items-center gap-2 rounded-full bg-live/15 hover:bg-live/25 text-live border border-live/40 px-4 py-2 text-xs font-semibold transition-all shadow-sm"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>Ver iluminación en modelo 3D</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
