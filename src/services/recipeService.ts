import { RecipeCreateState } from '@/Components/Recipe/Create/RecipeCreateReducer'
import { DocumentId, OrderByRecord, Recipe, Trial } from '@/model/model'

class RecipeService {
  selectedCategories: Map<string, string>
  orderBy: OrderByRecord
  pagedRecipes: Map<DocumentId, Recipe>
  pagedTrials: Map<string, Trial>
  scrollPosition: Map<string, number>
  recipeCreateState: RecipeCreateState | null
  selectedEditor: string

  constructor() {
    this.selectedCategories = new Map()
    this.orderBy = { createdDate: 'desc' }
    this.pagedRecipes = new Map()
    this.scrollPosition = new Map()
    this.recipeCreateState = null
    this.pagedTrials = new Map()
    this.selectedEditor = ''
  }
}

let service: RecipeService | null = null

export const getRecipeService = () => {
  if (service) {
    return service
  }

  service = new RecipeService()
  return service
}
