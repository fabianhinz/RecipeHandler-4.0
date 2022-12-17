import { makeStyles } from '@material-ui/core'
import { logEvent, setUserId } from 'firebase/analytics'
import {
  onAuthStateChanged,
  signInWithCustomToken,
  User as FirebaseUser,
} from 'firebase/auth'
import {
  DocumentData,
  DocumentReference,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import BuiltWithFirebase from '@/Components/Shared/BuiltWithFirebase'
import { analytics, auth, functions } from '@/firebase/firebaseConfig'
import {
  resolveDoc,
  resolveExpensesOrderedByDateDesc,
} from '@/firebase/firebaseQueries'
import { ShoppingListItem, User } from '@/model/model'
import useExpenseStore from '@/store/ExpenseStore'
import { ArrayFns, ReorderParams } from '@/util/fns'

interface AuthContext {
  user: User | undefined
  shoppingList: ShoppingListItem[]
  loginEnabled: boolean
  unsafeShoppingListRef: { current?: DocumentReference<DocumentData> }
  reorderShoppingList: (
    reorderParams: ReorderParams<ShoppingListItem>
  ) => Promise<void>
}

const Context = createContext<AuthContext>({
  user: undefined,
  shoppingList: [],
  loginEnabled: false,
  unsafeShoppingListRef: { current: undefined },
  reorderShoppingList: async (reorderParams: ReorderParams<ShoppingListItem>) =>
    undefined,
})

export const useFirebaseAuthContext = () => useContext(Context)

const useStyles = makeStyles(() => ({
  '@keyframes chip-appear': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  chip: {
    animation: `$chip-appear 0.225s ease-out`,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  main: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
}))

const FirebaseAuthProvider: FC = ({ children }) => {
  const [authReady, setAuthReady] = useState(false)
  const [loginEnabled, setLoginEnabled] = useState(false)
  const [user, setUser] = useState<User | undefined>()
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])

  const unsafeShoppingListRef =
    useRef<AuthContext['unsafeShoppingListRef']['current']>()

  const classes = useStyles()

  const handleAuthStateChange = useCallback((user: FirebaseUser | null) => {
    setAuthReady(true)

    if (!user) {
      setUser(undefined)
      setLoginEnabled(true)
      return
    }

    if (analytics) {
      setUserId(analytics, user.uid)
      logEvent(analytics, 'login')
    }

    const userDocUnsubsribe = onSnapshot(
      resolveDoc('users', user.uid),
      doc => {
        setUser({
          ...(doc.data() as Omit<User, 'uid'>),
          uid: user.uid,
        })

        setLoginEnabled(true)
      },
      () => {
        // not an editor, this user was just created and has no permissions yet
        setUser({
          uid: user.uid,
          username: user.email ?? 'unknown username',
          admin: false,
          muiTheme: 'dynamic',
          selectedUsers: [],
          showRecentlyEdited: true,
          showMostCooked: true,
          showNew: true,
          notifications: false,
          createdDate: Timestamp.fromDate(
            new Date(user.metadata.creationTime ?? Date.now())
          ),
          algoliaAdvancedSyntax: false,
          bookmarkSync: true,
          emailVerified: false,
          bookmarks: [],
        })
      }
    )

    unsafeShoppingListRef.current = resolveDoc(
      `users/${user.uid}/shoppingList`,
      'static'
    )

    const shoppingListUnsubscribe = onSnapshot(
      unsafeShoppingListRef.current,
      snapshot => {
        setShoppingList(snapshot.data()?.list ?? [])
      }
    )

    const expensesUnsubscribe = onSnapshot(
      resolveExpensesOrderedByDateDesc(user.uid),
      useExpenseStore.getState().handleFirebaseSnapshot
    )

    return () => {
      expensesUnsubscribe()
      userDocUnsubsribe()
      shoppingListUnsubscribe()
    }
  }, [])

  const handleSignInWithCustomToken = useCallback(async () => {
    if (!user) {
      return
    }
    const getCustomToken = httpsCallable<User['uid'], string>(
      functions,
      'getCustomToken'
    )
    try {
      const customTokenResponse = await getCustomToken(user.uid)
      await signInWithCustomToken(auth, customTokenResponse.data)
    } catch (e) {
      // only editors may recive a custom token, catch and move on for other users
    }
  }, [user])

  useEffect(() => {
    if (!user || user.emailVerified) {
      return
    }

    const update: Partial<User> = { emailVerified: user.emailVerified }
    void updateDoc(resolveDoc('users', user.uid), update)
  }, [user])

  useEffect(() => {
    void handleSignInWithCustomToken()
  }, [handleSignInWithCustomToken])

  useEffect(() => {
    return onAuthStateChanged(auth, handleAuthStateChange)
  }, [handleAuthStateChange])

  const reorderShoppingList = async (
    reorderParams: ReorderParams<ShoppingListItem>
  ) => {
    const reorderedList = ArrayFns.reorder(reorderParams)
    setShoppingList(reorderedList)

    if (!unsafeShoppingListRef.current) {
      throw new Error(
        'cannot update shopping list without a document reference'
      )
    }

    await setDoc(unsafeShoppingListRef.current, { list: reorderedList })
  }

  return (
    <Context.Provider
      value={{
        user,
        loginEnabled,
        shoppingList,
        unsafeShoppingListRef,
        reorderShoppingList,
      }}>
      {authReady ? (
        <div className={classes.main}>{children}</div>
      ) : (
        <div className={classes.chip}>
          <BuiltWithFirebase loading />
        </div>
      )}
    </Context.Provider>
  )
}

export default FirebaseAuthProvider
