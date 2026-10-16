import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { careSteps } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";
import { aquariumAudio } from "@/lib/aquarium-audio";
import { Check, CheckSquare, Square, Calendar, Sparkles, HeartPulse, Droplets } from "lucide-react";

interface CareTask {
  id: string;
  period: "diario" | "semanal" | "mensual";
  title: string;
  detail: string;
}

const CARE_TASKS: CareTask[] = [
  {
    id: "feed",
    period: "diario",
    title: "Alimentación en micro-porciones",
    detail: "Lo que consuman en 2 minutos. Evita restos en el fondo.",
  },
  {
    id: "temp",
    period: "diario",
    title: "Verificación de temperatura",
    detail: "Comprobar que el termostato mantenga 24–26 °C estables.",
  },
  {
    id: "water_change",
    period: "semanal",
    title: "Cambio parcial de agua (25%)",
    detail: "Con agua declorada a la misma temperatura del acuario.",
  },
  {
    id: "gravel",
    period: "semanal",
    title: "Sifonado suave del fondo",
    detail: "Retirar heces y restos orgánicos entre las gravas.",
  },
  {
    id: "filter",
    period: "mensual",
    title: "Enjuague de esponjas del filtro",
    detail: "Siempre con agua extraída del acuario, jamás con agua del grifo.",
  },
  {
    id: "plants",
    period: "mensual",
    title: "Poda y saneamiento de plantas",
    detail: "Favorece la penetración de luz y brotes jóvenes oxigenantes.",
  },
];

export function Care() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Interactive routine checklist state
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    feed: true,
    temp: true,
    water_change: false,
  });

  const toggleTask = (id: string) => {
    aquariumAudio.playBubblePlop(completedTasks[id] ? 450 : 700);
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CARE_TASKS.length) * 100);

  return (
    <section id="cuidados" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionLabel index="04">Guía de Cuidados</SectionLabel>
            </Reveal>
            <Reveal>
              <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
                Siete pasos hacia un <em className="text-live">guppy sano</em>.
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 max-w-sm text-muted-foreground leading-relaxed">
                Un recorrido meticuloso desde el ciclado del primer día hasta la protección de los
                primeros alevines.
              </p>
            </Reveal>

            {/* Interactive Routine Checklist Widget */}
            <Reveal
              delay={0.2}
              className="mt-8 glass rounded-2xl p-6 border border-border/80 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-live" />
                  <span className="font-display text-lg">Rutina de Mantenimiento</span>
                </div>
                <span className="font-mono text-xs text-live bg-live/15 px-2.5 py-0.5 rounded-full">
                  {completedCount}/{CARE_TASKS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-live transition-all duration-500 rounded-full shadow-[0_0_10px_var(--live)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-3">
                {CARE_TASKS.map((task) => {
                  const done = !!completedTasks[task.id];
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all border ${
                        done
                          ? "bg-live/10 border-live/30 text-foreground"
                          : "bg-abyss/40 border-border/60 text-muted-foreground hover:border-live/40"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all ${
                          done ? "bg-live text-primary-foreground" : "border border-border"
                        }`}
                      >
                        {done && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium leading-tight ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 opacity-80">
                          {task.detail}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {progressPercent === 100 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/20 p-2.5 text-xs text-emerald-400 border border-emerald-500/40">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>¡Acuario en perfecto equilibrio biológico!</span>
                </div>
              )}
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
                <span className="absolute -left-[1.85rem] sm:-left-[2.85rem] top-12 h-2.5 w-2.5 rounded-full bg-live ring-4 ring-abyss shadow-[0_0_8px_var(--live)]" />
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 sm:gap-6">
                  <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40 font-italic">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-foreground">{s.t}</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
