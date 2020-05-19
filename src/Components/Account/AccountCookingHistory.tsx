import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { CookingHistory, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import HomeRecipeCard from '../Home/HomeRecipeCard'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'

interface StyleProps {
    compactLayout: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        skeleton: {
            [theme.breakpoints.only('xs')]: {
                height: ({ compactLayout }: StyleProps) => (compactLayout ? 44.86 : 360),
            },
            [theme.breakpoints.between('sm', 'md')]: {
                height: ({ compactLayout }: StyleProps) => (compactLayout ? 48 : 360),
            },
            [theme.breakpoints.up('lg')]: {
                height: ({ compactLayout }: StyleProps) => (compactLayout ? 48 : 200),
            },
            width: '100%',
            borderRadius: BORDER_RADIUS,
        },
    })
)

const HistoryElement = ({ recipeName, createdDate }: CookingHistory) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [notFound, setNotFound] = useState(false)

    const { gridBreakpointProps, compactLayout } = useGridContext()
    const classes = useStyles({ compactLayout })

    useEffect(() => {
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .get()
            .then(doc => {
                if (doc.exists) setRecipe(doc.data() as Recipe)
                else setNotFound(true)
            })
    }, [recipeName])

    if (notFound) return <></>

    return (
        <>
            {recipe ? (
                <HomeRecipeCard recipe={recipe} lastCookedDate={createdDate} />
            ) : (
                <Grid item {...gridBreakpointProps}>
                    <Skeleton variant="rect" animation="wave" className={classes.skeleton} />
                </Grid>
            )}
        </>
    )
}

const AccountCookingHistory = () => {
    const [cookingHistory, setCookingHistory] = useState<CookingHistory[]>([])
    const [loading, setLoading] = useState(true)

    const { user } = useFirebaseAuthContext()

    useDocumentTitle(`Kochverlauf (${cookingHistory.length})`)

    useEffect(() => {
        if (!user) return setLoading(false)

        return FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .collection('cookingHistory')
            .orderBy('createdDate', 'desc')
            .onSnapshot(snapshot => {
                setCookingHistory(snapshot.docs.map(doc => doc.data() as CookingHistory))
                setLoading(false)
            })
    }, [user])

    if (!user) return <></>

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    {cookingHistory.map(element => (
                        <HistoryElement
                            key={element.recipeName + element.createdDate.toMillis()}
                            {...element}
                        />
                    ))}
                </Grid>
                <NotFound visible={!loading && cookingHistory.length === 0} />
            </Grid>
        </EntryGridContainer>
    )
}

export default AccountCookingHistory
