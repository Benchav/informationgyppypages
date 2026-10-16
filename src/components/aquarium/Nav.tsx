import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  ["#inicio", "Inicio"],
  ["#guppy", "Guppys"],
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
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`mx-auto mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 lg:flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${scrolled ? "glass mx-4 lg:mx-auto" : "bg-transparent"}`}>
        <a href="#inicio" className="flex min-w-0 items-baseline gap-2">
          <span className="font-display text-2xl italic">Reticulata</span>
          <span className="eyebrow hidden sm:inline">acuario digital</span>
        </a>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Principal">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>
          ))}
        </nav>
        <Button variant="aquarium" size="touch" className="lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-controls="mobile-navigation" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="Principal móvil" className="glass mx-4 mt-2 grid max-h-[calc(100svh-100px)] gap-1 overflow-y-auto rounded-lg p-3 lg:hidden">
          {links.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-display text-2xl">{l}</a>
          ))}
        </nav>
      )}
      <motion.div className="fixed inset-x-0 top-0 h-[2px] origin-left bg-live" style={{ scaleX: progress }} />
    </header>
  );
}
