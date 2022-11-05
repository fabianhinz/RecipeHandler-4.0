import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Header from '@/Components/Header'
import Main from '@/Components/Main'
import { useServiceWorkerUpdateEffect } from '@/hooks/useServiceWorkerUpdateEffect'
import { getRecipeService } from '@/services/recipeService'

export const App = () => {
  const location = useLocation()

  useServiceWorkerUpdateEffect()

  useEffect(() => {
    const scrollPosition = getRecipeService().scrollPosition.get(location.pathname)
    if (scrollPosition) window.scrollTo({ top: scrollPosition, behavior: 'auto' })
    else window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    window.onscroll = () => {
      getRecipeService().scrollPosition.set(location.pathname, window.scrollY)
    }

    return () => {
      window.onscroll = null
    }
  }, [location.pathname])

  return (
    <>
      <Header />
      <Main />
    </>
  )
}
