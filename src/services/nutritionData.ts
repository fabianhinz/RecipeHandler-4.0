// cSpell:disable

/**
 * Words that describe preparation, size, or state but don't identify the ingredient.
 * Common inflected forms are included to avoid a dependency on runtime stemming for filtering.
 * Stripped from ingredient names before BLS fuzzy search.
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
  'ganz',
  'ganze',
  'ganzer',
  'ganzes',
  'gute',
  'fein',
  'feine',
  'feiner',
  'grob',
  'grobe',
  'grober',
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
  pasta: 'Nudeln',
  paniermehl: 'Semmelbrösel',
  // Dairy
  sojamilch: 'Sojadrink',
  butter: 'Butter mild gesäuert',
  milch: 'Vollmilch',
  sahne: 'Schlagsahne',
  quark: 'Speisequark',
  magerquark: 'Speisequark',
  naturjoghurt: 'Joghurt',
  käse: 'Gouda',
  // Eggs
  ei: 'Hühnerei',
  eier: 'Hühnerei',
  // Oils & fats
  öl: 'Rapsöl',
  // Sweeteners
  zucker: 'Zucker weiß',
  // Salt, spices & herbs
  salz: 'Speisesalz',
  muskat: 'Muskatnuss',
  // Leavening & baking
  natron: 'Natriumhydrogencarbonat',
  vanille: 'Vanilleextrakt',
  // Vegetables
  tomaten: 'Tomate',
  zwiebel: 'Speisezwiebel',
  zwiebeln: 'Speisezwiebel',
  karotten: 'Karotte',
  möhren: 'Möhre',
  kartoffeln: 'Kartoffel',
  paprika: 'Gemüsepaprika',
  brokkoli: 'Broccoli',
  champignons: 'Champignon',
  pilze: 'Champignon',
  // Legumes
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
  äpfel: 'Apfel',
  bananen: 'Banane',
  zitronen: 'Zitrone',
  orangen: 'Orange',
  erdbeeren: 'Erdbeere',
  himbeeren: 'Himbeere',
  blaubeeren: 'Blaubeere',
  // Condiments & liquids
  essig: 'Weinessig',
  brühe: 'Gemüsebrühe',
  wein: 'Weißwein',
  // Other
  schokolade: 'Zartbitterschokolade',
  erdnussbutter: 'Erdnussmus',
}

// cSpell:enable
