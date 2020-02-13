import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const OnRouteChangeScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return <></>
}

export default OnRouteChangeScrollToTop
