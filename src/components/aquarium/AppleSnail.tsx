import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  snailAnatomy,
  snailFacts,
  snailLifecycle,
  snailMorphs,
  snailWithGuppy,
} from "@/data/snail";
import { Bubbles } from "./Ambient";
import { Reveal, SectionLabel } from "./Reveal";

/** Interactive specimen viewer: drag to turn, hover tilt, anatomy hotspots, morph switcher. */
function SnailViewer() {
  const [morph, setMorph] = useState(snailMorphs[0]);
  const [spot, setSpot] = useState<string | null>("siphon");
  const [zoom, setZoom] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const rot = useMotionValue(0);
  const tilt = useMotionValue(0);
  const rotY = useSpring(rot, { stiffness: 120, damping: 20 });
  const rotX = useSpring(tilt, { stiffness: 120, damping: 20 });
  // When turned past 90°, mirror the specimen so it reads as "seen from the other side".
  const flip = useTransform(rotY, (v) => (Math.cos((v * Math.PI) / 180) < 0 ? -1 : 1));
  const active = snailAnatomy.find((a) => a.id === spot);
  const facingFront = useTransform(
    rotY,
    (v) => Math.abs(((v % 360) + 360) % 360) < 50 || Math.abs(((v % 360) + 360) % 360) > 310,
  );
  const [showSpots, setShowSpots] = useState(true);
  useEffect(() => facingFront.on("change", setShowSpots), [facingFront]);
  if (!morph) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div
        ref={ref}
        className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-water md:aspect-[4/3]"
        onPointerMove={(e) => {
          if (e.buttons) return;
          if (!ref.current || e.pointerType === "touch") return;
          const r = ref.current.getBoundingClientRect();
          tilt.set(((e.clientY - r.top) / r.height - 0.5) * -12);
        }}
        onPointerLeave={() => tilt.set(0)}
      >
        <div className="caustics absolute inset-0 opacity-50" />
        <Bubbles count={10} />
        <div className="absolute inset-x-[10%] bottom-[14%] h-8 rounded-[50%] bg-abyss/70 blur-xl" />
        <motion.div
          className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing [perspective:1200px]"
          onPan={(_, i) => rot.set(rot.get() + i.delta.x * 0.6)}
          style={{ touchAction: "pan-y" }}
        >
          <motion.div
            style={{ rotateY: rotY, rotateX: rotX, scale: zoom }}
            className="relative w-[78%] [transform-style:preserve-3d] transition-[scale]"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={morph.id}
                src={morph.img}
                alt={`Caracol manzana ${morph.name}`}
                width={900}
                height={900}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ scaleX: flip }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45 }}
                className="w-full select-none drop-shadow-[0_30px_40px_oklch(0_0_0/0.5)]"
              />
            </AnimatePresence>
            {showSpots &&
              snailAnatomy
                .filter((a) => a.id !== "siphon" || morph.id === "gold")
                .map((a) => (
                  <Button
                    variant="aquarium"
                    size="touch"
                    key={a.id}
                    onClick={() => setSpot(a.id)}
                    aria-label={a.t}
                    style={{ left: `${a.x}%`, top: `${a.y}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <span
                      className={`absolute inset-0 animate-ping rounded-full ${spot === a.id ? "bg-live/60" : "bg-glow/30"}`}
                    />
                    <span
                      className={`relative block h-3.5 w-3.5 rounded-full border-2 border-foreground transition-transform group-hover:scale-125 ${spot === a.id ? "bg-live" : "bg-abyss/60"}`}
                    />
                  </Button>
                ))}
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
          <span className="eyebrow">Pomacea diffusa</span>
        </div>
        <div className="glass absolute bottom-3 right-3 flex items-center gap-1 rounded-full p-1">
          <Button
            variant="aquarium"
            size="touch"
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
            className="h-11 w-11 rounded-full hover:bg-muted"
            aria-label="Alejar"
          >
            −
          </Button>
          <Button
            variant="aquarium"
            size="touch"
            onClick={() => {
              rot.set(0);
              setZoom(1);
            }}
            className="px-1 text-xs"
            aria-label="Restablecer vista"
          >
            ↺
          </Button>
          <Button
            variant="aquarium"
            size="touch"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="h-11 w-11 rounded-full hover:bg-muted"
            aria-label="Acercar"
          >
            +
          </Button>
        </div>
        <div className="glass absolute bottom-3 left-3 flex gap-1 rounded-full p-1">
          {[0, 180].map((d) => (
            <Button
              variant="aquarium"
              size="touch"
              key={d}
              onClick={() => rot.set(d)}
              className="rounded-full px-2 py-1.5 text-xs hover:bg-muted"
            >
              {d ? "Lado B" : "Lado A"}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="glass rounded-lg p-4 sm:p-6">
          <p className="eyebrow mb-4">Variedad de color</p>
          <div className="grid grid-cols-3 gap-2">
            {snailMorphs.map((m) => (
              <Button
                variant="aquarium"
                size="touch"
                key={m.id}
                onClick={() => setMorph(m)}
                className={`min-w-0 flex-col gap-1 rounded-lg border p-2 transition-all ${morph.id === m.id ? "border-live bg-live/10" : "border-border hover:border-live/50"}`}
              >
                <img src={m.img} alt="" loading="lazy" className="h-14 w-full object-contain" />
                <span className="mt-1 block text-xs">{m.name}</span>
              </Button>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">{morph.latin}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{morph.note}</p>
        </div>
        <div className="glass flex-1 rounded-lg p-4 sm:p-6">
          <p className="eyebrow mb-4">Anatomía</p>
          <div className="flex flex-wrap gap-1.5">
            {snailAnatomy.map((a) => (
              <Button
                variant="aquarium"
                size="touch"
                key={a.id}
                onClick={() => {
                  setSpot(a.id);
                  rot.set(0);
                }}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${spot === a.id ? "bg-live text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
              >
                {a.t}
              </Button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5"
              >
                <h4 className="font-display text-3xl">{active.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.d}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function AppleSnail() {
  return (
    <section id="caracol" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="05">Compañero ideal</SectionLabel>
        </Reveal>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
              El <em className="text-live">caracol manzana</em>, el jardinero del acuario.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="leading-relaxed text-muted-foreground">
              Pomacea diffusa es un gasterópodo de agua dulce de Sudamérica. Respira aire y agua,
              limpia restos y convive en paz con los guppys.
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <Reveal>
            <SnailViewer />
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 lg:grid-cols-4">
          {snailFacts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.06}>
              <p className="eyebrow">{f.k}</p>
              <p className="mt-3 font-display text-4xl md:text-6xl">
                {f.n}
                <span className="mt-1 block font-sans text-xs sm:ml-2 sm:inline sm:text-sm text-muted-foreground">
                  {f.unit}
                </span>
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-6">Ciclo de vida</p>
            <ol className="relative grid gap-0 border-l border-border">
              {snailLifecycle.map((s, i) => (
                <li key={s.t} className="relative py-5 pl-8">
                  <span className="absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full bg-live" />
                  <span className="font-mono text-xs text-live">0{i + 1}</span>
                  <h4 className="mt-1 font-display text-2xl">{s.t}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.1} className="glass rounded-[2rem] p-8">
            <p className="eyebrow mb-6">Con tus guppys</p>
            <ul className="grid gap-5">
              {snailWithGuppy.map((t, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-border pb-5 last:border-0 last:pb-0"
                >
                  <span className="font-display text-3xl text-live">{i + 1}</span>
                  <p className="pt-1.5 text-sm leading-relaxed">{t}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
