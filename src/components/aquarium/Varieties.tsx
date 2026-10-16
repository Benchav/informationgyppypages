import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import type { Variety } from "@/data/varieties";
import { varieties } from "@/data/varieties";
import { fishImages } from "@/data/fishImages";
import { Reveal, SectionLabel } from "./Reveal";

export function Varieties({ active, onChange }: { active: Variety; onChange: (v: Variety) => void }) {
  return (
    <section id="variedades" className="relative overflow-hidden px-5 py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: `radial-gradient(ellipse 60% 50% at 70% 45%, color-mix(in oklab, ${active.color} 28%, transparent), transparent 70%)` }} />
      <div className="relative mx-auto max-w-7xl">
        <Reveal><SectionLabel index="02">Variedades</SectionLabel></Reveal>
        <Reveal><h2 className="mt-8 max-w-3xl font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">Elige una variedad. <em className="text-live">El acuario cambia de luz.</em></h2></Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Selector — a vertical spectrum on desktop, a swipeable strip on mobile */}
          <div role="tablist" aria-label="Variedades de Guppy" className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {varieties.map((v) => {
              const on = v.id === active.id;
              return (
                <Button variant="aquarium" size="touch" key={v.id} role="tab" aria-selected={on} onClick={() => onChange(v)}
                  className={`group relative flex shrink-0 snap-start items-center gap-3 rounded-full px-4 py-2.5 text-left transition-all lg:rounded-xl ${on ? "glass" : "hover:bg-muted/50"}`}>
                  <span className="h-3 w-3 rounded-full transition-transform group-hover:scale-125" style={{ background: v.color, boxShadow: on ? `0 0 16px ${v.color}` : undefined }} />
                  <span className={`text-sm ${on ? "text-foreground" : "text-muted-foreground"}`}>{v.name}</span>
                  {on && <motion.span layoutId="var-line" className="absolute -left-px top-2 bottom-2 hidden w-0.5 rounded bg-live lg:block" />}
                </Button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="relative flex min-w-0 min-h-[220px] sm:min-h-[300px] items-center justify-center">
                <div className="absolute h-72 w-72 rounded-full blur-3xl" style={{ background: active.color, opacity: 0.35 }} />
                <motion.div animate={{ y: [0, -14, 0], rotate: [0, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative w-full max-w-md">
                  <img src={fishImages[active.id]} alt={`Guppy ${active.name}`} width={900} height={585} loading="lazy" decoding="async" className="h-auto w-full drop-shadow-[0_20px_50px_oklch(0_0_0/0.55)]" />
                </motion.div>
                <span className="pointer-events-none absolute bottom-0 left-0 max-w-full overflow-hidden font-display text-4xl sm:text-6xl sm:text-8xl lg:text-9xl leading-none opacity-[0.07]">{active.name}</span>
              </div>
              <div>
                <p className="eyebrow">{active.latin}</p>
                <h3 className="mt-3 font-display text-4xl sm:text-6xl">{active.name}</h3>
                <p className="mt-2 font-display text-2xl italic text-live">{active.tagline}</p>
                <p className="mt-6 leading-relaxed text-muted-foreground">{active.description}</p>
                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
                  <div>
                    <dt className="eyebrow">Dificultad</dt>
                    <dd className="mt-3 flex gap-1.5" aria-label={`${active.difficulty} de 5`}>
                      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1.5 w-6 rounded-full ${n <= active.difficulty ? "bg-live" : "bg-muted"}`} />)}
                    </dd>
                  </div>
                  <div><dt className="eyebrow">Tamaño</dt><dd className="mt-2 font-mono text-sm">{active.size}</dd></div>
                  <div className="col-span-2"><dt className="eyebrow">Comportamiento</dt><dd className="mt-2 text-sm">{active.behavior}</dd></div>
                </dl>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {active.traits.map((t) => <li key={t} className="rounded-full border border-live/40 px-3 py-1 text-xs">{t}</li>)}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
