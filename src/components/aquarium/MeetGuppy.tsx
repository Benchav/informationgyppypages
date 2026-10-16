import { useState } from "react";
import { facts, notes, params, heroPhoto } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";
import { aquariumAudio } from "@/lib/aquarium-audio";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Droplets,
  Thermometer,
  ShieldCheck,
} from "lucide-react";

export function MeetGuppy() {
  // Interactive Water Chemistry Simulation
  const [temp, setTemp] = useState(25);
  const [ph, setPh] = useState(7.2);
  const [gh, setGh] = useState(14);

  // Calculate live biological comfort score (0 - 100%)
  const tempComfort = Math.max(0, 100 - Math.pow(Math.abs(temp - 25) * 6.5, 1.4));
  const phComfort = Math.max(0, 100 - Math.pow(Math.abs(ph - 7.3) * 35, 1.3));
  const ghComfort = Math.max(0, 100 - Math.pow(Math.abs(gh - 14) * 4.2, 1.2));
  const overallScore = Math.round(tempComfort * 0.4 + phComfort * 0.35 + ghComfort * 0.25);

  const getStatus = () => {
    if (overallScore >= 88) {
      return {
        label: "Biotopo Óptimo · Máxima Vitalidad",
        desc: "Condiciones ideales para reproducción, coloración vívida de aletas y sistema inmune fuerte.",
        badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        icon: CheckCircle2,
      };
    } else if (overallScore >= 70) {
      return {
        label: "Parámetros Estables · Mantenimiento Seguro",
        desc: "Rango tolerable para el día a día. Los alevines se desarrollan con buen ritmo.",
        badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
        icon: ShieldCheck,
      };
    } else if (overallScore >= 50) {
      return {
        label: "Estrés Leve · Corregir Gradualmente",
        desc: "Se recomienda equilibrar temperatura o dureza para evitar letargo o inmunodeficiencia.",
        badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        icon: AlertTriangle,
      };
    } else {
      return {
        label: "Riesgo Crítico · Peligro para los Peces",
        desc: "Parámetros fuera de los límites de tolerancia biológica del Guppy. Requiere aclimatación urgente.",
        badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/40",
        icon: AlertTriangle,
      };
    }
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const resetParams = () => {
    aquariumAudio.playBubblePlop(640);
    setTemp(25);
    setPh(7.2);
    setGh(14);
  };

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
              vivíparo, resistente y casi infinitamente variable en color. Por su increíble
              prolificidad se le conoce universalmente como el “pez millón”.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
                Familia: <strong className="text-foreground">Poeciliidae</strong>
              </span>
              <span className="glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
                Esperanza: <strong className="text-foreground">2 a 3 años</strong>
              </span>
              <span className="glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
                Zona nado: <strong className="text-foreground">Media y Superficie</strong>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border shadow-2xl">
              <img
                src={heroPhoto}
                alt="Guppy macho multicolor con cola delta"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <span className="eyebrow text-xs text-white drop-shadow">
                  Macho adulto · Variedad Prisma
                </span>
                <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] text-live backdrop-blur-md">
                  Cola Delta Iridescente
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Fact stats */}
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

        {/* Interactive Water Chemistry Lab */}
        <div className="mt-14 sm:mt-24 grid gap-8 sm:gap-12 lg:grid-cols-2 items-start">
          <Reveal className="glass rounded-2xl p-6 sm:p-8 md:p-10 border border-border/80 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div>
                <span className="eyebrow text-[10px] text-live">Simulador de Química Acuática</span>
                <h3 className="font-display text-2xl sm:text-3xl text-foreground">
                  Parámetros del Agua en Vivo
                </h3>
              </div>
              <button
                onClick={resetParams}
                className="flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 px-3 py-1 text-xs text-muted-foreground transition-all"
                title="Restablecer a valores óptimos de biotopo"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restablecer óptimos</span>
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              {/* Temperatura */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Thermometer className="h-4 w-4 text-live" /> Temperatura
                  </span>
                  <span className="font-mono text-base font-semibold text-live">{temp} °C</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={32}
                  step={0.5}
                  value={temp}
                  onChange={(e) => {
                    setTemp(parseFloat(e.target.value));
                    aquariumAudio.playBubblePlop(400 + temp * 15);
                  }}
                  className="w-full accent-[var(--live,#06b6d4)] h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
                  <span>18 °C (Frío)</span>
                  <span className="text-emerald-400 font-bold">22–28 °C (Ideal)</span>
                  <span>32 °C (Cálido)</span>
                </div>
              </div>

              {/* pH */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Droplets className="h-4 w-4 text-live" /> Nivel de pH
                  </span>
                  <span className="font-mono text-base font-semibold text-live">
                    {ph.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5.5}
                  max={9.0}
                  step={0.1}
                  value={ph}
                  onChange={(e) => {
                    setPh(parseFloat(e.target.value));
                    aquariumAudio.playBubblePlop(500 + ph * 40);
                  }}
                  className="w-full accent-[var(--live,#06b6d4)] h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
                  <span>5.5 (Ácido)</span>
                  <span className="text-emerald-400 font-bold">6.8–7.8 (Neutro-Alcalino)</span>
                  <span>9.0 (Muy alcalino)</span>
                </div>
              </div>

              {/* GH */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-live" /> Dureza General (GH)
                  </span>
                  <span className="font-mono text-base font-semibold text-live">{gh} °dGH</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={28}
                  step={1}
                  value={gh}
                  onChange={(e) => {
                    setGh(parseInt(e.target.value));
                    aquariumAudio.playBubblePlop(450 + gh * 15);
                  }}
                  className="w-full accent-[var(--live,#06b6d4)] h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
                  <span>2 (Blanda)</span>
                  <span className="text-emerald-400 font-bold">8–20 (Dura-Mineralizada)</span>
                  <span>28 (Muy dura)</span>
                </div>
              </div>
            </div>

            {/* Comfort Status Meter */}
            <div className="mt-8 rounded-xl border border-border/80 bg-abyss/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono text-muted-foreground">
                  Índice de Confort del Guppy
                </span>
                <span className="font-mono text-lg font-bold text-live">{overallScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${overallScore}%`,
                    backgroundColor:
                      overallScore >= 88
                        ? "#10b981"
                        : overallScore >= 70
                          ? "#06b6d4"
                          : overallScore >= 50
                            ? "#f59e0b"
                            : "#f43f5e",
                  }}
                />
              </div>

              <div
                className={`mt-3 flex items-start gap-2.5 rounded-lg border p-3 ${status.badgeClass}`}
              >
                <StatusIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">{status.label}</p>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{status.desc}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Biological Notes Grid */}
          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-border sm:grid-cols-2 shadow-2xl">
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
