import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { resolveCollection } from '@/firebase/firebaseQueries'

export const useRecipesCounterByUserUid = () => {
  const [counter, setCounter] = useState<[string, number][]>([])

  useEffect(() => {
    return onSnapshot(resolveCollection('recipesCounter'), docSnapshot => {
      const sortedByNumberOfRecipes = docSnapshot.docs
        .map(d => [d.id, d.data().value] as [string, number])
        .filter(([uid, counter]) => Boolean(uid) && counter > 0)
        .sort((a, b) => b[1] - a[1])

      setCounter(sortedByNumberOfRecipes)
    })
  }, [])

  return counter
}
