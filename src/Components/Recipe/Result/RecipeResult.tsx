import {
    Box,
    Card,
    CardContent,
    createStyles,
    Divider,
    Grid,
    makeStyles,
    Slide,
    Typography,
} from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'

import { FirebaseService } from '../../../firebase'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { CategoryResult } from '../../Category/CategoryResult'
import { Subtitle } from '../../Shared/Subtitle'
import { RecipeActions, RecipeResultAction } from './Action/RecipeResultAction'
import { RecipeResultImg } from './RecipeResultImg'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeActions {
    recipe: Recipe<AttachementMetadata | AttachementData> | null
}

const useStyles = makeStyles(theme =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
        openSans: {
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
    })
)

const RecipeResult = ({ recipe, ...actionProps }: RecipeResultProps) => {
    const classes = useStyles()

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center">
                <Slide in direction="down" timeout={500}>
                    <NotFoundIcon width={200} />
                </Slide>
            </Box>
        )

    const breakpoints = (): Partial<Record<Breakpoint, boolean | GridSize>> =>
        actionProps.pinned ? { xs: 12 } : { xs: 12, md: 6, lg: 4 }

    return (
        <Grid container spacing={4} className={classes.recipeContainer} alignContent="stretch">
            <Grid item xs={12}>
                <Grid container spacing={2} justify="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4">{recipe.name}</Typography>
                        <Typography variant="caption">
                            Erstellt am{' '}
                            {FirebaseService.createDateFromTimestamp(
                                recipe.createdDate
                            ).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {actionProps.actions && (
                            <RecipeResultAction
                                name={recipe.name}
                                numberOfComments={recipe.numberOfComments}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <CategoryResult categories={recipe.categories} />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            {recipe.attachements.length > 0 && (
                <Grid {...breakpoints()} item>
                    <Card
                        style={{
                            maxHeight: 500,
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                        <Card
                            raised
                            style={{
                                position: 'sticky',
                                borderRadius: 24,
                                zIndex: 1,
                                backgroundColor: '#A5D6A7',
                                color: '#000',
                                top: 16,
                                padding: '0px 8px',
                                margin: '0 auto',
                                width: 'fit-content',
                            }}>
                            <Subtitle noMargin icon={<CameraIcon />} text={'Bilder'} />
                        </Card>
                        <CardContent style={{ paddingTop: 32 }}>
                            <Grid container spacing={2}>
                                {recipe.attachements.map(attachement => (
                                    <RecipeResultImg
                                        {...actionProps}
                                        key={attachement.name}
                                        attachement={attachement}
                                    />
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            )}

            {recipe.ingredients.length > 0 && (
                <Grid {...breakpoints()} item>
                    <Card
                        style={{
                            maxHeight: 500,
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                        <Card
                            raised
                            style={{
                                position: 'sticky',
                                borderRadius: 24,
                                zIndex: 1,
                                backgroundColor: '#A5D6A7',
                                color: '#000',
                                top: 16,
                                left: 0,
                                right: 0,
                                padding: '0px 8px',
                                margin: '0 auto',
                                width: 'fit-content',
                            }}>
                            <Subtitle
                                noMargin
                                icon={<AssignmentIcon />}
                                text={
                                    <>
                                        Zutaten für {recipe.amount}{' '}
                                        {recipe.amount < 2 ? 'Person' : 'Personen'}
                                    </>
                                }
                            />
                        </Card>
                        <CardContent style={{ paddingTop: 32 }}>
                            <ReactMarkdown
                                className={classes.openSans}
                                source={recipe.ingredients}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            )}

            {recipe.description.length > 0 && (
                <Grid {...breakpoints()} item>
                    <Card
                        style={{
                            maxHeight: 500,
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                        <Card
                            raised
                            style={{
                                position: 'sticky',
                                borderRadius: 24,
                                zIndex: 1,
                                backgroundColor: '#A5D6A7',
                                color: '#000',
                                top: 16,
                                left: 0,
                                right: 0,
                                padding: '0px 8px',
                                margin: '0 auto',
                                width: 'fit-content',
                            }}>
                            <Subtitle noMargin icon={<BookIcon />} text="Beschreibung" />
                        </Card>
                        <CardContent style={{ paddingTop: 32 }}>
                            <ReactMarkdown
                                className={classes.openSans}
                                source={recipe.description}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            )}

            {recipe.relatedRecipes.length > 0 && (
                <Grid {...breakpoints()} item>
                    <Card
                        style={{
                            maxHeight: 500,
                            height: '100%',
                            overflowY: 'scroll',
                        }}>
                        <Card
                            raised
                            style={{
                                position: 'sticky',
                                borderRadius: 24,
                                zIndex: 1,
                                backgroundColor: '#A5D6A7',
                                color: '#000',
                                top: 16,
                                left: 0,
                                right: 0,
                                padding: '0px 8px',
                                margin: '0 auto',
                                width: 'fit-content',
                            }}>
                            <Subtitle noMargin icon={<LabelIcon />} text="Passt gut zu" />
                        </Card>
                        <CardContent style={{ paddingTop: 32 }}>
                            <RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}

export default memo(
    RecipeResult,
    (prev, next) =>
        prev.recipe === next.recipe && prev.actions === next.actions && prev.pinned === next.pinned
)
