import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bubbles, SwimmingFish } from "./Ambient";
import { ModelViewer } from "./ModelViewer";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yModel = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative overflow-hidden bg-water">
      <div className="light-rays absolute inset-0" />
      <div className="caustics absolute inset-0 opacity-60" />
      <SwimmingFish count={4} />
      <Bubbles count={22} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-5 pb-10 pt-24 lg:pb-16 lg:pt-28 lg:grid-cols-[1fr_1.15fr] lg:gap-6">
        <motion.div style={{ y: yText, opacity: fade }} className="min-w-0 order-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="eyebrow mb-6"
          >
            Poecilia reticulata — Exhibición n.º 01
          </motion.p>
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
            Descubre uno de los peces de acuario más fascinantes, coloridos y versátiles del mundo.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 grid gap-3 sm:flex sm:flex-wrap lg:mt-10"
          >
            <a href="#variedades" className="btn-live">
              Explorar Guppys <span aria-hidden>→</span>
            </a>
            <a href="#guppy" className="btn-ghost-water">
              Ver características
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yModel }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 h-[min(52svh,420px)] min-h-[280px] lg:h-[78svh]"
        >
          <ModelViewer />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="eyebrow">Sumérgete</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-live to-transparent" />
      </div>
    </section>
  );
}
