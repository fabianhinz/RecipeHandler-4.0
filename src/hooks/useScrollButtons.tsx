import { Grid, IconButton } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from 'mdi-material-ui'
import React, { useState } from 'react'

import { useGridContext } from '../Components/Provider/GridProvider'
import useIntersectionObserver from './useIntersectionObserver'

interface useScrollButtonsOptions {
    element: HTMLDivElement
    delta: number
}

const useScrollButtons = ({ element, delta }: useScrollButtonsOptions) => {
    const [containerScrollLeft, setContainerScrollLeft] = useState(0)
    const [scrollRightDisabled, setScrollRightDisabled] = useState(false)
    const [scrollLeftDisabled, setScrollLeftDisabled] = useState(false)

    const { IntersectionObserverTrigger: RightTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setScrollRightDisabled(true),
        onLeave: () => setScrollRightDisabled(false),
    })
    const { IntersectionObserverTrigger: LeftTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setScrollLeftDisabled(true),
        onLeave: () => setScrollLeftDisabled(false),
    })

    const { gridLayout } = useGridContext()

    const handleScrollLeft = () => {
        element.scroll({
            left: containerScrollLeft - delta,
            behavior: 'smooth',
        })
        setContainerScrollLeft(prev => prev - delta)
    }

    const handleScrollRight = () => {
        element.scroll({
            left: containerScrollLeft + delta,
            behavior: 'smooth',
        })
        setContainerScrollLeft(prev => prev + delta)
    }

    return {
        ScrollLeftTrigger: () => <>{element && <LeftTrigger />}</>,
        ScrollRightTrigger: () => <>{element && <RightTrigger />} </>,
        ScrollButtons: () => (
            <Grid container justify="flex-end" alignItems="center" wrap="nowrap">
                <Grid item>
                    <IconButton
                        size="small"
                        disabled={scrollLeftDisabled || gridLayout === 'list'}
                        onClick={handleScrollLeft}>
                        <ChevronLeft />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        size="small"
                        disabled={scrollRightDisabled || gridLayout === 'list'}
                        onClick={handleScrollRight}>
                        <ChevronRight />
                    </IconButton>
                </Grid>
            </Grid>
        ),
    }
}

export default useScrollButtons
