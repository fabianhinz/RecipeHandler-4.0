import { Grid, Tab, Tabs } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import MarkdownRenderer from '../Markdown/MarkdownRenderer'
import { useBookmarkContext } from '../Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import RecipeBookmarkButton from '../Recipe/RecipeBookmarkButton'
import RecipeDetailsButton from '../Recipe/RecipeDetailsButton'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import StyledCard from '../Shared/StyledCard'

interface BookmarkProps {
    recipeName: string
}

const Bookmark = ({ recipeName }: BookmarkProps) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [value, setValue] = useState(0)

    useEffect(() => {
        let mounted = true
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .onSnapshot(doc => {
                if (mounted) setRecipe({ name: doc.id, ...doc.data() } as Recipe)
            })

        return () => {
            mounted = false
        }
    }, [recipeName])

    // TODO auslagern, wohin?
    const calculateAmountText = () => {
        if (recipe) {
            switch (recipe.amount) {
                case 21: {
                    return 'eine kleine Form'
                }
                case 22: {
                    return 'eine große Form'
                }
                case 23: {
                    return 'ein Blech'
                }
                case 1: {
                    return '1 Person'
                }
                default: {
                    if (recipe.amount > 30) return `${recipe.amount - 30} Stück`
                    else return `${recipe.amount} Personen`
                }
            }
        }
    }

    return (
        <>
            {recipe ? (
                <StyledCard
                    header={recipeName}
                    action={
                        <>
                            <RecipeDetailsButton recipe={recipe} />
                            <RecipeBookmarkButton name={recipeName} />
                        </>
                    }>
                    <Tabs
                        variant="fullWidth"
                        value={value}
                        onChange={(_e, newValue) => setValue(newValue)}>
                        <Tab
                            icon={<AssignmentIcon />}
                            label={`Zutaten für ${calculateAmountText()}`}
                        />
                        <Tab icon={<BookIcon />} label="Beschreibung" />
                    </Tabs>

                    <SwipeableViews disableLazyLoading disabled index={value}>
                        <MarkdownRenderer recipeName={recipeName} source={recipe.ingredients} />
                        <MarkdownRenderer recipeName={recipeName} source={recipe.description} />
                    </SwipeableViews>
                </StyledCard>
            ) : (
                <Skeleton animation="wave" width="100%" height={400} variant="rect" />
            )}
        </>
    )
}

const Bookmarks = () => {
    const { loginEnabled } = useFirebaseAuthContext()
    const { bookmarks } = useBookmarkContext()
    const { gridBreakpointProps } = useGridContext()

    useDocumentTitle(`Lesezeichen (${bookmarks.size})`)

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    {[...bookmarks.values()].map(recipeName => (
                        <Grid item {...gridBreakpointProps} key={recipeName}>
                            <Bookmark recipeName={recipeName} />
                        </Grid>
                    ))}
                </Grid>
                <NotFound visible={bookmarks.size === 0 && loginEnabled} />
            </Grid>
        </EntryGridContainer>
    )
}

export default Bookmarks
