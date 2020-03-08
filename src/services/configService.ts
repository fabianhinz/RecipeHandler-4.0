import { DocumentId, OrderByRecord, Recipe } from '../model/model'

class ConfigService {
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

    private _scrollPosition: number
    get scrollPosition() {
        return this._scrollPosition
    }
    set scrollPosition(newScrollPosition: number) {
        this._scrollPosition = newScrollPosition
    }

    constructor() {
        this._selectedCategories = new Map()
        this._orderBy = { name: 'asc' }
        this._pagedRecipes = new Map()
        this._scrollPosition = window.scrollX
    }
}

export default new ConfigService()
