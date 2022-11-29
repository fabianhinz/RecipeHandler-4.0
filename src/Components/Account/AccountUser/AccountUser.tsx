import { Grid } from '@material-ui/core'
import { signOut } from 'firebase/auth'
import { updateDoc } from 'firebase/firestore'
import { LogoutVariant } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import { useMemo } from 'react'

import { useBookmarkContext } from '@/Components/Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { SecouredRouteFab } from '@/Components/Routes/SecouredRouteFab'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import { auth } from '@/firebase/firebaseConfig'
import { resolveDoc } from '@/firebase/firebaseQueries'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import useProgress from '@/hooks/useProgress'
import { User } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'

import AccountUserAdmin from '../AccountUser/AccountUserAdmin'
import AccountUserHeader from '../AccountUser/AccountUserHeader'
import AccountUserSettings from '../AccountUser/AccountUserSettings'

type SettingKeys = keyof Pick<
  User,
  | 'muiTheme'
  | 'selectedUsers'
  | 'showRecentlyEdited'
  | 'showMostCooked'
  | 'showNew'
  | 'notifications'
  | 'algoliaAdvancedSyntax'
  | 'bookmarkSync'
>

export type UserSettingChangeHandler = (key: SettingKeys) => (uid?: any) => void

const AccountUser = () => {
  // ? we won't load this component without an existing user - pinky promise -_-
  const { user } = useFirebaseAuthContext() as {
    user: User
  }
  const { gridBreakpointProps } = useGridContext()
  const { bookmarks } = useBookmarkContext()
  const { ProgressComponent, setProgress } = useProgress()
  const { enqueueSnackbar } = useSnackbar()

  useDocumentTitle(user.username)

  const userDoc = useMemo(() => {
    return resolveDoc('users', user.uid)
  }, [user.uid])

  const handleLogout = () => {
    setProgress(true)

    signOut(auth).catch(error =>
      enqueueSnackbar(error.message, { variant: 'error' })
    )
  }

  const handleUserSettingChange: UserSettingChangeHandler =
    (key: SettingKeys) => (uid?: any) => {
      switch (key) {
        case 'muiTheme': {
          updateDoc(userDoc, {
            [key]:
              user.muiTheme === 'dynamic'
                ? 'dark'
                : user.muiTheme === 'dark'
                ? 'light'
                : user.muiTheme === 'light'
                ? 'black'
                : 'dynamic',
          })
          break
        }
        case 'selectedUsers': {
          if (typeof uid !== 'string')
            throw new Error('whoops we need a string for this')

          // ? throw away all "cached" recipes
          getRecipeService().scrollPosition.set(PATHS.home, 0)
          getRecipeService().pagedRecipes = new Map()

          let selectedIds = [...user.selectedUsers]
          const idExists = selectedIds.some(id => id === uid)

          if (idExists && selectedIds.length > 1) {
            selectedIds = selectedIds.filter(id => id !== uid)
          } else if (!idExists && selectedIds.length < 10) {
            selectedIds.push(uid)
          }

          updateDoc(userDoc, { [key]: selectedIds })
          break
        }
        case 'showNew': {
          updateDoc(userDoc, { [key]: !user.showNew })
          break
        }
        case 'showRecentlyEdited': {
          updateDoc(userDoc, { [key]: !user.showRecentlyEdited })
          break
        }
        case 'showMostCooked': {
          updateDoc(userDoc, { [key]: !user.showMostCooked })
          break
        }
        case 'notifications': {
          updateDoc(userDoc, { [key]: !user.notifications })
          break
        }
        case 'algoliaAdvancedSyntax': {
          updateDoc(userDoc, { [key]: !user.algoliaAdvancedSyntax })
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
          updateDoc(userDoc, updates)
          break
        }
      }
    }

  return (
    <>
      <EntryGridContainer>
        <Grid item xs={12}>
          <AccountUserHeader user={user} userDoc={userDoc} />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <AccountUserSettings
              user={user}
              userDoc={userDoc}
              onUserSettingChange={handleUserSettingChange}
            />

            {user.admin && (
              <Grid item {...gridBreakpointProps}>
                <AccountUserAdmin />
              </Grid>
            )}
          </Grid>
        </Grid>
      </EntryGridContainer>

      <SecouredRouteFab
        onClick={handleLogout}
        icon={<LogoutVariant />}
        tooltipTitle="Ausloggen"
      />
      <ProgressComponent />
    </>
  )
}

export default AccountUser
