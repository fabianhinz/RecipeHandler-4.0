import { Grid } from '@material-ui/core'
import { LogoutVariant } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'

import useProgress from '../../../hooks/useProgress'
import { ShoppingList, User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useGridContext } from '../../Provider/GridProvider'
import { NavigateFab } from '../../Routes/Navigate'
import AccountUserAdmin from './AccountUserAdmin'
import AccountUserHeader from './AccountUserHeader'
import AccountUserRecipes from './AccountUserRecipes'
import AccountUserSettings from './AccountUserSettings'
import AccountUserShoppingList from './AccountUserShoppingList'

type SettingKeys = keyof Pick<
    User,
    'muiTheme' | 'selectedUsers' | 'showRecentlyAdded' | 'notifications' | 'algoliaAdvancedSyntax'
>

export type UserSettingChangeHandler = (key: SettingKeys) => (uid?: any) => void

const AccountUser = () => {
    const [showInfo, setShowInfo] = useState(false)

    // ? we won't load this component without an existing user - pinky promise -_-
    const { user, shoppingList } = useFirebaseAuthContext() as {
        user: User
        shoppingList: ShoppingList
    }
    const { gridBreakpointProps } = useGridContext()
    const { ProgressComponent, setProgress } = useProgress()
    const { enqueueSnackbar } = useSnackbar()

    const userDoc = useMemo(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

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
            case 'notifications': {
                userDoc.update({ [key]: !user.notifications })
                break
            }
            case 'algoliaAdvancedSyntax': {
                userDoc.update({ [key]: !user.algoliaAdvancedSyntax })
            }
        }
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <AccountUserHeader
                    user={user}
                    userDoc={userDoc}
                    showInfo={showInfo}
                    onShowInfoChange={() => setShowInfo(prev => !prev)}
                />
            </Grid>

            {shoppingList.size > 0 && (
                <Grid item {...gridBreakpointProps}>
                    <AccountUserShoppingList />
                </Grid>
            )}

            <Grid item {...gridBreakpointProps}>
                <AccountUserSettings
                    user={user}
                    showInfo={showInfo}
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

            <NavigateFab onClick={handleLogout} icon={<LogoutVariant />} />
            <ProgressComponent />
        </Grid>
    )
}

export default AccountUser
