export type Variety = {
  id: string;
  name: string;
  latin: string;
  color: string; // oklch accent driving the whole UI
  glow: string;
  tagline: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  behavior: string;
  size: string;
  traits: string[];
};

export const varieties: Variety[] = [
  {
    id: "blue",
    name: "Blue",
    latin: "P. reticulata · línea azul",
    color: "oklch(0.72 0.16 245)",
    glow: "oklch(0.85 0.12 230)",
    tagline: "Zafiro en movimiento",
    description:
      "Cuerpo y aletas en tonos cobalto con reflejos metálicos. Una de las líneas más estables y apreciadas en exhibición.",
    difficulty: 2,
    behavior: "Activo, nada a media altura",
    size: "4–5 cm",
    traits: ["Iridiscencia metálica", "Aleta delta", "Línea estable"],
  },
  {
    id: "red",
    name: "Red",
    latin: "Full Red",
    color: "oklch(0.66 0.21 28)",
    glow: "oklch(0.78 0.16 35)",
    tagline: "Fuego líquido",
    description:
      "Rojo intenso que cubre cuerpo y aletas. Los ejemplares 'full red' de ojo rojo son especialmente buscados.",
    difficulty: 3,
    behavior: "Pacífico, algo tímido al inicio",
    size: "4–5 cm",
    traits: ["Pigmento completo", "Cola amplia", "Color intensifica con dieta"],
  },
  {
    id: "yellow",
    name: "Yellow",
    latin: "Lemon / Golden",
    color: "oklch(0.86 0.16 95)",
    glow: "oklch(0.92 0.12 100)",
    tagline: "Luz de superficie",
    description:
      "Amarillo limón luminoso, a menudo sobre cuerpo dorado. Destaca enormemente sobre plantas oscuras.",
    difficulty: 2,
    behavior: "Curioso y sociable",
    size: "3.5–4.5 cm",
    traits: ["Alto contraste", "Cuerpo dorado", "Ideal en grupos"],
  },
  {
    id: "black",
    name: "Black",
    latin: "Black Moscow",
    color: "oklch(0.7 0.06 260)",
    glow: "oklch(0.55 0.08 270)",
    tagline: "Terciopelo nocturno",
    description:
      "Negro profundo con brillo azulado. Los Moscow muestran un tono uniforme y una presencia elegante.",
    difficulty: 3,
    behavior: "Tranquilo, nada lento",
    size: "4–5 cm",
    traits: ["Pigmentación densa", "Brillo azul", "Aletas grandes"],
  },
  {
    id: "orange",
    name: "Orange",
    latin: "Tangerine",
    color: "oklch(0.76 0.17 55)",
    glow: "oklch(0.84 0.13 60)",
    tagline: "Atardecer tropical",
    description:
      "Naranja cálido y uniforme. Muy resistente y perfecto para quien comienza con la cría.",
    difficulty: 1,
    behavior: "Muy activo",
    size: "3.5–4.5 cm",
    traits: ["Muy resistente", "Color cálido", "Prolífico"],
  },
  {
    id: "mosaic",
    name: "Mosaic",
    latin: "Mosaic Tail",
    color: "oklch(0.74 0.13 190)",
    glow: "oklch(0.84 0.11 180)",
    tagline: "Vitral viviente",
    description:
      "Patrón reticulado en la cola, como un vitral. Cada ejemplar presenta un dibujo único.",
    difficulty: 2,
    behavior: "Sociable, nada en cardumen",
    size: "4–5 cm",
    traits: ["Patrón irregular", "Base azul o roja", "Único por ejemplar"],
  },
  {
    id: "cobra",
    name: "Cobra",
    latin: "Snakeskin",
    color: "oklch(0.82 0.15 120)",
    glow: "oklch(0.88 0.12 115)",
    tagline: "Piel de serpiente",
    description:
      "Patrón vermicular sobre cuerpo y aletas que recuerda a la piel de una serpiente. Gran carácter visual.",
    difficulty: 3,
    behavior: "Dominante pero pacífico",
    size: "4–5 cm",
    traits: ["Patrón vermiculado", "Cuerpo y cola", "Genética ligada a Y"],
  },
  {
    id: "fancy",
    name: "Fancy",
    latin: "Fancy Guppy",
    color: "oklch(0.72 0.18 320)",
    glow: "oklch(0.82 0.14 340)",
    tagline: "Arte de la selección",
    description:
      "Resultado de décadas de cría selectiva: colas enormes y combinaciones imposibles de color.",
    difficulty: 4,
    behavior: "Delicado, evitar corrientes",
    size: "4–6 cm",
    traits: ["Colas extremas", "Multicolor", "Requiere agua impecable"],
  },
  {
    id: "endler",
    name: "Endler",
    latin: "P. wingei",
    color: "oklch(0.8 0.2 145)",
    glow: "oklch(0.86 0.17 140)",
    tagline: "El pariente salvaje",
    description:
      "Pequeño, eléctrico y con marcas neón. Pariente cercano del guppy, originario de Venezuela.",
    difficulty: 1,
    behavior: "Muy rápido y enérgico",
    size: "2–3 cm",
    traits: ["Tamaño mini", "Colores neón", "Muy resistente"],
  },
];
