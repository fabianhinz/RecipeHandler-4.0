import {
    Avatar,
    Box,
    Card,
    CardActionArea,
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
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import { Skeleton } from '@material-ui/lab'
import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { FirebaseService } from '../../../firebase'
import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { BORDER_RADIUS } from '../../../theme'
import { CategoryResult } from '../../Category/CategoryResult'
import { useRouterContext } from '../../Provider/RouterProvider'
import { Subtitle } from '../../Shared/Subtitle'
import { RecipeActions, RecipeResultAction } from './Action/RecipeResultAction'
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
        attachementPreview: {
            width: 200,
            height: 200,
        },
        attachement: {
            width: '100%',
            borderRadius: BORDER_RADIUS,
        },
        actionArea: {
            borderRadius: '50%',
        },
    })
)

const getGridBreakpoints = (pinned?: boolean): Partial<Record<Breakpoint, boolean | GridSize>> =>
    pinned ? { xs: 12 } : { xs: 12, lg: 6, xl: 4 }

interface AttachementPreviewProps {
    attachement: AttachementMetadata | AttachementData
    onSelect: (dataUrl: MediumDataUrl) => void
}

const AttachementPreview = ({ attachement, onSelect }: AttachementPreviewProps) => {
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)
    const classes = useStyles()

    return (
        <Grid item>
            {attachementRefLoading ? (
                <Skeleton variant="circle" className={classes.attachementPreview} />
            ) : (
                <CardActionArea
                    onClick={() => onSelect(attachementRef.mediumDataUrl)}
                    className={classes.actionArea}>
                    <Avatar
                        className={classes.attachementPreview}
                        src={attachementRef.smallDataUrl}
                    />
                </CardActionArea>
            )}
        </Grid>
    )
}

type MediumDataUrl = string

const RecipeResult = ({ recipe, ...actionProps }: RecipeResultProps) => {
    const [selectedAttachement, setSelectedAttachement] = useState<MediumDataUrl | null>(null)
    const { location } = useRouterContext()
    const classes = useStyles()

    useEffect(() => {
        setSelectedAttachement(null)
    }, [location.pathname])

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center">
                <Slide in direction="down" timeout={500}>
                    <NotFoundIcon width={200} />
                </Slide>
            </Box>
        )

    const handleAttachementSelect = (attachement: MediumDataUrl) => {
        if (selectedAttachement === attachement) setSelectedAttachement(null)
        else setSelectedAttachement(attachement)
    }

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

            <Grid item xs={12}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <PerfectScrollbar
                            style={{ paddingRight: 8 }}
                            options={{ suppressScrollY: true }}>
                            <Grid wrap="nowrap" container spacing={2}>
                                {recipe.attachements.map(attachement => (
                                    <AttachementPreview
                                        onSelect={handleAttachementSelect}
                                        attachement={attachement}
                                        key={attachement.name}
                                    />
                                ))}
                            </Grid>
                        </PerfectScrollbar>
                    </Grid>

                    {selectedAttachement && (
                        <Grid {...getGridBreakpoints(actionProps.pinned)} item>
                            <img src={selectedAttachement} alt="" className={classes.attachement} />
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {/* {recipe.attachements.length > 0 && (
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
            )} */}

            {recipe.ingredients.length > 0 && (
                <Grid {...getGridBreakpoints(actionProps.pinned)} item>
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
                <Grid {...getGridBreakpoints(actionProps.pinned)} item>
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
                <Grid {...getGridBreakpoints(actionProps.pinned)} item>
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
