export type HabitatOption = { id: string; label: string; info: string };
export type HabitatCategory = { id: "plants" | "rocks" | "light" | "fish" | "decor" | "substrate"; label: string; options: HabitatOption[] };

export const habitat: HabitatCategory[] = [
  { id: "plants", label: "Plantas", options: [
    { id: "none", label: "Sin plantas", info: "Sin plantas, los nitratos suben y los alevines no tienen refugio." },
    { id: "light", label: "Ligeras", info: "Anubias y helechos: fáciles, poca luz, ideales para empezar." },
    { id: "dense", label: "Densas", info: "Vallisneria, musgo y Limnophila: refugio total y agua más estable." },
  ]},
  { id: "rocks", label: "Rocas", options: [
    { id: "none", label: "Ninguna", info: "Espacio abierto de nado." },
    { id: "seiryu", label: "Seiryu", info: "Aporta estructura. Puede subir ligeramente la dureza, algo que el guppy agradece." },
    { id: "dragon", label: "Dragon stone", info: "Textura dramática, químicamente inerte." },
  ]},
  { id: "light", label: "Iluminación", options: [
    { id: "day", label: "Día", info: "Luz blanca 6500K: realza colores naturales y favorece plantas." },
    { id: "dusk", label: "Atardecer", info: "Tonos cálidos para las últimas horas. Reduce el estrés." },
    { id: "night", label: "Luna", info: "Luz azul tenue. Apaga por completo 8–10 h cada noche." },
  ]},
  { id: "fish", label: "Peces", options: [
    { id: "3", label: "Trío", info: "1 macho + 2 hembras: el mínimo recomendado." },
    { id: "6", label: "Grupo", info: "Grupo de 6: comportamiento social visible. ~60 litros." },
    { id: "10", label: "Cardumen", info: "Cardumen de 10: espectáculo completo. 80+ litros." },
  ]},
  { id: "decor", label: "Decoración", options: [
    { id: "none", label: "Natural", info: "Aquascape limpio, sin objetos." },
    { id: "wood", label: "Tronco", info: "Madera natural: libera taninos y crea zonas de sombra." },
    { id: "cave", label: "Cueva", info: "Refugio para hembras grávidas." },
  ]},
  { id: "substrate", label: "Sustrato", options: [
    { id: "sand", label: "Arena", info: "Arena fina clara: fácil de sifonar, refleja la luz." },
    { id: "gravel", label: "Grava", info: "Grava oscura: los colores del guppy resaltan más." },
    { id: "soil", label: "Nutritivo", info: "Sustrato nutritivo: imprescindible para plantas exigentes." },
  ]},
];

export type HabitatState = Record<HabitatCategory["id"], string>;
export const defaultHabitat: HabitatState = { plants: "light", rocks: "seiryu", light: "day", fish: "6", decor: "wood", substrate: "sand" };
