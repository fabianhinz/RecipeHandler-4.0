import Fuse, { FuseResult } from 'fuse.js'
import { newStemmer } from 'snowball-stemmers'

import { INGREDIENT_OVERRIDES, MODIFIERS } from './nutritionData'

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
