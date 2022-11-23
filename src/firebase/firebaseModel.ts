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
export type TrialsSubCollection = 'comments' | `comments/${DocumentId}/reactions`
export type TrialsSubCollectionResolver =
  `${TrialsRootCollection}/${DocumentId}}/${TrialsSubCollection}`

type UsersRootCollection = 'users'
type UsersSubCollection = 'cookingHistory' | 'expenses' | 'shoppingList'
type UsersSubCollectionResolver = `${UsersRootCollection}/${DocumentId}/${UsersSubCollection}`

type RecipesRootCollection = 'recipes'
type RecipesSubCollection =
  | 'attachments'
  | `comments`
  | `comments/${DocumentId}/reactions`
  | 'satisfaction'
type RecipesSubCollectionResolver = `${RecipesRootCollection}/${DocumentId}/${RecipesSubCollection}`

export type RootCollections =
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

export type SubCollectionResolvers =
  | TrialsSubCollectionResolver
  | UsersSubCollectionResolver
  | RecipesSubCollectionResolver

export type FirestorePath = RootCollections | SubCollectionResolvers
