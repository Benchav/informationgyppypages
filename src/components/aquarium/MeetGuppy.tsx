import { facts, notes, params, heroPhoto } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";

function Range({ p }: { p: (typeof params)[number] }) {
  const pct = (v: number) => ((v - p.min) / (p.max - p.min)) * 100;
  return (
    <div>
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
        <span className="text-sm text-muted-foreground">{p.label}</span>
        <span className="font-mono text-sm">
          {p.from}–{p.to}
          {p.unit}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-live shadow-[0_0_20px_var(--live)] transition-all duration-700"
          style={{ left: `${pct(p.from)}%`, width: `${pct(p.to) - pct(p.from)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground/60">
        <span>{p.min}</span>
        <span>{p.max}</span>
      </div>
    </div>
  );
}

export function MeetGuppy() {
  return (
    <section id="guppy" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="01">Conoce al Guppy</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:gap-16 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
              Un pequeño pez con <em className="text-live">más de cien años</em> de historia en los
              acuarios.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Nativo de los ríos y arroyos del Caribe y el norte de Sudamérica, el guppy es
              vivíparo, resistente y casi infinitamente variable en color. Por eso se le llama el
              “pez millón”.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <img
                src={heroPhoto}
                alt="Guppy macho multicolor con cola delta"
                loading="lazy"
                className="h-full w-full scale-110 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />
              <span className="eyebrow absolute bottom-5 left-5">Macho adulto · cola delta</span>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-24 grid grid-cols-2 gap-x-6 gap-y-14 border-t border-border pt-14 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.08}>
              <p className="eyebrow">{f.k}</p>
              <p className="mt-4 font-display text-4xl sm:text-6xl md:text-7xl">
                {f.n}
                <span className="mt-1 block font-sans text-xs sm:ml-2 sm:inline sm:text-sm text-muted-foreground">
                  {f.unit}
                </span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{f.v}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 sm:mt-24 grid gap-8 sm:gap-16 lg:grid-cols-2">
          <Reveal className="glass rounded-lg p-5 sm:p-8 md:p-10">
            <p className="eyebrow mb-8">Parámetros del agua</p>
            <div className="grid gap-8">
              {params.map((p) => (
                <Range key={p.label} p={p} />
              ))}
            </div>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-border sm:grid-cols-2">
            {notes.map((n, i) => (
              <Reveal
                key={n.t}
                delay={i * 0.06}
                className="h-full bg-abyss p-7 transition-colors hover:bg-deep"
              >
                <span className="font-mono text-xs text-live">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{n.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
