import { Grid } from '@material-ui/core'
import { LogoutVariant } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useMemo } from 'react'

import useDocumentTitle from '../../../hooks/useDocumentTitle'
import useProgress from '../../../hooks/useProgress'
import { ShoppingList, User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useBookmarkContext } from '../../Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useGridContext } from '../../Provider/GridProvider'
import { NavigateFab } from '../../Routes/Navigate'
import AccountUserAdmin from './AccountUserAdmin'
import AccountUserHeader from './AccountUserHeader'
import AccountUserRecipes from './AccountUserRecipes'

type SettingKeys = keyof Pick<
    User,
    | 'muiTheme'
    | 'selectedUsers'
    | 'showRecentlyAdded'
    | 'showMostCooked'
    | 'notifications'
    | 'algoliaAdvancedSyntax'
    | 'bookmarkSync'
>

export type UserSettingChangeHandler = (key: SettingKeys) => (uid?: any) => void

const AccountUser = () => {
    // ? we won't load this component without an existing user - pinky promise -_-
    const { user } = useFirebaseAuthContext() as {
        user: User
        shoppingList: ShoppingList
    }
    const { gridBreakpointProps } = useGridContext()
    const { bookmarks } = useBookmarkContext()
    const { ProgressComponent, setProgress } = useProgress()
    const { enqueueSnackbar } = useSnackbar()

    const userDoc = useMemo(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

    useDocumentTitle(user.username)

    const handleLogout = () => {
        setProgress(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleUserSettingChange: UserSettingChangeHandler = (key: SettingKeys) => (uid?: any) => {
        switch (key) {
            case 'muiTheme': {
                userDoc.update({
                    [key]:
                        user.muiTheme === 'dynamic'
                            ? 'dark'
                            : user.muiTheme === 'dark'
                            ? 'light'
                            : 'dynamic',
                })
                break
            }
            case 'selectedUsers': {
                if (typeof uid !== 'string') throw new Error('whoops we need a string for this')

                let selectedIds = [...user.selectedUsers]
                const idExists = selectedIds.some(id => id === uid)

                if (idExists && selectedIds.length > 1) {
                    selectedIds = selectedIds.filter(id => id !== uid)
                } else if (!idExists && selectedIds.length < 10) {
                    selectedIds.push(uid)
                }

                userDoc.update({ [key]: selectedIds })
                break
            }
            case 'showRecentlyAdded': {
                userDoc.update({ [key]: !user.showRecentlyAdded })
                break
            }
            case 'showMostCooked': {
                userDoc.update({ [key]: !user.showMostCooked })
                break
            }
            case 'notifications': {
                userDoc.update({ [key]: !user.notifications })
                break
            }
            case 'algoliaAdvancedSyntax': {
                userDoc.update({ [key]: !user.algoliaAdvancedSyntax })
                break
            }
            case 'bookmarkSync': {
                const newSyncSetting = !user.bookmarkSync
                const updates: Partial<Pick<User, 'bookmarks' | 'bookmarkSync'>> = {
                    bookmarkSync: newSyncSetting,
                }
                // ? user has already selected bookmarks and decides to sync them
                if (newSyncSetting && bookmarks.size > 0) {
                    updates.bookmarks = [...bookmarks.values()]
                }
                userDoc.update(updates)
                break
            }
        }
    }

    return (
        <>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12}>
                    <AccountUserHeader
                        user={user}
                        userDoc={userDoc}
                        onUserSettingChange={handleUserSettingChange}
                    />
                </Grid>

                <Grid item {...gridBreakpointProps}>
                    <AccountUserRecipes onUserSettingChange={handleUserSettingChange} />
                </Grid>

                {user.admin && (
                    <Grid item {...gridBreakpointProps}>
                        <AccountUserAdmin />
                    </Grid>
                )}
            </Grid>

            <NavigateFab onClick={handleLogout} icon={<LogoutVariant />} tooltipTitle="Ausloggen" />
            <ProgressComponent />
        </>
    )
}

export default AccountUser
