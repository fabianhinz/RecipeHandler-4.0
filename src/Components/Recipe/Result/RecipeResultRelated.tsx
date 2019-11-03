import { Box, Chip, createStyles, Grid, makeStyles } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/LinkTwoTone'
import clsx from 'clsx'
import React, { FC } from 'react'

import { CategoryBase } from '../../Category/CategoryBase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../../Provider/PinnedRecipesProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        selectedChip: {
            boxShadow: theme.shadows[8],
        },
    })
)

export const RecipeResultRelated: FC<{ relatedRecipes: Array<string> }> = ({ relatedRecipes }) => {
    const { handlePinnedChange, pinnedContains } = usePinnedRecipesContext()
    const { isLowRes } = useBreakpointsContext()
    const { history } = useRouterContext()

    const classes = useStyles()

    const handleRecipeClick = (recipeName: string) => () => {
        if (isLowRes) history.push(PATHS.details(recipeName))
        else handlePinnedChange(recipeName)
    }

    return (
        <Box position="relative">
            <Grid container spacing={2} alignItems="center">
                {relatedRecipes.map(recipeName => (
                    <Grid key={recipeName} item>
                        <CategoryBase onClick={handleRecipeClick(recipeName)}>
                            <Chip
                                className={clsx(pinnedContains(recipeName) && classes.selectedChip)}
                                icon={<LinkIcon />}
                                label={recipeName}
                            />
                        </CategoryBase>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
