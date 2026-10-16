import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { careSteps } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";

export function Care() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="cuidados" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <SectionLabel index="04">Guía de cuidados</SectionLabel>
          </Reveal>
          <Reveal>
            <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
              Siete pasos hacia un <em className="text-live">guppy sano</em>.
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Un recorrido del primer día al primer alevín. Desplázate para descender.
            </p>
          </Reveal>
        </div>
        <div ref={ref} className="relative pl-6 sm:pl-10">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-border" />
          <motion.div
            className="absolute left-0 top-0 w-px bg-live shadow-[0_0_12px_var(--live)]"
            style={{ height: h }}
          />
          {careSteps.map((s) => (
            <Reveal key={s.n} className="relative border-b border-border py-10 last:border-0">
              <span className="absolute -left-[1.85rem] sm:-left-[2.85rem] top-12 h-2.5 w-2.5 rounded-full bg-live ring-4 ring-abyss" />
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 sm:gap-6">
                <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl">{s.t}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
