// src/services/ingredientConfig.ts

/** Grams per single egg. */
export const EGG_WEIGHT_G = 50

/** Returns the midpoint of an ingredient quantity range (e.g. "1–2 Eier" → 1.5). */
export function resolveRange(min: number, max: number): number {
  return (min + max) / 2
}

/** German unit abbreviations mapped to their gram/ml equivalent */
export const UNIT_MULTIPLIERS: Record<string, number> = {
  g: 1,
  gr: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  liter: 1000,
  el: 15,
  tl: 5,
  prise: 1,
  msp: 0.5,
  tasse: 240, // 1 Tasse ≈ 240 ml/g
  dose: 400, // 1 Dose (Standarddose) ≈ 400 g
  zweig: 2, // 1 Zweig Kräuter ≈ 2 g
  zweige: 2,
  stange: 200, // 1 Stange Lauch ≈ 200 g
  stangen: 200,
  bund: 100, // 1 Bund ≈ 100 g
  scheibe: 30, // 1 Scheibe ≈ 30 g
  scheiben: 30,
  zehe: 5, // 1 Zehe Knoblauch ≈ 5 g
  zehen: 5,
  spritzer: 2,
  kugel: 90,
  kugeln: 90,
}

/** Approximate per-item gram weight for common count-based ingredients (no unit) */
export const PLAIN_COUNT_WEIGHTS: Record<string, number> = {
  apfel: 150,
  äpfel: 150,
  banane: 120,
  bananen: 120,
  zitrone: 100,
  zitronen: 100,
  orange: 180,
  orangen: 180,
  tomate: 100,
  tomaten: 100,
  kartoffel: 150,
  kartoffeln: 150,
  zwiebel: 80,
  zwiebeln: 80,
  karotte: 80,
  karotten: 80,
  möhre: 80,
  möhren: 80,
  zucchini: 250,
  gurke: 300,
  salatgurke: 300,
  salatgurken: 300,
  frühlingszwiebel: 20,
  frühlingszwiebeln: 20,
  paprika: 150,
  paprikaschote: 150,
  avocado: 200,
  avocados: 200,
}

/**
 * Merged union of words stripped before BLS matching (nutritionService) and
 * before parser adjective-stripping (ingredientParser). Replaces the former
 * MODIFIERS in nutritionData.ts and QUANTITY_ADJECTIVES in ingredientParser.ts.
 */
export const MODIFIERS = new Set([
  // frozen / processing
  'tk',
  'tiefkühl',
  'tiefgefroren',
  'tiefgekühlt',
  // preparation methods
  'frisch',
  'frische',
  'roh',
  'rohe',
  'reif',
  'reife',
  'reifer',
  'reifes',
  'getr.',
  'getrocknet',
  'getrocknete',
  'getrockneter',
  'getrocknetes',
  'gehackt',
  'gehackte',
  'gehackter',
  'gehacktes',
  'gemahlen',
  'gemahlene',
  'gemahlener',
  'gemahlenes',
  'gerieben',
  'geriebene',
  'geröstet',
  'geröstete',
  'eingelegt',
  'eingelegte',
  'geschält',
  'geschälte',
  'gekocht',
  'gekochte',
  'hartgekochte',
  'gegart',
  'gegarte',
  'gebacken',
  'gebackene',
  // size
  'klein',
  'kleine',
  'kleiner',
  'kleines',
  'groß',
  'große',
  'großer',
  'großes',
  'mittel',
  'mittlere',
  'mittlerer',
  'mittleres',
  'ganz',
  'ganze',
  'ganzer',
  'ganzes',
  'gute',
  'guter',
  'gutes',
  'guten',
  'fein',
  'feine',
  'feiner',
  'grob',
  'grobe',
  'grober',
  // quantity qualifiers (from former QUANTITY_ADJECTIVES)
  'gehäufte',
  'gehäufter',
  'gehäuftes',
  'gehäuften',
  'gestrichene',
  'gestrichener',
  'gestrichenes',
  'gestrichenen',
  'knappe',
  'knapper',
  'knappes',
  'knappen',
  'halbe',
  'halber',
  'halbes',
  'halben',
  // colour adjectives (from former QUANTITY_ADJECTIVES)
  'rote',
  'roter',
  'rotes',
  'roten',
  'gelbe',
  'gelber',
  'gelbes',
  'gelben',
  'grüne',
  'grüner',
  'grünes',
  'grünen',
  'weiße',
  'weißer',
  'weißes',
  'weißen',
  'schwarze',
  'schwarzer',
  'schwarzes',
  'schwarzen',
  'braune',
  'brauner',
  'braunes',
  'braunen',
  // temperature / state
  'kalt',
  'kalte',
  'kalter',
  'kaltes',
  'warm',
  'warme',
  'warmer',
  'heißes',
  // connectors
  'oder',
  'und',
  'mit',
])

/**
 * Maps common German ingredient names (lowercase, modifier-stripped) to a more
 * specific BLS search query. Checked before fuzzy search to avoid ambiguous
 * short queries matching obscure compounds (e.g. flour matching arrowroot flour).
 */
export const INGREDIENT_OVERRIDES: Record<string, string> = {
  // Flour & grains
  mehl: 'Weizen Mehl, Type 550',
  weizenmehl: 'Weizen Mehl, Type 550',
  dinkelmehl: 'Dinkel Mehl, Type 630',
  roggenmehl: 'Roggen Mehl',
  maismehl: 'Mais Mehl',
  reismehl: 'Reis Mehl',
  stärke: 'Speisestärke',
  maisstärke: 'Speisestärke',
  haferflocken: 'Hafer Flocken',
  spaghetti: 'Nudeln',
  pasta: 'Nudeln',
  paniermehl: 'Semmelbrösel',
  // Dairy
  sojamilch: 'Sojadrink',
  butter: 'Butter mild gesäuert',
  milch: 'Vollmilch frisch, 3,5 % Fett, pasteurisiert',
  vollmilch: 'Vollmilch frisch, 3,5 % Fett, pasteurisiert',
  sahne: 'Schlagsahne',
  quark: 'Speisequark Fettstufe, 40 % Fett i. Tr.',
  magerquark: 'Speisequark Magerstufe, Magerquark < 10 % Fett i. Tr.',
  joghurt: 'Joghurt mild, mind. 3,5 % Fett',
  naturjoghurt: 'Joghurt mild, mind. 3,5 % Fett',
  käse: 'Gouda',
  fetakäse: 'Feta mind. 45 % Fett i. Tr.',
  feta: 'Feta mind. 45 % Fett i. Tr.',
  // Eggs
  ei: 'Hühnerei',
  eier: 'Hühnerei',
  // Oils & fats
  öl: 'Rapsöl',
  // Sweeteners
  zucker: 'Zucker weiß',
  vollrohrzucker: 'Zucker braun (Kandisfarin/Rohzucker)',
  rohrzucker: 'Zucker braun (Kandisfarin/Rohzucker)',
  // Salt, spices & herbs
  salz: 'Speisesalz',
  muskat: 'Muskatnuss',
  // Leavening & baking
  natron: 'Natriumhydrogencarbonat',
  vanille: 'Vanilleextrakt',
  // Vegetables
  cocktailtomaten: 'Tomate',
  cherrytomaten: 'Tomate',
  zwiebel: 'Speisezwiebel',
  zwiebeln: 'Speisezwiebel',
  frühlingszwiebeln: 'Frühlingszwiebel/Lauchzwiebel, roh',
  karotten: 'Karotte',
  möhren: 'Karotte',
  kartoffeln: 'Kartoffel',
  paprika: 'Gemüsepaprika',
  brokkoli: 'Broccoli',
  pilze: 'Champignon',
  lauch: 'Porree/Lauch, roh',
  // Legumes
  salatgurke: 'Gurke',
  salatgurken: 'Gurke',
  erbsen: 'Erbse grün',
  bohnen: 'Kidneybohne',
  linsen: 'Linse',
  kichererbsen: 'Kichererbse',
  // Proteins
  hähnchen: 'Hähnchenbrustfilet',
  hühnchen: 'Hähnchenbrustfilet',
  hackfleisch: 'Rinderhackfleisch',
  // Nuts & seeds
  mandeln: 'Mandel süß',
  haselnüsse: 'Haselnuss',
  walnüsse: 'Walnuss',
  erdnüsse: 'Erdnuss',
  cashews: 'Cashewnuss',
  // Fruits
  blaubeeren: 'Heidelbeere roh',
  orangenschale: 'Orange roh',
  // Condiments & liquids
  essig: 'Weinessig',
  brühe: 'Gemüsebrühe',
  wein: 'Weißwein',
  wasser: 'Trinkwasser',
  // Other
  schokolade: 'Zartbitterschokolade',
  erdnussbutter: 'Erdnussmus',
}
