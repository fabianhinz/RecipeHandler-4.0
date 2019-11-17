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
import ZoomInIcon from '@material-ui/icons/ZoomInRounded'
import { Skeleton } from '@material-ui/lab'
import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { BORDER_RADIUS } from '../../../theme'
import { CategoryResult } from '../../Category/CategoryResult'
import { useRouterContext } from '../../Provider/RouterProvider'
import { Subtitle } from '../../Shared/Subtitle'
import { RecipeResultAction, RecipeVariants } from './Action/RecipeResultAction'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe<AttachementMetadata | AttachementData> | null
}

const useStyles = makeStyles(theme =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
        markdown: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
        attachementPreview: {
            width: 200,
            height: 200,
            boxShadow: theme.shadows[1],
        },
        attachement: {
            width: '100%',
            boxShadow: theme.shadows[1],
            borderRadius: BORDER_RADIUS,
        },
        actionArea: {
            borderRadius: '50%',
        },
    })
)

const getGridBreakpoints = (fullWidth?: boolean): Partial<Record<Breakpoint, boolean | GridSize>> =>
    fullWidth ? { xs: 12 } : { xs: 12, lg: 6, xl: 4 }

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
                        src={attachementRef.mediumDataUrl}
                    />
                </CardActionArea>
            )}
        </Grid>
    )
}

type MediumDataUrl = string

const RecipeResult = ({ recipe, variant }: RecipeResultProps) => {
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

    const cardElevation = variant === 'pinned' ? 0 : 1
    const cardMaxHeight = variant === 'pinned' ? 'unset' : 425

    return (
        <Grid
            container
            spacing={variant === 'pinned' ? 2 : 4}
            className={classes.recipeContainer}
            alignContent="stretch">
            <Grid item xs={12}>
                <Grid container spacing={2} justify="space-between" alignItems="center">
                    <Grid item xs={variant === 'pinned' ? 12 : 8}>
                        <Typography variant="h5">{recipe.name}</Typography>
                        <Typography variant="caption">
                            Erstellt am{' '}
                            {FirebaseService.createDateFromTimestamp(
                                recipe.createdDate
                            ).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    {variant !== 'pinned' && (
                        <Grid item xs={4}>
                            <RecipeResultAction
                                name={recipe.name}
                                numberOfComments={recipe.numberOfComments}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <CategoryResult categories={recipe.categories} />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            {variant !== 'summary' && (
                <>
                    {variant !== 'pinned' && (
                        <Grid item xs={12}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <PerfectScrollbar
                                        style={{ paddingRight: 8 }}
                                        options={{ suppressScrollY: true }}>
                                        <Grid
                                            wrap="nowrap"
                                            container
                                            spacing={2}
                                            justify="flex-start">
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
                                    <Grid {...getGridBreakpoints()} item>
                                        <img
                                            src={selectedAttachement}
                                            alt=""
                                            className={classes.attachement}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    )}
                    {recipe.ingredients.length > 0 && (
                        <Grid {...getGridBreakpoints(variant === 'pinned')} item>
                            <Card
                                elevation={cardElevation}
                                style={{
                                    maxHeight: cardMaxHeight,
                                    height: '100%',
                                    overflowY: 'auto',
                                }}>
                                <Card
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: '#A5D6A7',
                                        color: '#000',
                                        padding: '0px 8px',
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
                                <CardContent
                                    style={
                                        variant === 'pinned' ? { padding: 0, paddingTop: 16 } : {}
                                    }>
                                    <ReactMarkdown
                                        className={classes.markdown}
                                        source={recipe.ingredients}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {recipe.description.length > 0 && (
                        <Grid {...getGridBreakpoints(variant === 'pinned')} item>
                            <Card
                                elevation={cardElevation}
                                style={{
                                    maxHeight: cardMaxHeight,
                                    height: '100%',
                                    overflowY: 'auto',
                                }}>
                                <Card
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: '#A5D6A7',
                                        color: '#000',
                                        padding: '0px 8px',
                                    }}>
                                    <Subtitle noMargin icon={<BookIcon />} text="Beschreibung" />
                                </Card>
                                <CardContent
                                    style={
                                        variant === 'pinned' ? { padding: 0, paddingTop: 16 } : {}
                                    }>
                                    <ReactMarkdown
                                        className={classes.markdown}
                                        source={recipe.description}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    <Grid {...getGridBreakpoints(variant === 'pinned')} item>
                        <Card
                            elevation={cardElevation}
                            style={{
                                maxHeight: cardMaxHeight,
                                height: '100%',
                                overflowY: 'scroll',
                            }}>
                            <Card
                                style={{
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: '#A5D6A7',
                                    color: '#000',
                                    padding: '0px 8px',
                                }}>
                                <Subtitle noMargin icon={<LabelIcon />} text="Passt gut zu" />
                            </Card>
                            <CardContent
                                style={variant === 'pinned' ? { padding: 0, paddingTop: 16 } : {}}>
                                <RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
                                {recipe.relatedRecipes.length === 0 && (
                                    <Box display="flex" justifyContent="center">
                                        <NotFoundIcon width={200} />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.variant === next.variant
)
