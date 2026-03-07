// cSpell:disable

export interface ParsedIngredient {
  amountG: number
  name: string
}

export interface ParseResult {
  parsed: ParsedIngredient[]
  skipped: string[]
}

/** German unit abbreviations mapped to their gram/ml equivalent */
const UNIT_MULTIPLIERS: Record<string, number> = {
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
}

/**
 * Adjectives that can appear between a number and an ingredient name.
 * These are stripped so "2 große Äpfel" becomes "2 Äpfel" before matching.
 * Includes quantity qualifiers, size words, and color adjectives (all genders/cases).
 */
const QUANTITY_ADJECTIVES = new Set([
  // quantity qualifiers
  'gute',
  'guter',
  'gutes',
  'guten',
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
  // size
  'große',
  'großer',
  'großes',
  'kleine',
  'kleiner',
  'kleines',
  'mittlere',
  'mittlerer',
  'mittleres',
  'reife',
  'reifer',
  'reifes',
  // colors — e.g. "rote Paprika", "gelbe Zucchini"
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
  'gekochte',
  'hartgekochte',
])

/** Approximate per-item gram weight for common count-based ingredients (no unit) */
const PLAIN_COUNT_WEIGHTS: Record<string, number> = {
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
  paprika: 150,
  paprikaschote: 150,
  avocado: 200,
  avocados: 200,
}

// cSpell:enable

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
  // Strip optional quantity adjective between number and ingredient ("2 große Äpfel" → "2 Äpfel")
  const qAdj = new RegExp(String.raw`^${NUM}\s+(\p{L}+)\s+`, 'u').exec(line)
  return qAdj && QUANTITY_ADJECTIVES.has(qAdj[2].toLowerCase())
    ? line.replace(new RegExp(String.raw`^${NUM}\s+\p{L}+\s+`, 'u'), '$1 ')
    : line
}

/** Matches egg lines like "2 Eier" → 2 × 50 g */
const matchEgg = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s+Ei(?:er)?\b`, 'i').exec(line)
  return m ? { amountG: parseNum(m[1]) * 50, name: 'Hühnerei' } : null
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
    amountG: ((parseNum(m[1]) + parseNum(m[2])) / 2) * multiplier,
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
    amountG: ((parseNum(m[1]) + parseNum(m[2])) / 2) * weight,
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
