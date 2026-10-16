import gold from "@/assets/s-gold.webp";
import blue from "@/assets/s-blue.webp";
import wild from "@/assets/s-wild.webp";

export const snailMorphs = [
  { id: "gold", name: "Dorado", latin: "Pomacea diffusa · gold", img: gold, color: "oklch(0.8 0.15 85)", note: "El más popular. Concha amarilla brillante y cuerpo claro; destaca sobre plantas oscuras." },
  { id: "blue", name: "Azul", latin: "Pomacea diffusa · blue", img: blue, color: "oklch(0.62 0.07 245)", note: "Concha gris azulada y cuerpo oscuro. Tranquilo, ideal para acuarios comunitarios." },
  { id: "wild", name: "Salvaje", latin: "Pomacea diffusa · wild", img: wild, color: "oklch(0.55 0.08 70)", note: "Coloración original con bandas oscuras. Es el más resistente de todos." },
];
export type SnailMorph = (typeof snailMorphs)[number];

/** Anatomy hotspots — positions in % of the side-view image. */
export const snailAnatomy = [
  { id: "shell", x: 32, y: 44, t: "Concha", d: "Espiral de carbonato de calcio. Necesita agua con GH ≥ 8 y calcio extra (sepia) para no agrietarse." },
  { id: "siphon", x: 69, y: 34, t: "Sifón", d: "Tubo respiratorio: sube a la superficie y respira aire con su pulmón. ¡Deja espacio sin tapar arriba!" },
  { id: "tentacles", x: 90, y: 44, t: "Tentáculos", d: "Dos largos tentáculos táctiles y quimiorreceptores para encontrar comida." },
  { id: "eyes", x: 76, y: 62, t: "Ojos", d: "En la base de los tentáculos. Detectan luz y sombra, no imágenes nítidas." },
  { id: "foot", x: 42, y: 73, t: "Pie", d: "Músculo con el que se desliza sobre cristal y plantas, dejando un fino rastro de mucosa." },
  { id: "operculum", x: 58, y: 62, t: "Opérculo", d: "Una 'puerta' córnea que cierra la concha cuando se retrae o se siente amenazado." },
];

export const snailFacts = [
  { n: "5", unit: "cm", k: "Tamaño adulto" },
  { n: "1–2", unit: "años", k: "Esperanza de vida" },
  { n: "20–28", unit: "°C", k: "Temperatura" },
  { n: "7.2–8", unit: "pH", k: "Rango ideal" },
];

export const snailLifecycle = [
  { t: "Puesta", d: "Racimos rosados de 200+ huevos fuera del agua, sobre el cristal." },
  { t: "Eclosión", d: "Entre 2 y 4 semanas después. Las crías caen al agua." },
  { t: "Juvenil", d: "Crecen rápido con buena comida y calcio. 1 cm al mes." },
  { t: "Adulto", d: "A los 3–4 meses ya pueden reproducirse." },
];

export const snailWithGuppy = [
  "Comen restos de alimento y algas blandas: aliados de limpieza.",
  "No molestan a guppys ni alevines; son totalmente pacíficos.",
  "Prefieren agua dura y alcalina, igual que el guppy.",
  "Ojo: comen plantas muy tiernas si pasan hambre. Dales verduras escaldadas.",
];
