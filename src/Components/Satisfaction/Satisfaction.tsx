import { Box, createStyles, Fade, Grid, IconButton, makeStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ChevronLeftRounded'
import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import SatisfactionUser from './SatisfactionUser'

const useStyles = makeStyles(theme =>
    createStyles({
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.standard,
            }),
        },
        expanded: {
            transform: 'rotate(180deg)',
        },
        divider: {
            height: theme.spacing(8),
        },
        userSatisfaction: {
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.standard,
            }),
        },
        userSatisfactionExpanded: {
            transform: 'translate(-202px)',
        },
        satisfaction: {
            transform: 'translate(3000px)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.complex,
            }),
        },
        satisfactionExpanded: {
            transform: 'translate(0px)',
        },
        satisfactionsGridContainer: {
            overflowX: 'auto',
        },
    })
)

interface Props {
    recipeName: string
}

const Satisfaction = ({ recipeName }: Props) => {
    const { user, loginEnabled } = useFirebaseAuthContext()
    const [expanded, setExpanded] = useState(false)
    const [satisfaction, setSatisfaction] = useState<Map<string, number>>(new Map())

    const { userIds } = useUsersContext()
    const classes = useStyles()

    const memoSatisfactionCollection = useMemo(
        () =>
            FirebaseService.firestore
                .collection('recipes')
                .doc(recipeName)
                .collection('satisfaction'),
        [recipeName]
    )

    useEffect(() => {
        setExpanded(!user)
    }, [user])

    useEffect(
        () =>
            memoSatisfactionCollection.onSnapshot(querySnapshot =>
                setSatisfaction(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data().value])))
            ),
        [memoSatisfactionCollection]
    )

    const handleSatisfactionChange = (_event: React.ChangeEvent<{}>, value: number | null) => {
        if (!user) return

        memoSatisfactionCollection.doc(user.uid).set({ value })
    }

    const satisfactionValueOrNull = useCallback((uid: string) => satisfaction.get(uid) || null, [
        satisfaction,
    ])

    return (
        <Fade in={loginEnabled}>
            <div>
                <Grid
                    className={clsx(
                        classes.userSatisfaction,
                        user && expanded && classes.userSatisfactionExpanded
                    )}
                    container
                    wrap="nowrap"
                    spacing={2}
                    alignItems="center">
                    {user && (
                        <>
                            <Grid item>
                                <SatisfactionUser
                                    value={satisfactionValueOrNull(user.uid)}
                                    onChange={handleSatisfactionChange}
                                    uid={user.uid}
                                />
                            </Grid>
                            <Grid item>
                                <Box display="flex" justifyContent="center">
                                    <IconButton onClick={() => setExpanded(prev => !prev)}>
                                        <ExpandMoreIcon
                                            className={clsx(
                                                classes.expand,
                                                expanded && classes.expanded
                                            )}
                                        />
                                    </IconButton>
                                </Box>
                            </Grid>
                        </>
                    )}

                    <Grid
                        item
                        xs={!user ? 12 : 10}
                        className={clsx(
                            classes.satisfaction,
                            expanded && classes.satisfactionExpanded
                        )}>
                        <Grid
                            className={classes.satisfactionsGridContainer}
                            container
                            spacing={2}
                            wrap="nowrap"
                            alignItems="center">
                            {userIds
                                .filter(uid => {
                                    if (user) return uid !== user.uid
                                    else return uid
                                })
                                .map(uid => (
                                    <Grid item key={uid}>
                                        <SatisfactionUser
                                            disabled
                                            value={satisfactionValueOrNull(uid)}
                                            uid={uid}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Fade>
    )
}

export default Satisfaction
