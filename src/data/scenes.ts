export interface Scene {
  id: string;
  index: number;
  marker: string;
  eyebrow: string;
  hero: string;
  plain: string;
  body: string;
  consoleMode: string;
}

export const SCENES: Scene[] = [
  {
    id: "calibration",
    index: 1,
    marker: "I / CALIBRATION",
    eyebrow: "REFERENCE",
    hero: "You are the universe's reference.",
    plain: "We begin with something familiar so the unknown can become legible.",
    body: "The ordinary does not reduce wonder. It gives wonder a scale you can hold.",
    consoleMode: "trp-minimal",
  },
  {
    id: "banana-scale",
    index: 2,
    marker: "II / BANANA FOR SCALE",
    eyebrow: "REFERENCE",
    hero: "The familiar makes the strange measurable.",
    plain: "Reference turns mystery into relation.",
    body: "A banana works because we already know it. Familiar scale makes the unknown tangible.",
    consoleMode: "reference",
  },
  {
    id: "trp",
    index: 3,
    marker: "III / TRP",
    eyebrow: "RELATION",
    hero: "The between is real.",
    plain: "A and B are not enough. Structure appears when a relationship holds between them.",
    body: "The third term is not a midpoint. It is the energetic relation that makes the poles matter.",
    consoleMode: "trp-live",
  },
  {
    id: "fold",
    index: 4,
    marker: "IV / FOLD",
    eyebrow: "STRUCTURE",
    hero: "A fold is tension that held.",
    plain: "When uneven forces do not cancel or collapse, they can stabilize into form.",
    body: "A fold is not decoration on a surface. It is a structural event in a field.",
    consoleMode: "field",
  },
  {
    id: "stability",
    index: 5,
    marker: "V / STABILITY",
    eyebrow: "PERSISTENCE",
    hero: "Not every fold survives.",
    plain: "Structure begins when a pattern resists being flattened back out.",
    body: "Persistence is not stillness. It is resistance to unfolding.",
    consoleMode: "stability",
  },
  {
    id: "taxonomy",
    index: 6,
    marker: "VI / TAXONOMY",
    eyebrow: "LIFE",
    hero: "Some folds do more.",
    plain: "Some structures persist. Some generate others. Some actively preserve their continuation.",
    body: "Survive. Seed. Defend. The difference is not poetry. It is behavior.",
    consoleMode: "taxonomy",
  },
  {
    id: "fold-back",
    index: 7,
    marker: "VII / FOLD BACK",
    eyebrow: "AGENCY",
    hero: "Some folds learn to answer.",
    plain: "A reflective fold does not just endure pressure. It changes the field it lives in.",
    body: "Memory and response turn persistence into participation.",
    consoleMode: "agency",
  },
  {
    id: "writes",
    index: 8,
    marker: "VIII / THE FOLD THAT WRITES",
    eyebrow: "WRITING",
    hero: "You are the fold that writes.",
    plain: "What you perceive, remember, and do reshapes the relations around you.",
    body: "Complete a triad and watch structure become personal.",
    consoleMode: "final",
  },
];
