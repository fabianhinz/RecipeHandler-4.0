import { Box, createStyles, IconButton, makeStyles, Paper, Slide } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import { BORDER_RADIUS } from '../../theme'
import { RecipeResultPin } from '../Recipe/Result/Action/RecipeResultPin'
import RecipeResult from '../Recipe/Result/RecipeResult'
import { BadgeWrapper } from '../Shared/BadgeWrapper'
import NotFound from '../Shared/NotFound'
import Progress from '../Shared/Progress'
import { useBreakpointsContext } from './BreakpointsProvider'

type PinnedRecipesState = {
    pinnedContains: (recipeName: string) => boolean
    handlePinnedChange: (recipeName: string) => void
    pinnedOnDesktop: boolean
    pinnedRecipesTrigger: JSX.Element | undefined
}

const Context = React.createContext<PinnedRecipesState | null>(null)

export const usePinnedRecipesContext = () => useContext(Context) as PinnedRecipesState

const SelectedRecipe: FC<{ recipeName: string }> = ({ recipeName }) => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ recipeName })

    return (
        <Box padding={2} paddingTop={3}>
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

interface StyleProps {
    pinnedOnMobile: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        pinnedContainer: {
            width: (props: StyleProps) => (props.pinnedOnMobile ? '100vw' : PINNED_WIDTH),
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.modal,
            boxShadow: theme.shadows[8],
            paddingTop: (props: StyleProps) =>
                props.pinnedOnMobile
                    ? `calc(env(safe-area-inset-top) + ${theme.spacing(11)}px)`
                    : 'inherhit',
            borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
            '@media screen and (orientation: landscape)': {
                paddingLeft: 'env(safe-area-inset-bottom)',
            },
        },
        pinnedWidth: {
            marginLeft: PINNED_WIDTH,
        },
    })
)

const PinnedRecipesProvider: FC = ({ children }) => {
    const [pinnedRecipes, setPinnedRecipes] = useState<Set<string>>(new Set())
    const [activeIndex, setActiveIndex] = useState(0)
    const [drawerLike, setDrawerLike] = useState(false)

    const { isDesktopPinnable, isMobilePinnable } = useBreakpointsContext()

    const pinnedOnDesktop = pinnedRecipes.size > 0 && isDesktopPinnable
    const pinnedOnMobile = pinnedRecipes.size > 0 && isMobilePinnable
    const classes = useStyles({ pinnedOnMobile } as StyleProps)

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

    useEffect(() => {
        const root = document.getElementsByTagName('html')[0]
        if (drawerLike) root.setAttribute('style', 'overflow: hidden;')
        if (!drawerLike) root.removeAttribute('style')
    }, [drawerLike])

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

    const pinnedRecipesTrigger = isMobilePinnable ? (
        <IconButton onClick={() => setDrawerLike(prev => !prev)}>
            <BadgeWrapper badgeContent={pinnedRecipes.size}>
                <MenuIcon />
            </BadgeWrapper>
        </IconButton>
    ) : (
        undefined
    )

    return (
        <Context.Provider
            value={{
                handlePinnedChange,
                pinnedContains: (recipeName: string) => pinnedRecipes.has(recipeName),
                pinnedOnDesktop,
                pinnedRecipesTrigger,
            }}>
            <Slide in={pinnedOnDesktop || drawerLike} direction="right">
                <Paper className={classes.pinnedContainer}>
                    <SwipeableViews
                        index={activeIndex}
                        onChangeIndex={index => setActiveIndex(index)}>
                        {[...pinnedRecipes.values()].map(recipeName => (
                            <SelectedRecipe key={recipeName} recipeName={recipeName} />
                        ))}
                    </SwipeableViews>
                    <NotFound visible={pinnedRecipes.size === 0} />
                </Paper>
            </Slide>
            <div className={clsx(pinnedOnDesktop && classes.pinnedWidth)}>{children}</div>
        </Context.Provider>
    )
}

export default PinnedRecipesProvider
