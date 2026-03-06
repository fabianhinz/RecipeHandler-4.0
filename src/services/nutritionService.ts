import Fuse from 'fuse.js'
import { newStemmer } from 'snowball-stemmers'

export interface NutritionEntry {
  id: string
  name: string
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
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
  score: number
}

export interface NutritionSummary {
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
}

const stemmer = newStemmer('german')

const splitCommonSuffixes = (text: string): string => {
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

class NutritionService {
  private data: NutritionEntry[] | null = null
  private loadPromise: Promise<NutritionEntry[]> | null = null
  private fuse: Fuse<NutritionEntry> | null = null

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

  async findIngredient(
    query: string,
    threshold = 65
  ): Promise<NutritionResult | null> {
    await this.load()
    if (!this.fuse || !this.data) return null

    const normalizedQuery = normalizeText(query)
    const splittedQuery = splitCommonSuffixes(normalizedQuery)

    const rawResults = this.fuse.search(splittedQuery, { limit: 5 })

    if (rawResults.length === 0) return null

    const refined = rawResults.map(r => {
      const baseScore = (1 - (r.score ?? 1)) * 100
      const matchWords = r.item.searchIndex
        .toLowerCase()
        .replace(/,/g, ' ')
        .split(/\s+/)

      let finalScore = baseScore
      if (matchWords.includes(splittedQuery)) {
        finalScore += 25
      } else if (matchWords.some(w => w.includes(splittedQuery))) {
        finalScore -= 10
      }

      return { item: r.item, finalScore }
    })

    refined.sort((a, b) => b.finalScore - a.finalScore)
    const best = refined[0]

    if (best.finalScore < threshold) return null

    return {
      name: best.item.name,
      blsCode: best.item.id,
      kcal: best.item.kcal,
      protein: best.item.protein,
      fat: best.item.fat,
      carbs: best.item.carbs,
      fiber: best.item.fiber,
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
      })
    )

    return summary
  }
}

export const nutritionService = new NutritionService()
