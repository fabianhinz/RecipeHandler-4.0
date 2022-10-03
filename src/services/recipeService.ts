import { RecipeCreateState } from '@/Components/Recipe/Create/RecipeCreateReducer'
import { DocumentId, OrderByRecord, Recipe, Trial } from '@/model/model'

class RecipeService {
  private _selectedCategories: Map<string, string>
  get selectedCategories() {
    return this._selectedCategories
  }
  set selectedCategories(newSelectedCategories: Map<string, string>) {
    this._selectedCategories = newSelectedCategories
  }

  private _orderBy: OrderByRecord
  get orderBy() {
    return this._orderBy
  }
  set orderBy(newOrderBy: OrderByRecord) {
    this._orderBy = newOrderBy
  }

  private _pagedRecipes: Map<DocumentId, Recipe>
  get pagedRecipes() {
    return this._pagedRecipes
  }
  set pagedRecipes(newPagedRecipes: Map<DocumentId, Recipe>) {
    this._pagedRecipes = newPagedRecipes
  }

  private _pagedTrials: Map<string, Trial>
  get pagedTrials() {
    return this._pagedTrials
  }
  set pagedTrials(newPagedTrials: Map<string, Trial>) {
    this._pagedTrials = newPagedTrials
  }

  private _scrollPosition: Map<string, number>
  get scrollPosition() {
    return this._scrollPosition
  }
  set scrollPosition(newScrollPosition: Map<string, number>) {
    this._scrollPosition = newScrollPosition
  }

  private _recipeCreateState: RecipeCreateState | null
  get recipeCreateState() {
    return this._recipeCreateState
  }
  set recipeCreateState(newTmpRecipe: RecipeCreateState | null) {
    this._recipeCreateState = newTmpRecipe
  }

  constructor() {
    this._selectedCategories = new Map()
    this._orderBy = { createdDate: 'desc' }
    this._pagedRecipes = new Map()
    this._scrollPosition = new Map()
    this._recipeCreateState = null
    this._pagedTrials = new Map()
  }
}

export default new RecipeService()
