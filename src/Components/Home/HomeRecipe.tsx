import { Box, Card, CardContent, Grid, Grow } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { AttachmentMetadata, Recipe } from '../../model/model'
import RecipeResult from '../Recipe/Result/RecipeResult'

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachmentMetadata>>
    skeletons: boolean
    expandDisabled: boolean
    onLastInView: (lastInView: string) => void
}

export const HomeRecipe = (props: HomeRecipeProps) => {
    const [ref, inView] = useInView({ triggerOnce: true })

    useEffect(() => {
        if (props.recipes.length === 0) return
        if (inView) props.onLastInView(props.recipes[props.recipes.length - 1].name)
    }, [inView, props])

    return (
        <Box marginBottom={2}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        {props.recipes.map((recipe, index) => (
                            <Grid innerRef={ref} xs={12} item key={recipe.name}>
                                <RecipeResult
                                    variant="summary"
                                    recipe={recipe}
                                    divider={
                                        recipe.name !== props.recipes[props.recipes.length - 1].name
                                    }
                                />
                            </Grid>
                        ))}
                        {props.skeletons &&
                            props.recipes.length === 0 &&
                            new Array(4).fill(1).map((_skeleton, index) => (
                                <Grid xs={12} item key={index}>
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="space-between"
                                        alignItems="center">
                                        <Grid xs={12} item>
                                            <Skeleton width="100%" height={140} variant="rect" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        {!props.skeletons && props.recipes.length === 0 && (
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="center">
                                    <Grow in timeout={500}>
                                        <NotFoundIcon width={200} />
                                    </Grow>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}
