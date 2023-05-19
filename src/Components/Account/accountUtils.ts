import { ShoppingListItem } from '@/model/model'

const parseInput = (
  value: string,
  fallbackTag?: string
): Pick<ShoppingListItem, 'tag' | 'value'> => {
  const regexRes = /[ ]*#(\w|ä|Ä|ö|Ö|ü|Ü){1,}[ ]*/.exec(value)
  let tag = ''

  if (regexRes) {
    const [rawTag] = regexRes
    value = value.replace(rawTag, ' ').trim()
    tag = rawTag.trim().replace('#', '')
  } else if (fallbackTag !== undefined) {
    tag = fallbackTag
  }

  return { tag, value }
}

export const accountUtils = {
  parseInput,
}
