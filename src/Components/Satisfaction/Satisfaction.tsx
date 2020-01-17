import { Box, createStyles, Divider, Fade, Grid, IconButton, makeStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ChevronLeftRounded'
import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'

import { getTransitionTimeoutProps } from '../../hooks/useTransition'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import SatisfactionUser from './SatisfactionUser'

const useStyles = makeStyles(theme =>
    createStyles({
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expanded: {
            transform: 'rotate(180deg)',
        },
        divider: {
            height: theme.spacing(8),
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
    })
)

interface Props {
    transitionOrder: number
    recipeName: string
}

const Satisfaction = ({ transitionOrder, recipeName }: Props) => {
    const { user, loginEnabled } = useFirebaseAuthContext()
    const [expanded, setExpanded] = useState(loginEnabled && !user)
    const [satisfaction, setSatisfaction] = useState<Map<string, number>>(new Map())

    const { userIds } = useUsersContext()
    const classes = useStyles()

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('recipes')
                .doc(recipeName)
                .collection('satisfaction')
                .onSnapshot(querySnapshot =>
                    setSatisfaction(
                        new Map(querySnapshot.docs.map(doc => [doc.id, doc.data().value]))
                    )
                ),
        [recipeName]
    )

    const handleSatisfactionChange = (_event: React.ChangeEvent<{}>, value: number | null) => {
        if (!user) return
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .collection('satisfaction')
            .doc(user.uid)
            .set({ value })
    }

    const satisfactionValueOrNull = useCallback((uid: string) => satisfaction.get(uid) || null, [
        satisfaction,
    ])

    return (
        <Fade in={loginEnabled} timeout={getTransitionTimeoutProps(transitionOrder)}>
            <Grid container spacing={2} wrap="nowrap" alignItems="center">
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
                        <Grid item>
                            <Divider className={classes.divider} orientation="vertical" />
                        </Grid>
                    </>
                )}

                <Grid
                    item
                    className={clsx(
                        classes.satisfaction,
                        expanded && classes.satisfactionExpanded
                    )}>
                    <Grid container spacing={2} wrap="nowrap" alignItems="center">
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
        </Fade>
    )
}

export default Satisfaction
