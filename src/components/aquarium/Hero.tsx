import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bubbles, SwimmingFish } from "./Ambient";
import { ModelViewer } from "./ModelViewer";
import type { Variety } from "@/data/varieties";
import { Volume2, VolumeX, Sparkles, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { aquariumAudio } from "@/lib/aquarium-audio";

export function Hero({
  activeVariety,
  onSelectVariety,
}: {
  activeVariety?: Variety;
  onSelectVariety?: (v: Variety) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yModel = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [muted, setMuted] = useState(() => aquariumAudio.getMuted());
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    return aquariumAudio.subscribe((isMuted) => setMuted(isMuted));
  }, []);

  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleAudio = () => {
    aquariumAudio.toggleMute();
  };

  return (
    <section id="inicio" ref={ref} className="relative overflow-hidden bg-water">
      <div className="light-rays absolute inset-0" />
      <div className="caustics absolute inset-0 opacity-60" />
      <SwimmingFish count={4} />
      <Bubbles count={22} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-5 pb-10 pt-24 lg:pb-16 lg:pt-28 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
        <motion.div style={isLg ? { y: yText, opacity: fade } : {}} className="min-w-0 order-1">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="eyebrow">Poecilia reticulata</span>
            <span className="h-1 w-1 rounded-full bg-live" />
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono text-live">
              <Activity className="h-3 w-3 animate-pulse" /> Acuario 3D en tiempo real
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-6xl lg:text-8xl leading-[1.02]"
          >
            El mundo <em className="text-iris">fascinante</em>
            <br /> del Guppy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-5 max-w-md text-base sm:mt-8 sm:text-lg leading-relaxed text-muted-foreground"
          >
            Descubre uno de los peces de acuario más coloridos y resistentes del planeta. Interactúa
            con el modelo 3D con física de nado fluido, explora su anatomía y personaliza tu
            acuario.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 text-xs"
          >
            {[
              { label: "Temperatura", val: "22–28 °C" },
              { label: "pH", val: "6.8–7.8" },
              { label: "Tamaño", val: "3–6 cm" },
              { label: "Gestación", val: "28 días" },
            ].map((m) => (
              <div key={m.label} className="glass rounded-xl px-3 py-1.5 border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                  {m.label}
                </span>
                <span className="font-semibold text-foreground">{m.val}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#variedades" className="btn-live">
              Explorar Variedades <span aria-hidden>→</span>
            </a>
            <a href="#guppy" className="btn-ghost-water">
              Fisiología & Hábitat
            </a>
            <button
              onClick={toggleAudio}
              className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-all"
              title={muted ? "Activar sonido ambiental de agua" : "Silenciar sonido"}
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-live animate-pulse" />
              )}
              <span>{muted ? "Sonido agua" : "Ambiente activo"}</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          style={isLg ? { y: yModel } : {}}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 h-[min(65svh,480px)] min-h-[350px] sm:h-[460px] lg:h-[82svh] mt-3 lg:mt-0"
        >
          <ModelViewer activeVarietyId={activeVariety?.id} onSelectVariety={onSelectVariety} />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="eyebrow">Sumérgete</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-live to-transparent" />
      </div>
    </section>
  );
}
