import { createStyles, Grid, makeStyles, Tab, Tabs, Typography, useTheme } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import useScrollButtons from '../../hooks/useScrollButtons'
import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import MarkdownRenderer from '../Markdown/MarkdownRenderer'
import { useBookmarkContext } from '../Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { GridLayout, useGridContext } from '../Provider/GridProvider'
import RecipeBookmarkButton from '../Recipe/RecipeBookmarkButton'
import RecipeDetailsButton from '../Recipe/RecipeDetailsButton'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'
import StyledCard from '../Shared/StyledCard'

const useStyles = makeStyles(theme =>
    createStyles({
        recipeItem: {
            [theme.breakpoints.down('xs')]: {
                width: 340,
            },
            [theme.breakpoints.up('sm')]: {
                width: 600,
            },
        },
        recipeContainer: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    })
)

interface BookmarkProps {
    recipeName: string
    gridLayout: GridLayout
}

const Bookmark = ({ recipeName, gridLayout }: BookmarkProps) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [value, setValue] = useState(0)

    const classes = useStyles()

    useEffect(() => {
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .onSnapshot(doc => setRecipe({ name: doc.id, ...doc.data() } as Recipe))
    }, [recipeName])

    return (
        <div className={clsx(gridLayout === 'grid' && classes.recipeItem)}>
            <StyledCard
                header={recipeName}
                action={
                    <>
                        <RecipeDetailsButton recipe={recipe} />
                        <RecipeBookmarkButton name={recipeName} />
                    </>
                }>
                <>
                    <Tabs
                        style={{ flexGrow: 1 }}
                        variant="fullWidth"
                        value={value}
                        onChange={(_e, newValue) => setValue(newValue)}>
                        <Tab icon={<AssignmentIcon />} label="Zutaten" />
                        <Tab icon={<BookIcon />} label="Beschreibung" />
                    </Tabs>
                    {recipe ? (
                        <SwipeableViews animateHeight disabled index={value}>
                            <MarkdownRenderer recipeName={recipeName} source={recipe.ingredients} />
                            <MarkdownRenderer recipeName={recipeName} source={recipe.description} />
                        </SwipeableViews>
                    ) : (
                        <Skeleton variant="rect" width="100%" height={400} />
                    )}
                </>
            </StyledCard>
        </div>
    )
}

const Bookmarks = () => {
    const { loginEnabled } = useFirebaseAuthContext()
    const { bookmarks } = useBookmarkContext()
    const { gridLayout } = useGridContext()

    const classes = useStyles()
    const theme = useTheme()

    // ? no internal state >> we cannot use useRef here
    const [containerRef, setContainerRef] = useState<any | undefined>()
    const { ScrollButtons, ScrollLeftTrigger, ScrollRightTrigger } = useScrollButtons({
        disabled: bookmarks.size === 0,
        element: containerRef as HTMLDivElement,
        delta: theme.breakpoints.down('xs') ? 340 : 600,
    })

    useDocumentTitle(`Lesezeichen (${bookmarks.size})`)

    return (
        <EntryGridContainer>
            <Grid item xs={10} md={9}>
                <Typography variant="h4">Lesezeichen</Typography>
            </Grid>
            <Grid item xs={2} md={3}>
                <ScrollButtons />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    spacing={3}
                    ref={ref => setContainerRef(ref)}
                    wrap={gridLayout === 'grid' ? 'nowrap' : 'wrap'}
                    className={classes.recipeContainer}>
                    <ScrollLeftTrigger />
                    {[...bookmarks.values()].map(recipeName => (
                        <Grid item xs={gridLayout === 'list' ? 12 : 'auto'} key={recipeName}>
                            <Bookmark gridLayout={gridLayout} recipeName={recipeName} />
                        </Grid>
                    ))}

                    <Skeletons
                        variant="bookmark"
                        visible={bookmarks.size === 0 && !loginEnabled}
                        numberOfSkeletons={4}
                    />

                    <ScrollRightTrigger />
                </Grid>
                <NotFound visible={bookmarks.size === 0 && loginEnabled} />
            </Grid>
        </EntryGridContainer>
    )
}

export default Bookmarks
