import { useState } from 'react'

const TRANSITION_DURATION = 250

export const useTransition = () => {
  const [transition, setTransition] = useState(true)

  const transitionChange = async () =>
    new Promise(resolve => {
      setTransition(false)
      setTimeout(resolve, TRANSITION_DURATION)
    })

  return { transition, transitionChange }
}
