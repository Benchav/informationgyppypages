import red from "@/assets/g-red.jpg";
import cobra from "@/assets/g-cobra.jpg";
import endler from "@/assets/g-endler.jpg";
import tank from "@/assets/g-tank.jpg";
import heroPhoto from "@/assets/guppy-hero.jpg";

export { heroPhoto };

export const facts = [
  { k: "Origen", v: "Caribe y norte de Sudamérica", n: "1866", unit: "descrito" },
  { k: "Tamaño", v: "Machos 3–4 cm · hembras hasta 6 cm", n: "6", unit: "cm máx." },
  { k: "Esperanza de vida", v: "Con buenos cuidados", n: "2–3", unit: "años" },
  { k: "Gestación", v: "Vivíparo: nacen alevines nadando", n: "28", unit: "días" },
];

export const params = [
  { label: "Temperatura", min: 18, max: 32, from: 22, to: 28, unit: "°C" },
  { label: "pH", min: 5, max: 9, from: 6.8, to: 7.8, unit: "" },
  { label: "Dureza (GH)", min: 0, max: 30, from: 8, to: 20, unit: "°dGH" },
];

export const notes = [
  {
    t: "Alimentación",
    d: "Omnívoro. Escamas de calidad, artemia, daphnia y vegetales. 2 tomas pequeñas al día.",
  },
  {
    t: "Comportamiento",
    d: "Pacífico y sociable. Mejor en grupos con proporción de 1 macho por 2–3 hembras.",
  },
  {
    t: "Compatibilidad",
    d: "Corydoras, tetras pequeños, rasboras, otocinclus y gambas. Evitar peces que muerden aletas.",
  },
  { t: "Reproducción", d: "Extremadamente prolífico. Plantas densas protegen a los alevines." },
];

export const careSteps = [
  {
    n: "01",
    t: "Preparar el acuario",
    d: "Mínimo 40 litros, filtro suave y ciclado completo de 3–4 semanas antes de introducir peces.",
  },
  {
    n: "02",
    t: "Calidad del agua",
    d: "Amoníaco y nitritos en 0. Nitratos por debajo de 20 ppm. Agua sin cloro.",
  },
  {
    n: "03",
    t: "Temperatura",
    d: "Estable entre 24 y 26 °C. Un calentador con termostato evita oscilaciones.",
  },
  {
    n: "04",
    t: "Alimentación",
    d: "Poco y variado. Lo que se coma en 2 minutos. Un día de ayuno semanal.",
  },
  {
    n: "05",
    t: "Compañeros",
    d: "Especies pequeñas y pacíficas. Nada de bettas, barbos tigre ni cíclidos.",
  },
  {
    n: "06",
    t: "Limpieza",
    d: "Cambios del 20–30 % semanales y sifonado del sustrato. El filtro se enjuaga con agua del acuario.",
  },
  {
    n: "07",
    t: "Reproducción",
    d: "Una hembra puede parir 20–50 alevines al mes. Ofrece musgo o una paridera.",
  },
];

export const gallery = [
  {
    id: "g1",
    img: heroPhoto,
    w: 1920,
    h: 1282,
    name: "Prisma",
    variety: "Fancy Multicolor",
    colors: ["Azul", "Verde", "Naranja"],
    traits: "Cola delta con gradiente iridiscente",
    care: "Agua impecable, sin corriente fuerte",
    behavior: "Exhibicionista y tranquilo",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "g2",
    img: red,
    w: 1024,
    h: 1280,
    name: "Brasa",
    variety: "Full Red",
    colors: ["Rojo", "Plata"],
    traits: "Pigmentación roja completa",
    care: "Dieta rica en carotenos",
    behavior: "Pacífico",
    span: "md:row-span-2",
  },
  {
    id: "g3",
    img: cobra,
    w: 1280,
    h: 896,
    name: "Víbora",
    variety: "Yellow Cobra",
    colors: ["Amarillo", "Negro"],
    traits: "Patrón snakeskin en todo el cuerpo",
    care: "Iluminación media",
    behavior: "Dominante, no agresivo",
    span: "",
  },
  {
    id: "g4",
    img: endler,
    w: 1024,
    h: 1024,
    name: "Chispa",
    variety: "Endler",
    colors: ["Neón", "Naranja", "Verde"],
    traits: "Tamaño mini, marcas eléctricas",
    care: "Muy resistente",
    behavior: "Rápido y enérgico",
    span: "",
  },
  {
    id: "g5",
    img: tank,
    w: 1536,
    h: 864,
    name: "Cardumen",
    variety: "Grupo mixto",
    colors: ["Variados"],
    traits: "Comunidad en acuario plantado",
    care: "Proporción 1 macho : 3 hembras",
    behavior: "Social",
    span: "md:col-span-3",
  },
];
export type GalleryItem = (typeof gallery)[number];
