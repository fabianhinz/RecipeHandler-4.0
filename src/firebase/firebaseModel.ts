type DocumentId = string

type AdminsRootCollection = 'admins'

type PullRequestsRootCollection = 'pullrequests'

type IssuesRootCollection = 'issues'

type CategoriesRootCollection = 'categories'

type CookCounterRootCollection = 'cookCounter'

type EditorsRootCollection = 'editors'

type ErrorsRootCollection = 'errors'

type RatingRootCollection = 'rating'

type RecipesCounterRootCollection = 'recipesCounter'

export type TrialsRootCollection = 'trials'
type TrialsSubCollection = 'comments' | `comments/${DocumentId}/reactions`
type TrialsSubCollectionResolver = `${TrialsRootCollection}/${DocumentId}/${TrialsSubCollection}`

type UsersRootCollection = 'users'
type UsersSubCollection = 'cookingHistory' | 'expenses' | 'archivedExpenses' | 'shoppingList'
type UsersSubCollectionResolver = `${UsersRootCollection}/${DocumentId}/${UsersSubCollection}`

export type RecipesRootCollection = 'recipes'
type RecipesSubCollection =
  | 'attachments'
  | `comments`
  | `comments/${DocumentId}/reactions`
  | 'satisfaction'
type RecipesSubCollectionResolver = `${RecipesRootCollection}/${DocumentId}/${RecipesSubCollection}`

export type RootCollection =
  | AdminsRootCollection
  | PullRequestsRootCollection
  | IssuesRootCollection
  | CategoriesRootCollection
  | CookCounterRootCollection
  | EditorsRootCollection
  | ErrorsRootCollection
  | RatingRootCollection
  | RecipesCounterRootCollection
  | TrialsRootCollection
  | UsersRootCollection
  | RecipesRootCollection

export type SubCollectionResolver =
  | TrialsSubCollectionResolver
  | UsersSubCollectionResolver
  | RecipesSubCollectionResolver

export type SupportedCollectionPath = RootCollection | SubCollectionResolver
