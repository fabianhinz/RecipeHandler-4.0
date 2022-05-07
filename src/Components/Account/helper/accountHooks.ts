import { User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import recipeService from '../../../services/recipeService'
import { useBookmarkContext } from '../../Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { PATHS } from '../../Routes/Routes'
import { AccountSettingChangeHandler, AccountSettingKeys } from './accountTypes'

const useAuthenticatedUser = () => {
  const authContext = useFirebaseAuthContext()

  if (!authContext.user) {
    throw new Error('unauthorized')
  }

  return authContext.user
}

const useUserSettingChange = () => {
  const authenticatedUser = useAuthenticatedUser()
  const bookmarkContext = useBookmarkContext()

  const handleUserSettingChange: AccountSettingChangeHandler =
    (key: AccountSettingKeys) => (uid?: any) => {
      const userDoc = FirebaseService.firestore.collection('users').doc(authenticatedUser.uid)

      switch (key) {
        case 'muiTheme': {
          userDoc.update({
            [key]:
              authenticatedUser.muiTheme === 'dynamic'
                ? 'dark'
                : authenticatedUser.muiTheme === 'dark'
                ? 'light'
                : authenticatedUser.muiTheme === 'light'
                ? 'black'
                : 'dynamic',
          })
          break
        }
        case 'selectedUsers': {
          if (typeof uid !== 'string') throw new Error('whoops we need a string for this')

          // ? throw away all "cached" recipes
          recipeService.scrollPosition.set(PATHS.home, 0)
          recipeService.pagedRecipes = new Map()

          let selectedIds = [...authenticatedUser.selectedUsers]
          const idExists = selectedIds.some(id => id === uid)

          if (idExists && selectedIds.length > 1) {
            selectedIds = selectedIds.filter(id => id !== uid)
          } else if (!idExists && selectedIds.length < 10) {
            selectedIds.push(uid)
          }

          userDoc.update({ [key]: selectedIds })
          break
        }
        case 'showNew': {
          userDoc.update({ [key]: !authenticatedUser.showNew })
          break
        }
        case 'showRecentlyEdited': {
          userDoc.update({ [key]: !authenticatedUser.showRecentlyEdited })
          break
        }
        case 'showMostCooked': {
          userDoc.update({ [key]: !authenticatedUser.showMostCooked })
          break
        }
        case 'notifications': {
          userDoc.update({ [key]: !authenticatedUser.notifications })
          break
        }
        case 'algoliaAdvancedSyntax': {
          userDoc.update({ [key]: !authenticatedUser.algoliaAdvancedSyntax })
          break
        }
        case 'bookmarkSync': {
          const newSyncSetting = !authenticatedUser.bookmarkSync
          const updates: Partial<Pick<User, 'bookmarks' | 'bookmarkSync'>> = {
            bookmarkSync: newSyncSetting,
          }
          // ? user has already selected bookmarks and decides to sync them
          if (newSyncSetting && bookmarkContext.bookmarks.size > 0) {
            updates.bookmarks = [...bookmarkContext.bookmarks.values()]
          }
          userDoc.update(updates)
          break
        }
      }
    }

  return handleUserSettingChange
}

const useUserDoc = () => {
  const authContext = useFirebaseAuthContext()

  return FirebaseService.firestore.collection('users').doc(authContext.user?.uid)
}

export const accountHooks = {
  useUserSettingChange,
  useAuthenticatedUser,
  useUserDoc,
}
