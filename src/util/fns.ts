export type ReorderParams<T> = { array: T[]; from: number; to: number }

export const ArrayFns = {
  reorder: <T>({ array, from, to }: ReorderParams<T>) => {
    const copy = [...array]
    copy.splice(to, 0, copy.splice(from, 1)[0])
    return copy
  },
}
