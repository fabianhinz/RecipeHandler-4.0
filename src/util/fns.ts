export type ReorderParams<T> = { array: T[]; from: number; to: number }

export const ArrayFns = {
  reorder: <T>({ array, from, to }: ReorderParams<T>) => {
    const copy = [...array]
    copy.splice(to, 0, copy.splice(from, 1)[0])
    return copy
  },
}

type SortTrategy = 'asc' | 'desc'

export const sortFn = (strategy: SortTrategy) => {
  return (a: string | [string, unknown], b: string | [string, unknown]) => {
    const compA = Array.isArray(a) ? a.at(0) : a
    const compB = Array.isArray(b) ? b.at(0) : b

    if (typeof compA !== 'string' || typeof compB !== 'string') {
      console.warn(`cannot sort ${a}, ${b}`)
      return 0
    }

    if (strategy === 'asc') {
      return compA.localeCompare(compB)
    }

    return compA.localeCompare(compB)
  }
}

export const sortObjectKeys = <Obj extends Record<string, unknown>>(
  strategy: 'asc' | 'desc',
  obj: Obj
) => {
  return Object.fromEntries(Object.entries(obj).sort(sortFn(strategy))) as Obj
}
