import Fuse, { FuseResult } from 'fuse.js'
import { newStemmer } from 'snowball-stemmers'

export interface NutritionEntry {
  id: string
  name: string
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  sugar: number
  searchIndex: string
}

export interface NutritionResult {
  name: string
  blsCode: string
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  sugar: number
  score: number
}

export interface NutritionSummary {
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  sugar: number
}

export interface IngredientMatch {
  name: string
  amountG: number
  matched: NutritionResult | null
}

export interface NutritionDetailedResult {
  summary: NutritionSummary
  matches: IngredientMatch[]
}

const stemmer = newStemmer('german')

// Words that describe preparation, size, or state but don't identify the ingredient.
// Common inflected forms are included to avoid a dependency on runtime stemming for filtering.
const MODIFIERS = new Set([
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
 * Ingredients with no useful BLS entry — skipped before any search so the
 * fuzzy matcher cannot pick up unrelated compounds (e.g. "zimt" → "Zimtsterne").
 */
const SKIP_INGREDIENTS = new Set(['zimt']) // cSpell:ignore zimt

/**
 * Maps common German ingredient names (lowercase, modifier-stripped) to a more
 * specific BLS search query. Checked before fuzzy search to avoid ambiguous
 * short queries matching obscure compounds (e.g. flour matching arrowroot flour).
 */
// cSpell:disable
const INGREDIENT_OVERRIDES: Record<string, string> = {
  // Flour & grains
  mehl: 'Weizen Mehl, Type 550',
  weizenmehl: 'Weizen Mehl, Type 550',
  dinkelmehl: 'Dinkel Mehl, Type 630',
  roggenmehl: 'Roggen Mehl',
  maismehl: 'Mais Mehl',
  reismehl: 'Reis Mehl',
  speisestärke: 'Speisestärke',
  stärke: 'Speisestärke',
  maisstärke: 'Speisestärke',
  haferflocken: 'Hafer Flocken',
  reis: 'Reis',
  nudeln: 'Nudeln',
  pasta: 'Nudeln',
  spaghetti: 'Spaghetti',
  semmelbrösel: 'Semmelbrösel',
  paniermehl: 'Semmelbrösel',
  // Dairy
  butter: 'Butter',
  margarine: 'Margarine',
  sojamilch: 'Sojadrink',
  milch: 'Vollmilch',
  sahne: 'Schlagsahne',
  schlagsahne: 'Schlagsahne',
  joghurt: 'Joghurt',
  quark: 'Speisequark',
  magerquark: 'Speisequark',
  frischkäse: 'Frischkäse',
  schmand: 'Schmand',
  käse: 'Gouda',
  parmesan: 'Parmesan',
  mozzarella: 'Mozzarella',
  gouda: 'Gouda',
  edamer: 'Edamer',
  // Eggs
  ei: 'Hühnerei',
  eier: 'Hühnerei',
  // Oils & fats
  öl: 'Rapsöl',
  olivenöl: 'Olivenöl',
  rapsöl: 'Rapsöl',
  sonnenblumenöl: 'Sonnenblumenöl',
  kokosöl: 'Kokosöl',
  // Sweeteners
  zucker: 'Zucker weiß',
  puderzucker: 'Puderzucker',
  honig: 'Honig',
  ahornsirup: 'Ahornsirup',
  // Salt, spices & herbs
  salz: 'Speisesalz',
  pfeffer: 'Pfeffer',
  paprikapulver: 'Paprikapulver',
  muskat: 'Muskatnuss',
  kurkuma: 'Kurkuma',
  oregano: 'Oregano',
  basilikum: 'Basilikum',
  petersilie: 'Petersilie',
  thymian: 'Thymian',
  rosmarin: 'Rosmarin',
  majoran: 'Majoran',
  koriander: 'Koriander',
  // Leavening & baking
  backpulver: 'Backpulver',
  hefe: 'Hefe',
  natron: 'Natriumhydrogencarbonat',
  vanille: 'Vanilleextrakt',
  vanillezucker: 'Vanillezucker',
  // Vegetables
  tomate: 'Tomate',
  tomaten: 'Tomate',
  zwiebel: 'Speisezwiebel',
  zwiebeln: 'Speisezwiebel',
  knoblauch: 'Knoblauch',
  karotte: 'Karotte',
  karotten: 'Karotte',
  möhre: 'Möhre',
  möhren: 'Möhre',
  kartoffel: 'Kartoffel',
  kartoffeln: 'Kartoffel',
  zucchini: 'Zucchini',
  paprika: 'Gemüsepaprika',
  spinat: 'Spinat',
  brokkoli: 'Broccoli',
  blumenkohl: 'Blumenkohl',
  gurke: 'Gurke',
  champignon: 'Champignon',
  champignons: 'Champignon',
  pilze: 'Champignon',
  lauch: 'Lauch',
  sellerie: 'Sellerie',
  tomatenmark: 'Tomatenmark',
  // Legumes
  erbsen: 'Erbse grün',
  bohnen: 'Kidneybohne',
  linsen: 'Linse',
  kichererbsen: 'Kichererbse',
  // Proteins
  hähnchen: 'Hähnchenbrustfilet',
  hühnchen: 'Hähnchenbrustfilet',
  rindfleisch: 'Rindfleisch',
  schweinefleisch: 'Schweinefleisch',
  hackfleisch: 'Rinderhackfleisch',
  lachs: 'Lachs',
  thunfisch: 'Thunfisch',
  garnelen: 'Garnelen',
  tofu: 'Tofu',
  // Nuts & seeds
  mandeln: 'Mandel süß',
  haselnüsse: 'Haselnuss',
  walnüsse: 'Walnuss',
  erdnüsse: 'Erdnuss',
  cashews: 'Cashewnuss',
  sesam: 'Sesam',
  leinsamen: 'Leinsamen',
  kürbiskerne: 'Kürbiskerne',
  sonnenblumenkerne: 'Sonnenblumenkerne',
  // Fruits
  apfel: 'Apfel',
  äpfel: 'Apfel',
  banane: 'Banane',
  bananen: 'Banane',
  zitrone: 'Zitrone',
  zitronen: 'Zitrone',
  orange: 'Orange',
  orangen: 'Orange',
  erdbeeren: 'Erdbeere',
  himbeeren: 'Himbeere',
  blaubeeren: 'Blaubeere',
  // Condiments & liquids
  senf: 'Senf',
  essig: 'Weinessig',
  sojasoße: 'Sojasoße',
  brühe: 'Gemüsebrühe',
  gemüsebrühe: 'Gemüsebrühe',
  hühnerbrühe: 'Hühnerbrühe',
  wein: 'Weißwein',
  rotwein: 'Rotwein',
  weißwein: 'Weißwein',
  // Other
  schokolade: 'Zartbitterschokolade',
  kakaopulver: 'Kakaopulver',
  erdnussbutter: 'Erdnussmus',
  kokosmilch: 'Kokosmilch',
}
// cSpell:enable

const splitCommonSuffixes = (text: string): string => {
  // cSpell:disable-next-line
  const suffixes = ['flock', 'mehl', 'pulver', 'schrot']
  for (const s of suffixes) {
    text = text.split(s).join(` ${s}`)
  }
  return text.split(/\s+/).join(' ').trim()
}

const normalizeText = (text: string): string => {
  if (!text) return ''
  text = text.toLowerCase()
  text = text.replaceAll(/[,.\-()]/g, ' ')
  const words = text.split(/\s+/).filter(Boolean)
  const stemmed = words.map(w => stemmer.stem(w))
  return stemmed.join(' ')
}

const stripModifiers = (query: string): string =>
  query
    .split(/\s+/)
    .filter(w => !MODIFIERS.has(w.toLowerCase()))
    .join(' ')
    .trim()

/**
 * Generates up to three search variants from an ingredient name:
 *   1. Full query (normalized + suffix-split)
 *   2. Modifiers stripped, then normalized
 *   3. Last word only — the main noun is usually at the end in German
 *
 * Duplicates are silently skipped so each variant is searched at most once.
 */
const buildSearchVariants = (query: string): string[] => {
  const seen = new Set<string>()
  const variants: string[] = []

  const add = (text: string) => {
    const v = splitCommonSuffixes(normalizeText(text))
    if (v && !seen.has(v)) {
      seen.add(v)
      variants.push(v)
    }
  }

  add(query)

  const stripped = stripModifiers(query)
  if (stripped !== query) add(stripped)

  const words = query.trim().split(/\s+/)
  if (words.length > 1) add(words.at(-1) ?? '')

  return variants
}

class NutritionService {
  private data: NutritionEntry[] | null = null
  private loadPromise: Promise<NutritionEntry[]> | null = null
  private fuse: Fuse<NutritionEntry> | null = null

  private customData: NutritionEntry[] | null = null
  private customLoadPromise: Promise<NutritionEntry[]> | null = null

  private async load(): Promise<NutritionEntry[]> {
    if (this.data) return this.data
    if (this.loadPromise) return this.loadPromise

    this.loadPromise = fetch('/nutrition_data.json')
      .then(res => {
        if (!res.ok)
          throw new Error(`Failed to load nutrition data: ${res.status}`)
        return res.json() as Promise<NutritionEntry[]>
      })
      .then(data => {
        this.data = data
        this.fuse = new Fuse(data, {
          keys: [{ name: 'searchIndex', weight: 1 }],
          includeScore: true,
          threshold: 0.5,
          ignoreLocation: true,
          useExtendedSearch: false,
          minMatchCharLength: 2,
        })
        return data
      })

    return this.loadPromise
  }

  private async loadCustom(): Promise<NutritionEntry[]> {
    if (this.customData) return this.customData
    if (this.customLoadPromise) return this.customLoadPromise

    this.customLoadPromise = fetch('/custom_nutrition.json')
      .then(res => {
        if (!res.ok)
          throw new Error(`Failed to load custom nutrition data: ${res.status}`)
        return res.json() as Promise<Omit<NutritionEntry, 'searchIndex'>[]>
      })
      .then(data => {
        this.customData = data.map(e => ({
          ...e,
          searchIndex: normalizeText(e.name),
        }))
        return this.customData
      })
      .catch(() => {
        this.customData = []
        return []
      })

    return this.customLoadPromise
  }

  private findInCustom(query: string): NutritionResult | null {
    if (!this.customData?.length) return null
    const q = query.toLowerCase()
    const entry = this.customData.find(e => {
      const n = e.name.toLowerCase()
      return n === q || (n.startsWith(q) && /[ ,/]/.test(n[q.length]))
    })
    if (!entry) return null
    return {
      name: entry.name,
      blsCode: entry.id,
      kcal: entry.kcal,
      protein: entry.protein,
      fat: entry.fat,
      carbs: entry.carbs,
      fiber: entry.fiber,
      sugar: entry.sugar,
      score: 100,
    }
  }

  private scoreResults(
    rawResults: FuseResult<NutritionEntry>[],
    query: string
  ): Array<{ item: NutritionEntry; finalScore: number }> {
    return rawResults.map(r => {
      const baseScore = (1 - (r.score ?? 1)) * 100
      const matchWords = r.item.searchIndex
        .toLowerCase()
        .replaceAll(',', ' ')
        .split(/\s+/)

      let finalScore = baseScore
      if (matchWords.includes(query)) {
        finalScore += 25
      } else if (matchWords.some((w: string) => w.includes(query))) {
        // Penalize proportionally: a short query buried in a long compound word
        // is a weaker signal than a query that covers most of the matched word.
        const matchedWord =
          matchWords.find((w: string) => w.includes(query)) ?? query
        const fraction = query.length / matchedWord.length
        finalScore -= Math.round(10 + (1 - fraction) * 15)
      }

      return { item: r.item, finalScore }
    })
  }

  async findIngredient(
    query: string,
    threshold = 65
  ): Promise<NutritionResult | null> {
    await Promise.all([this.load(), this.loadCustom()])
    if (!this.fuse || !this.data) return null

    const strippedQuery = stripModifiers(query).toLowerCase()
    if (SKIP_INGREDIENTS.has(strippedQuery)) return null

    // Custom entries take priority over the BLS database.
    const customResult = this.findInCustom(strippedQuery)
    if (customResult) return customResult

    // Use the override map for common ingredients: strip modifiers first, then look up.
    const overrideQuery = INGREDIENT_OVERRIDES[strippedQuery]

    if (overrideQuery) {
      // Prefer a direct name match in the BLS data over fuzzy search — avoids
      // ambiguous stems matching unrelated compounds (e.g. "Sahne" → a liqueur).
      const overrideLower = overrideQuery.toLowerCase()
      const direct = this.data.find(e => {
        const n = e.name.toLowerCase()
        return (
          n === overrideLower ||
          (n.startsWith(overrideLower) && /[ ,/]/.test(n[overrideLower.length]))
        )
      })
      if (direct) {
        return {
          name: direct.name,
          blsCode: direct.id,
          kcal: direct.kcal,
          protein: direct.protein,
          fat: direct.fat,
          carbs: direct.carbs,
          fiber: direct.fiber,
          sugar: direct.sugar,
          score: 100,
        }
      }
    }

    const variants = buildSearchVariants(overrideQuery ?? query)
    let best: { item: NutritionEntry; finalScore: number } | null = null

    for (const variant of variants) {
      const rawResults = this.fuse.search(variant, { limit: 5 })
      const scored = this.scoreResults(rawResults, variant)
      scored.sort((a, b) => b.finalScore - a.finalScore)
      const top = scored[0]
      if (top && (!best || top.finalScore > best.finalScore)) {
        best = top
      }
    }

    if (!best || best.finalScore < threshold) return null

    return {
      name: best.item.name,
      blsCode: best.item.id,
      kcal: best.item.kcal,
      protein: best.item.protein,
      fat: best.item.fat,
      carbs: best.item.carbs,
      fiber: best.item.fiber,
      sugar: best.item.sugar,
      score: best.finalScore,
    }
  }

  async calculateNutrition(
    ingredients: Array<{ amountG: number; name: string }>
  ): Promise<NutritionSummary> {
    const summary: NutritionSummary = {
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
    }

    await Promise.all(
      ingredients.map(async ({ amountG, name }) => {
        const result = await this.findIngredient(name)
        if (!result) return
        const factor = amountG / 100
        summary.kcal += result.kcal * factor
        summary.protein += result.protein * factor
        summary.fat += result.fat * factor
        summary.carbs += result.carbs * factor
        summary.fiber += result.fiber * factor
        summary.sugar += result.sugar * factor
      })
    )

    return summary
  }

  async calculateNutritionDetailed(
    ingredients: Array<{ amountG: number; name: string }>
  ): Promise<NutritionDetailedResult> {
    const summary: NutritionSummary = {
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
    }

    const matches = await Promise.all(
      ingredients.map(async ({ amountG, name }) => {
        const matched = await this.findIngredient(name)
        return { name, amountG, matched }
      })
    )

    for (const { amountG, matched } of matches) {
      if (!matched) continue
      const factor = amountG / 100
      summary.kcal += matched.kcal * factor
      summary.protein += matched.protein * factor
      summary.fat += matched.fat * factor
      summary.carbs += matched.carbs * factor
      summary.fiber += matched.fiber * factor
      summary.sugar += matched.sugar * factor
    }

    return { summary, matches }
  }
}

export const nutritionService = new NutritionService()
