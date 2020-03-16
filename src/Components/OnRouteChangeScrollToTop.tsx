import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import recipeService from '../services/recipeService'

const OnRouteChangeScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        if (!recipeService.scrollPosition) window.scrollTo(0, 0)
    }, [pathname])

    return <></>
}

export default OnRouteChangeScrollToTop
