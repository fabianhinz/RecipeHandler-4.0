import { OrderByRecord } from '../Components/Home/HomeRecipe'

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

    constructor() {
        this._selectedCategories = new Map()
        this._orderBy = { name: 'asc' }
    }
}

export default new ConfigService()
