import {
  EGG_WEIGHT_G,
  MODIFIERS,
  PLAIN_COUNT_WEIGHTS,
  resolveRange,
  UNIT_MULTIPLIERS,
} from './ingredientConfig'

export interface ParsedIngredient {
  amountG: number
  name: string
}

export interface ParseResult {
  parsed: ParsedIngredient[]
  skipped: string[]
}

/** Matches a positive number: integer or decimal with `.` or `,` separator (e.g. "1", "2.5", "1,5") */
const NUM = String.raw`(\d+(?:[,.]\d+)?)`

/** Range separator: optional whitespace around a hyphen, en-dash, or the word "bis" */
const RANGE_SEP = String.raw`\s*(?:[-–]|bis)\s*`

const parseNum = (s: string) => Number.parseFloat(s.replace(',', '.'))

/** Removes a trailing parenthetical note, e.g. "Mehl (Type 550)" → "Mehl" */
const stripParens = (s: string) => s.replace(/\s*\(.*\)\s*$/, '').trim()

const normalizeLine = (rawLine: string): string => {
  let line = rawLine
    .replace(/^\s*-\s*/, '')
    .trim()
    .replace(/^(ca\.?|etwa|ungefähr)\s+/i, '')
    .trim()
  // Convert leading fraction to decimal ("1/2 Zitrone" → "0.5 Zitrone")
  line = line.replace(/^(\d+)\/(\d+)/, (_, n, d) =>
    String(Number(n) / Number(d))
  )
  // Strip all leading quantity adjectives between number and ingredient ("2 kleine rote Äpfel" → "2 Äpfel")
  const leadingAdjectiveRe = new RegExp(String.raw`^${NUM}\s+(\p{L}+)\s+`, 'u')
  let adjectiveMatch = leadingAdjectiveRe.exec(line)
  while (adjectiveMatch && MODIFIERS.has(adjectiveMatch[2].toLowerCase())) {
    line = line.replace(leadingAdjectiveRe, '$1 ')
    adjectiveMatch = leadingAdjectiveRe.exec(line)
  }
  return line
}

/** Matches egg lines like "2 Eier" or "4-5 Eier" → (avg) × EGG_WEIGHT_G */
const matchEgg = (line: string): ParsedIngredient | null => {
  const range = new RegExp(
    String.raw`^${NUM}${RANGE_SEP}${NUM}\s+Ei(?:er)?\b`,
    'i'
  ).exec(line)
  if (range)
    return {
      amountG:
        resolveRange(parseNum(range[1]), parseNum(range[2])) * EGG_WEIGHT_G,
      name: 'Hühnerei',
    }
  const m = new RegExp(String.raw`^${NUM}\s+Ei(?:er)?\b`, 'i').exec(line)
  return m ? { amountG: parseNum(m[1]) * EGG_WEIGHT_G, name: 'Hühnerei' } : null
}

/** Matches a range with a known unit: "1-2 EL Öl" → avg × multiplier */
const matchUnitRange = (line: string): ParsedIngredient | null => {
  const m = new RegExp(
    String.raw`^${NUM}${RANGE_SEP}${NUM}\s*(\p{L}+)\.?\s+(.+)$`,
    'u'
  ).exec(line)
  if (!m) return null
  const multiplier = UNIT_MULTIPLIERS[m[3].toLowerCase()]
  if (multiplier === undefined) return null
  return {
    amountG: resolveRange(parseNum(m[1]), parseNum(m[2])) * multiplier,
    name: stripParens(m[4]),
  }
}

/** Matches a count range for a known ingredient: "1-2 Zucchini" → avg × per-item weight */
const matchCountRange = (line: string): ParsedIngredient | null => {
  const m = new RegExp(
    String.raw`^${NUM}${RANGE_SEP}${NUM}\s+(\p{L}+(?:\s+.*)?)$`,
    'u'
  ).exec(line)
  if (!m) return null
  const weight = PLAIN_COUNT_WEIGHTS[m[3].toLowerCase().split(/\s+/)[0]]
  if (weight === undefined) return null
  return {
    amountG: resolveRange(parseNum(m[1]), parseNum(m[2])) * weight,
    name: stripParens(m[3]),
  }
}

/** Matches a single quantity with a known unit: "200g Mehl" or "2 EL Öl" */
const matchUnit = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s*(\p{L}+)\.?\s+(.+)$`, 'u').exec(
    line
  )
  if (!m) return null
  const multiplier = UNIT_MULTIPLIERS[m[2].toLowerCase()]
  if (multiplier === undefined) return null
  return { amountG: parseNum(m[1]) * multiplier, name: stripParens(m[3]) }
}

/** Matches a plain count for a known ingredient: "3 Tomaten" → count × per-item weight */
const matchCount = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s+(\p{L}+(?:\s+.*)?)$`, 'u').exec(
    line
  )
  if (!m) return null
  const weight = PLAIN_COUNT_WEIGHTS[m[2].toLowerCase().split(/\s+/)[0]]
  if (weight === undefined) return null
  return { amountG: parseNum(m[1]) * weight, name: stripParens(m[2]) }
}

/**
 * Parses a markdown ingredient list into weighted ingredients.
 * Non-list lines (headers, blanks) are silently skipped.
 * Lines that cannot be parsed into an amount+name are collected in `skipped`.
 */
export const parseIngredients = (markdown: string): ParseResult => {
  const parsed: ParsedIngredient[] = []
  const skipped: string[] = []

  for (const rawLine of markdown.split('\n')) {
    // Silently skip non-ingredient lines (headers, blanks, etc.)
    if (!rawLine.trimStart().startsWith('-')) continue

    const line = normalizeLine(rawLine)
    if (!line) continue

    const match =
      matchEgg(line) ??
      matchUnitRange(line) ??
      matchCountRange(line) ??
      matchUnit(line) ??
      matchCount(line)

    if (match) {
      parsed.push(match)
    } else {
      skipped.push(line)
    }
  }

  return { parsed, skipped }
}
