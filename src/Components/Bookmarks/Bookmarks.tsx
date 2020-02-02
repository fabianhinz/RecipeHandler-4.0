import { Box, createStyles, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { AttachmentMetadata, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import MarkdownRenderer from '../Markdown/MarkdownRenderer'
import { useBookmarkContext } from '../Provider/BookmarkProvider'
import { RecipeResultBookmark } from '../Recipe/Result/Action/RecipeResultBookmark'
import NotFound from '../Shared/NotFound'
import StyledCard from '../Shared/StyledCard'
import { Subtitle } from '../Shared/Subtitle'

const useStyles = makeStyles(theme =>
    createStyles({
        recipeItem: {
            [theme.breakpoints.down('xs')]: {
                width: 320,
            },
            [theme.breakpoints.up('sm')]: {
                width: 600,
            },
        },
        recipeContainer: {
            overflowX: 'auto',
        },
    })
)

interface BookmarkProps {
    recipeName: string
}

const Bookmark = ({ recipeName }: BookmarkProps) => {
    const [recipe, setRecipe] = useState<Recipe<AttachmentMetadata> | null>(null)
    const [value, setValue] = useState(0)

    const classes = useStyles()

    useEffect(() => {
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .onSnapshot(doc =>
                setRecipe({ name: doc.id, ...doc.data() } as Recipe<AttachmentMetadata>)
            )
    }, [recipeName])

    return (
        <div className={classes.recipeItem}>
            <StyledCard header={<Subtitle text={recipeName} />}>
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
                        <>
                            <SwipeableViews index={value}>
                                <MarkdownRenderer
                                    recipeName={recipeName}
                                    source={recipe.ingredients}
                                />
                                <MarkdownRenderer
                                    recipeName={recipeName}
                                    source={recipe.description}
                                />
                            </SwipeableViews>
                            <Box display="flex" justifyContent="center">
                                <RecipeResultBookmark name={recipeName} />
                            </Box>
                        </>
                    ) : (
                        <Skeleton variant="rect" width="100%" height={400} />
                    )}
                </>
            </StyledCard>
        </div>
    )
}

const Bookmarks = () => {
    const { bookmarks } = useBookmarkContext()
    const classes = useStyles()

    return (
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h4">Lesezeichen</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3} wrap="nowrap" className={classes.recipeContainer}>
                    {[...bookmarks.values()].map(recipeName => (
                        <Grid item key={recipeName}>
                            <Bookmark recipeName={recipeName} />
                        </Grid>
                    ))}
                </Grid>
                <NotFound visible={bookmarks.size === 0} />
            </Grid>
        </Grid>
    )
}

export default Bookmarks
