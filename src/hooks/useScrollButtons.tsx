import { Fab, Grid } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from 'mdi-material-ui'
import React, { useState } from 'react'

import { useGridContext } from '../Components/Provider/GridProvider'
import useIntersectionObserver from './useIntersectionObserver'

interface useScrollButtonsOptions {
    element: HTMLDivElement
    delta: number
    disabled?: boolean
}

const useScrollButtons = ({ element, delta, disabled }: useScrollButtonsOptions) => {
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
            <Grid container spacing={1} justify="flex-end" alignItems="center" wrap="nowrap">
                <Grid item>
                    <Fab
                        size="small"
                        disabled={scrollLeftDisabled || gridLayout === 'list' || disabled}
                        onClick={handleScrollLeft}>
                        <ChevronLeft />
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab
                        size="small"
                        disabled={scrollRightDisabled || gridLayout === 'list' || disabled}
                        onClick={handleScrollRight}>
                        <ChevronRight />
                    </Fab>
                </Grid>
            </Grid>
        ),
    }
}

export default useScrollButtons
