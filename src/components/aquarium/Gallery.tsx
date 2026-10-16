import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { gallery, type GalleryItem } from "@/data/content";
import { Reveal, SectionLabel } from "./Reveal";
import { aquariumAudio } from "@/lib/aquarium-audio";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const MotionButton = motion.create(Button);

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openItem = selectedIndex !== null ? gallery[selectedIndex] : null;

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      aquariumAudio.playBubblePlop(620);
      setSelectedIndex((selectedIndex + 1) % gallery.length);
    },
    [selectedIndex],
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      aquariumAudio.playBubblePlop(580);
      setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length);
    },
    [selectedIndex],
  );

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [selectedIndex, handleNext, handlePrev]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selectedIndex]);

  return (
    <section id="galeria" className="relative px-5 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="06">Galería Visual</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95]">
            Retratos <em className="text-live">bajo el agua</em>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Fotografía macro de ejemplares selectos. Haz clic en cualquier espécimen para abrir la
            ficha fotográfica interactiva en alta resolución.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[280px] grid-cols-1 gap-5 md:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.06} className={g.span}>
              <MotionButton
                variant="aquarium"
                size="touch"
                layoutId={`card-${g.id}`}
                onClick={() => {
                  aquariumAudio.playBubblePlop(680);
                  setSelectedIndex(i);
                }}
                className="group relative block h-full w-full overflow-hidden rounded-[2rem] text-left border border-border/80 shadow-xl"
                data-cursor="Ver"
              >
                <img
                  src={g.img}
                  alt={`${g.name}, ${g.variety}`}
                  loading="lazy"
                  width={g.w}
                  height={g.h}
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-abyss/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute top-4 right-4 rounded-full bg-black/40 p-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                  <ZoomIn className="h-4 w-4" />
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="eyebrow text-xs text-live">{g.variety}</p>
                  <p className="mt-1 font-display text-3xl text-white">{g.name}</p>
                </div>
              </MotionButton>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {openItem && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal
            aria-label={openItem.name}
          >
            {/* Modal Box */}
            <motion.div
              layoutId={`card-${openItem.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-3xl border border-border/80 bg-deep/95 shadow-2xl md:grid-cols-[1.25fr_1fr]"
            >
              <div className="relative h-64 sm:h-80 md:h-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={openItem.img}
                  alt={openItem.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
                  {selectedIndex !== null ? selectedIndex + 1 : 1} / {gallery.length}
                </div>

                {/* Arrow navigation on image */}
                <button
                  onClick={handlePrev}
                  className="glass absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20 transition-all"
                  aria-label="Espécimen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="glass absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20 transition-all"
                  aria-label="Siguiente espécimen"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="min-w-0 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50svh] md:max-h-none">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="eyebrow text-xs text-live">{openItem.variety}</p>
                      <h3 className="mt-1 font-display text-4xl sm:text-5xl text-foreground">
                        {openItem.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedIndex(null)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {openItem.colors.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <dl className="mt-6 grid gap-4 text-sm">
                    {[
                      ["Morfología y Rasgos", openItem.traits],
                      ["Requerimientos de Cuidado", openItem.care],
                      ["Comportamiento Social", openItem.behavior],
                    ].map(([k, v]) => (
                      <div key={k} className="border-t border-border/80 pt-3">
                        <dt className="eyebrow text-[10px] text-live">{k}</dt>
                        <dd className="mt-1 text-xs text-muted-foreground leading-relaxed">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-8 pt-4 border-t border-border/80 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                      className="rounded-full gap-1 text-xs"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      className="rounded-full gap-1 text-xs"
                    >
                      Siguiente <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="aquarium"
                    size="touch"
                    onClick={() => setSelectedIndex(null)}
                    className="btn-ghost-water text-xs"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
