import { Bubbles } from "./Ambient";
import { Reveal } from "./Reveal";
import { scrollToSurface } from "@/lib/aquarium-scroll";

export function Outro() {
  return (
    <footer className="relative overflow-hidden border-t border-border px-5 pb-10 pt-32">
      <Bubbles count={12} />
      <div className="relative mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="eyebrow">Fin del recorrido</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-4xl sm:text-6xl lg:text-8xl leading-[0.92]">
            Cada guppy es <em className="text-iris">una pieza única</em>.
          </h2>
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSurface();
            }}
            className="btn-live mt-12 cursor-pointer inline-flex items-center gap-2 group transition-all"
            title="Subir rápidamente a la superficie"
          >
            <span>Volver a la superficie</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          </a>
        </Reveal>
        <div className="mt-28 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <span className="font-display text-lg italic text-foreground">Reticulata</span>
          <span>Acuario digital educativo sobre Poecilia reticulata</span>
        </div>
      </div>
    </footer>
  );
}
