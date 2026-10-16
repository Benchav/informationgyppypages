import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import { varieties, type Variety } from "@/data/varieties";
import { MODEL_URL, heroPhoto } from "@/data/content";
import { Nav } from "@/components/aquarium/Nav";
import { Hero } from "@/components/aquarium/Hero";
import { MeetGuppy } from "@/components/aquarium/MeetGuppy";
import { Varieties } from "@/components/aquarium/Varieties";
import { Habitat } from "@/components/aquarium/Habitat";
import { Care } from "@/components/aquarium/Care";
import { AppleSnail } from "@/components/aquarium/AppleSnail";
import { Gallery } from "@/components/aquarium/Gallery";
import { Outro } from "@/components/aquarium/Outro";
import { Cursor } from "@/components/aquarium/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reticulata — El mundo fascinante del Guppy" },
      { name: "description", content: "Acuario digital inmersivo: modelo 3D, variedades, hábitat interactivo y guía de cuidados del pez Guppy." },
      { property: "og:title", content: "Reticulata — El mundo fascinante del Guppy" },
      { property: "og:description", content: "Explora el Guppy en 3D, sus variedades de color y cómo crear su hábitat perfecto." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroPhoto },
      { name: "twitter:image", content: heroPhoto },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      // Warm the viewer and its CORS model/texture connection while parsing the head.
      { rel: "preconnect", href: new URL(MODEL_URL).origin },
      { rel: "dns-prefetch", href: new URL(MODEL_URL).origin },
      { rel: "preconnect", href: "https://cdn.realitymax.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.realitymax.com" },
      // LCP: hero photo behind the 3D model — fetch it before anything else.
      { rel: "preload", as: "image", href: heroPhoto, fetchPriority: "high" },
    ],
  }),
  component: Index,
});

function Index() {
  const [variety, setVariety] = useState<Variety | undefined>(varieties[0]);
  if (!variety) return null;
  // The selected variety re-tints the whole experience via --live / --glow.
  const style = { "--live": variety.color, "--glow": variety.glow } as CSSProperties;
  return (
    <div style={style} className="relative">
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <MeetGuppy />
        <Varieties active={variety} onChange={setVariety} />
        <Habitat />
        <Care />
        <AppleSnail />
        <Gallery />
      </main>
      <Outro />
    </div>
  );
}
