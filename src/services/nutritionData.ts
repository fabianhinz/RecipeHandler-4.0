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
  'rohe',
  'reif',
  'reife',
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
  milch: 'Vollmilch frisch, 3,5 % Fett, pasteurisiert',
  vollmilch: 'Vollmilch frisch, 3,5 % Fett, pasteurisiert',
  sahne: 'Schlagsahne',
  quark: 'Speisequark Fettstufe, 40 % Fett i. Tr.',
  magerquark: 'Speisequark Magerstufe, Magerquark < 10 % Fett i. Tr.',
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
  // Other
  schokolade: 'Zartbitterschokolade',
  erdnussbutter: 'Erdnussmus',
}
