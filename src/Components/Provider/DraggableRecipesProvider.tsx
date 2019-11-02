import { createStyles, Grow, IconButton, makeStyles, Paper } from '@material-ui/core'
import TouchIcon from '@material-ui/icons/TouchAppTwoTone'
import clsx from 'clsx'
import { PinOff } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { FC, useContext, useState } from 'react'
import Draggable from 'react-draggable'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import RecipeResult from '../Recipe/Result/RecipeResult'
import { BadgeWrapper } from '../Shared/BadgeWrapper'
import { Loading } from '../Shared/Loading'
import { useBreakpointsContext } from './BreakpointsProvider'

type DraggableRecipesState = {
    draggableContains: (recipeName: string) => boolean
    handleDraggableChange: (recipeName: string) => void
}

const Context = React.createContext<DraggableRecipesState | null>(null)

export const useDraggableRecipesContext = () => useContext(Context) as DraggableRecipesState

const useStyles = makeStyles(theme =>
    createStyles({
        recipeWrapper: {
            boxShadow: theme.shadows[8],
            padding: theme.spacing(1),
            height: '50vh',
            width: 320,
            display: 'flex',
            flexDirection: 'column',
        },
        recipeContainer: {
            padding: theme.spacing(1),
            overflowY: 'auto',
        },
        draggableContainer: {
            zIndex: theme.zIndex.appBar + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(2),
        },
        btnContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            paddingBottom: theme.spacing(1),
        },
        activeRecipe: {
            zIndex: theme.zIndex.appBar + 2,
        },
        draggable: {
            cursor: 'move',
        },
        drawerBottomMargin: {
            bottom: theme.spacing(8),
        },
        drawerRightMargin: {
            right: theme.spacing(8),
        },
    })
)

const SelectedRecipe: FC<{ recipeName: string | null }> = ({ recipeName }) => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ recipeName })
    return <>{recipeDocLoading ? <Loading /> : <RecipeResult dragEnabled recipe={recipeDoc} />}</>
}

export const DraggableRecipesProvider: FC = ({ children }) => {
    const [draggableRecipes, setDraggableRecipes] = useState<Set<string>>(new Set())
    const [activeRecipe, setActiveRecipe] = useState('')
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    const { isDraggableRecipes, isDrawerBottom } = useBreakpointsContext()

    const handleDraggableChange = (recipeName: string) => {
        setDraggableRecipes(previous => {
            if (previous.has(recipeName)) {
                previous.delete(recipeName)
            } else if (draggableRecipes.size === 4) {
                enqueueSnackbar('mehr als 4 angepinnte Rezepte sind nicht erlaubt', {
                    variant: 'info',
                })
                return new Set(previous)
            } else {
                previous.add(recipeName)
            }
            return new Set(previous)
        })
    }

    const handleCloseBtnClick = (recipeName: string) => (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation()
        handleDraggableChange(recipeName)
    }

    const draggableContains = (recipeName: string) => draggableRecipes.has(recipeName)

    return (
        <Context.Provider value={{ handleDraggableChange, draggableContains }}>
            {children}
            {isDraggableRecipes &&
                [...draggableRecipes.values()].map((recipeName, index) => (
                    <Draggable
                        key={recipeName}
                        handle=".draggableHandler"
                        defaultClassName={clsx(
                            classes.draggableContainer,
                            isDrawerBottom ? classes.drawerBottomMargin : classes.drawerRightMargin
                        )}
                        defaultClassNameDragged={clsx(
                            activeRecipe === recipeName && classes.activeRecipe
                        )}>
                        <div>
                            <Grow in>
                                <BadgeWrapper
                                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                    badgeContent={`${index + 1}/${draggableRecipes.size}`}>
                                    <Paper
                                        onClick={() => setActiveRecipe(recipeName)}
                                        className={classes.recipeWrapper}>
                                        <div className={classes.btnContainer}>
                                            <IconButton
                                                size="small"
                                                onClick={handleCloseBtnClick(recipeName)}>
                                                <PinOff />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                className={clsx(
                                                    classes.draggable,
                                                    'draggableHandler'
                                                )}>
                                                <TouchIcon />
                                            </IconButton>
                                        </div>
                                        <div className={classes.recipeContainer}>
                                            <SelectedRecipe recipeName={recipeName} />
                                        </div>
                                    </Paper>
                                </BadgeWrapper>
                            </Grow>
                        </div>
                    </Draggable>
                ))}
        </Context.Provider>
    )
}
