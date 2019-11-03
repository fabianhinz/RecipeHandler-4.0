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
import React, { FC, useContext, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import { RecipeResultPin } from '../Recipe/Result/Action/RecipeResultPin'
import RecipeResult from '../Recipe/Result/RecipeResult'
import { Loading } from '../Shared/Loading'

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
        <Box padding={2} paddingBottom={6}>
            <Box display="flex" justifyContent="center">
                <RecipeResultPin name={recipeName} />
            </Box>
            {recipeDocLoading ? <Loading /> : <RecipeResult pinned recipe={recipeDoc} />}
        </Box>
    )
}

const useStyles = makeStyles(theme =>
    createStyles({
        dummy: {
            width: 320,
        },
        paper: {
            width: 320,
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer - 1,
        },
    })
)

export const PinnedRecipesProvider: FC = ({ children }) => {
    const [pinnedRecipes, setPinnedRecipes] = useState<Set<string>>(new Set())
    const [activeIndex, setActiveIndex] = useState(0)

    const classes = useStyles()

    const handlePinnedChange = (recipeName: string) => {
        setPinnedRecipes(previous => {
            if (previous.has(recipeName)) {
                if (activeIndex > 0) setActiveIndex(prev => --prev)
                previous.delete(recipeName)
            } else {
                if (previous.size !== 0) setActiveIndex(prev => ++prev)
                previous.add(recipeName)
            }
            return new Set(previous)
        })
    }

    return (
        <Context.Provider
            value={{
                handlePinnedChange,
                pinnedContains: (recipeName: string) => pinnedRecipes.has(recipeName),
                pinned: pinnedRecipes.size > 0,
            }}>
            <Box display="flex">
                <Slide in={pinnedRecipes.size > 0} direction="right">
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
                {children}
            </Box>
        </Context.Provider>
    )
}
