import {
    Box,
    createStyles,
    IconButton,
    makeStyles,
    MobileStepper,
    Paper,
    Slide,
} from '@material-ui/core'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import { RecipeResultPin } from '../Recipe/Result/Action/RecipeResultPin'
import RecipeResult from '../Recipe/Result/RecipeResult'
import { Loading } from '../Shared/Loading'
import { useBreakpointsContext } from './BreakpointsProvider'

type PinnedRecipesState = {
    pinnedContains: (recipeName: string) => boolean
    handlePinnedChange: (recipeName: string) => void
    pinned: boolean
}

const Context = React.createContext<PinnedRecipesState | null>(null)

export const usePinnedRecipesContext = () => useContext(Context) as PinnedRecipesState

const SelectedRecipe: FC<{ recipeName: string }> = ({ recipeName }) => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ recipeName })

    return (
        <Box padding={2} paddingTop={1}>
            <Box display="flex" justifyContent="center">
                <RecipeResultPin name={recipeName} />
            </Box>
            {recipeDocLoading ? (
                <Loading variant="linear" />
            ) : (
                <RecipeResult pinned recipe={recipeDoc} />
            )}
        </Box>
    )
}

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            width: theme.spacing(40),
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer + 1,
            boxShadow: theme.shadows[8],
        },
    })
)

export const PinnedRecipesProvider: FC = ({ children }) => {
    const [pinnedRecipes, setPinnedRecipes] = useState<Set<string>>(new Set())
    const [activeIndex, setActiveIndex] = useState(0)

    const classes = useStyles()

    const { isLowRes } = useBreakpointsContext()

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
                if (activeIndex > 0) setActiveIndex(prev => --prev)
                previous.delete(recipeName)
            } else {
                if (previous.size !== 0) setActiveIndex(previous.size)
                previous.add(recipeName)
            }
            return new Set(previous)
        })
    }

    const pinned = pinnedRecipes.size > 0 && !isLowRes

    return (
        <Context.Provider
            value={{
                handlePinnedChange,
                pinnedContains: (recipeName: string) => pinnedRecipes.has(recipeName),
                pinned,
            }}>
            <Slide in={pinned} direction="right">
                <Paper className={classes.paper}>
                    <MobileStepper
                        steps={pinnedRecipes.size}
                        activeStep={activeIndex}
                        position="static"
                        variant="dots"
                        nextButton={
                            <IconButton
                                onClick={() => setActiveIndex(prev => ++prev)}
                                disabled={activeIndex === pinnedRecipes.size - 1}>
                                <KeyboardArrowRight />
                            </IconButton>
                        }
                        backButton={
                            <IconButton
                                onClick={() => setActiveIndex(prev => --prev)}
                                disabled={activeIndex === 0}>
                                <KeyboardArrowLeft />
                            </IconButton>
                        }
                    />
                    <SwipeableViews
                        index={activeIndex}
                        onChangeIndex={index => setActiveIndex(index)}>
                        {[...pinnedRecipes.values()].map(recipeName => (
                            <SelectedRecipe key={recipeName} recipeName={recipeName} />
                        ))}
                    </SwipeableViews>
                </Paper>
            </Slide>
            <Box marginLeft={pinned ? 40 : 0}>{children}</Box>
        </Context.Provider>
    )
}
