import { Box, Button, Grid, Slide, Typography } from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { FC, memo } from 'react'
import ReactMarkdown from 'react-markdown'

import { FirebaseService } from '../../../firebase'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { CategoryResult } from '../../Category/CategoryResult'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { Subtitle } from '../../Shared/Subtitle'
import { RecipeActions, RecipeResultAction } from './Action/RecipeResultAction'
import { RecipeResultImg } from './RecipeResultImg'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeActions {
    recipe: Recipe<AttachementMetadata | AttachementData> | null
}

const RecipeResult: FC<RecipeResultProps> = ({ recipe, actionProps }) => {
    const { history } = useRouterContext()
    const { user } = useFirebaseAuthContext()

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center">
                <Slide in direction="down" timeout={500}>
                    <NotFoundIcon width={200} />
                </Slide>
            </Box>
        )

    const breakpoints = (options: {
        ingredient: boolean
    }): Partial<Record<Breakpoint, boolean | GridSize>> =>
        !actionProps.actionsEnabled ? { xs: 12 } : { xs: 12, md: 6, lg: options.ingredient ? 4 : 6 }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h6">{recipe.name}</Typography>
                    </Grid>
                    <RecipeResultAction
                        name={recipe.name}
                        actionProps={actionProps}
                        numberOfComments={recipe.numberOfComments}
                    />
                </Grid>
            </Grid>
            <Grid item>
                <CategoryResult categories={recipe.categories} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {recipe.attachements.map(attachement => (
                        <RecipeResultImg
                            actionProps={actionProps}
                            key={attachement.name}
                            attachement={attachement}
                        />
                    ))}
                </Grid>
            </Grid>

            <Grid {...breakpoints({ ingredient: true })} item>
                <Subtitle icon={<AssignmentIcon />} text={`Zutaten für ${recipe.amount}`} />
                <ReactMarkdown source={recipe.ingredients} />
            </Grid>

            <Grid {...breakpoints({ ingredient: false })} item>
                <Subtitle icon={<BookIcon />} text="Beschreibung" />
                <ReactMarkdown source={recipe.description} />
            </Grid>

            <Grid item xs={12}>
                <Subtitle icon={<LabelIcon />} text="Passt gut zu" />
                <RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">
                    Erstellt am:{' '}
                    {FirebaseService.createDateFromTimestamp(
                        recipe.createdDate
                    ).toLocaleDateString()}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                {user && actionProps.actionsEnabled && (
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => history.push(PATHS.recipeEdit(recipe.name), { recipe })}>
                            Bearbeiten
                        </Button>
                    </Box>
                )}
            </Grid>
        </Grid>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.actionProps === next.actionProps
)
