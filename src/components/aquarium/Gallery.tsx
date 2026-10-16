import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { gallery, type GalleryItem } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";

const MotionButton = motion.create(Button);

export function Gallery() {
  const [open, setOpen] = useState<GalleryItem | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);


  return (
    <section id="galeria" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal><SectionLabel index="06">Galería</SectionLabel></Reveal>
        <Reveal><h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">Retratos <em className="text-live">bajo el agua</em></h2></Reveal>

        <div className="mt-14 grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.06} className={g.span}>
              <MotionButton variant="aquarium" size="touch" layoutId={`card-${g.id}`} onClick={() => setOpen(g)} className="group relative block h-full w-full overflow-hidden rounded-[1.5rem] text-left" data-cursor="Ver">
                <img src={g.img} alt={`${g.name}, ${g.variety}`} loading="lazy" width={g.w} height={g.h} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="eyebrow">{g.variety}</p>
                  <p className="mt-1 font-display text-3xl">{g.name}</p>
                </div>
              </MotionButton>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-abyss/85 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal aria-label={open.name}>
            <motion.div layoutId={`card-${open.id}`} onClick={(e) => e.stopPropagation()} className="relative grid max-h-[90svh] w-full max-w-5xl overflow-y-auto rounded-lg border border-border bg-deep md:grid-cols-[1.3fr_1fr]">
              <img src={open.img} alt={open.name} className="h-48 w-full object-cover sm:h-64 md:sticky md:top-0 md:h-full" />
              <div className="min-w-0 p-5 sm:p-8">
                <p className="eyebrow">{open.variety}</p>
                <h3 className="mt-2 font-display text-4xl sm:text-5xl">{open.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2">{open.colors.map((c) => <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">{c}</span>)}</div>
                <dl className="mt-8 grid gap-5 text-sm">
                  {[["Características", open.traits], ["Cuidados", open.care], ["Comportamiento", open.behavior]].map(([k, v]) => (
                    <div key={k} className="border-t border-border pt-4"><dt className="eyebrow">{k}</dt><dd className="mt-2 text-muted-foreground">{v}</dd></div>
                  ))}
                </dl>
                <Button variant="aquarium" size="touch" onClick={() => setOpen(null)} className="btn-ghost-water mt-8">Cerrar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
