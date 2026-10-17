import { Menu, X, Volume2, VolumeX, Sparkles, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { aquariumAudio } from "@/lib/aquarium-audio";

import { scrollToSurface } from "@/lib/aquarium-scroll";

const links = [
  ["#inicio", "Inicio 3D"],
  ["#guppy", "Biología"],
  ["#variedades", "Variedades"],
  ["#acuario", "Acuario"],
  ["#cuidados", "Cuidados"],
  ["#caracol", "Caracol"],
  ["#galeria", "Galería"],
] as const;

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(() => aquariumAudio.getMuted());

  useEffect(() => {
    return aquariumAudio.subscribe((isMuted) => setMuted(isMuted));
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const toggleSound = () => {
    aquariumAudio.toggleMute();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 lg:flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "glass mx-4 lg:mx-auto border border-border/80 shadow-xl backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <a
          href="#inicio"
          onClick={(e) => {
            if (scrolled) {
              e.preventDefault();
              scrollToSurface();
            }
          }}
          className="flex min-w-0 items-baseline gap-2 group"
        >
          <span className="font-display text-2xl italic tracking-wide group-hover:text-live transition-colors">
            Reticulata
          </span>
          <span className="eyebrow hidden sm:inline text-live text-[10px]">acuario digital 3D</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {links.map(([h, l]) => (
            <a
              key={h}
              href={h}
              onClick={(e) => {
                if (h === "#inicio" && scrolled) {
                  e.preventDefault();
                  scrollToSurface();
                }
              }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all"
            title={muted ? "Activar sonido ambiental de agua" : "Silenciar sonido"}
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-live animate-pulse" />
            )}
            <span className="font-mono text-[11px]">{muted ? "Mute" : "Audio"}</span>
          </button>

          <a
            href="#inicio"
            onClick={(e) => {
              if (scrolled) {
                e.preventDefault();
                scrollToSurface();
              }
            }}
            className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-live transition-all"
          >
            <Box className="h-3.5 w-3.5 text-live" />
            <span>Ver 3D</span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleSound}
            className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
            aria-label="Alternar audio"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-live" />}
          </button>
          <Button
            variant="aquarium"
            size="touch"
            className="h-9 w-9 rounded-full"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Principal móvil"
          className="glass mx-4 mt-2 grid max-h-[calc(100svh-100px)] gap-1 overflow-y-auto rounded-2xl p-4 shadow-2xl lg:hidden border border-border"
        >
          {links.map(([h, l]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-display text-2xl transition-colors hover:bg-white/5 hover:text-live"
            >
              {l}
            </a>
          ))}
        </nav>
      )}

      <motion.div
        className="fixed inset-x-0 top-0 h-[2px] origin-left bg-live shadow-[0_0_8px_var(--live)]"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
