import { Grid } from '@material-ui/core'
import React, { useMemo, useState } from 'react'

import useCardBreakpoints from '../../../hooks/useCardBreakpoints'
import { User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import AccountUserAdmin from './AccountUserAdmin'
import AccountUserHeader from './AccountUserHeader'
import AccountUserRecipes from './AccountUserRecipes'
import AccountUserSettings from './AccountUserSettings'

type SettingKeys = keyof Pick<
    User,
    'muiTheme' | 'selectedUsers' | 'showRecentlyAdded' | 'notifications' | 'algoliaAdvancedSyntax'
>

export type UserSettingChangeHandler = (key: SettingKeys) => (uid?: any) => void

const AccountUser = () => {
    const [showInfo, setShowInfo] = useState(false)

    // ? we won't load this component without an existing user - pinky promise -_-
    const { user } = useFirebaseAuthContext() as { user: User }
    const { breakpoints } = useCardBreakpoints({ xlEnabled: user.admin })

    const userDoc = useMemo(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

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

            <Grid item {...breakpoints}>
                <AccountUserSettings
                    user={user}
                    showInfo={showInfo}
                    onUserSettingChange={handleUserSettingChange}
                />
            </Grid>

            <Grid item {...breakpoints}>
                <AccountUserRecipes onUserSettingChange={handleUserSettingChange} />
            </Grid>

            {user.admin && (
                <Grid item {...breakpoints}>
                    <AccountUserAdmin />
                </Grid>
            )}
        </Grid>
    )
}

export default AccountUser
