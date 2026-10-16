import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MODEL_URL, heroPhoto } from "@/data/content";

/** Eager RealityMAX embed; show its own loading progress without waiting for window.load. */
export function ModelViewer() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border">
      <div className="absolute inset-0 bg-water" />
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <img src={heroPhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 blur-md" />
          <div className="relative h-12 w-12 animate-spin rounded-full border-2 border-live/20 border-t-live" />
          <span className="eyebrow relative">Cargando modelo 3D</span>
        </div>
      )}
      <iframe
        src={MODEL_URL}
        title="Modelo 3D interactivo de pez Guppy"
        className={`absolute inset-0 h-full w-full ${active ? "" : "pointer-events-none lg:pointer-events-auto"}`}
        allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
        allowFullScreen
        loading="eager"
        onLoad={() => setLoaded(true)}
      />
      {active && <Button variant="aquarium" size="touch" onClick={() => setActive(false)} className="glass absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 text-xs lg:hidden">Salir del modelo</Button>}
      {/* On touch devices, tap to enter the model so page scroll isn't hijacked */}
      {!active && (
        <Button variant="aquarium" size="touch" onClick={() => setActive(true)} className="glass absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs lg:hidden">
          Toca para interactuar
        </Button>
      )}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
        <span className="eyebrow">Guppy · 3D</span>
      </div>
      <a href={MODEL_URL} target="_blank" rel="noreferrer" className="glass absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
        Pantalla completa ↗
      </a>
    </div>
  );
}
