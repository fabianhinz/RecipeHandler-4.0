import { Box, createStyles, makeStyles, Paper, Slide } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import { BORDER_RADIUS } from '../../theme'
import { RecipeResultPin } from '../Recipe/Result/Action/RecipeResultPin'
import RecipeResult from '../Recipe/Result/RecipeResult'
import Progress from '../Shared/Progress'
import { useBreakpointsContext } from './BreakpointsProvider'

type PinnedRecipesState = {
    pinnedContains: (recipeName: string) => boolean
    handlePinnedChange: (recipeName: string) => void
    pinnedOnDesktop: boolean
}

const Context = React.createContext<PinnedRecipesState | null>(null)

export const usePinnedRecipesContext = () => useContext(Context) as PinnedRecipesState

const SelectedRecipe: FC<{ recipeName: string }> = ({ recipeName }) => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ recipeName })

    return (
        <Box padding={2}>
            <Box display="flex" justifyContent="center">
                <RecipeResultPin name={recipeName} />
            </Box>
            {recipeDocLoading ? (
                <Progress variant="cover" />
            ) : (
                <RecipeResult variant="pinned" recipe={recipeDoc} />
            )}
        </Box>
    )
}

export const PINNED_WIDTH = 425

const useStyles = makeStyles(theme =>
    createStyles({
        pinnedContainer: {
            width: PINNED_WIDTH,
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer + 1,
            boxShadow: theme.shadows[8],
            borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
        },
        recipePadding: {
            padding: theme.spacing(2),
        },
        pinnedWidth: {
            marginLeft: PINNED_WIDTH,
        },
    })
)

export const PinnedRecipesProvider: FC = ({ children }) => {
    const [pinnedRecipes, setPinnedRecipes] = useState<Set<string>>(new Set())
    const [activeIndex, setActiveIndex] = useState(0)

    const classes = useStyles()

    const { isDesktopPinnable } = useBreakpointsContext()

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const target: Element = event.target as Element
            if (
                'input'.toUpperCase() !== target.tagName &&
                'textarea'.toUpperCase() !== target.tagName
            ) {
                if (
                    event.code === 'ArrowRight' &&
                    activeIndex !== pinnedRecipes.size - 1 &&
                    pinnedRecipes.size > 0
                ) {
                    setActiveIndex(prev => ++prev)
                }
                if (event.code === 'ArrowLeft' && activeIndex !== 0) {
                    setActiveIndex(prev => --prev)
                }
            }
        },
        [activeIndex, pinnedRecipes.size]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const handlePinnedChange = (recipeName: string) => {
        setPinnedRecipes(previous => {
            if (previous.has(recipeName)) {
                if (activeIndex > 0 && activeIndex === previous.size - 1)
                    setActiveIndex(prev => --prev)
                previous.delete(recipeName)
            } else {
                if (previous.size !== 0) setActiveIndex(previous.size)
                previous.add(recipeName)
            }
            return new Set(previous)
        })
    }

    const pinnedOnDesktop = pinnedRecipes.size > 0 && isDesktopPinnable

    return (
        <Context.Provider
            value={{
                handlePinnedChange,
                pinnedContains: (recipeName: string) => pinnedRecipes.has(recipeName),
                pinnedOnDesktop,
            }}>
            <Slide in={pinnedOnDesktop} direction="right">
                <Paper className={classes.pinnedContainer}>
                    <SwipeableViews
                        index={activeIndex}
                        onChangeIndex={index => setActiveIndex(index)}>
                        {[...pinnedRecipes.values()].map(recipeName => (
                            <SelectedRecipe key={recipeName} recipeName={recipeName} />
                        ))}
                    </SwipeableViews>
                </Paper>
            </Slide>
            <div className={clsx(pinnedOnDesktop && classes.pinnedWidth)}>{children}</div>
        </Context.Provider>
    )
}
