import React, { FC, useContext, useEffect, useState } from 'react'

import { Categories } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

type CategoriesCollection = {
    categoriesCollection: Categories<Array<string>>
    categoriesLoading: boolean
}

const Context = React.createContext<CategoriesCollection | null>(null)

export const useCategoriesCollectionContext = () => useContext(Context) as CategoriesCollection

const CategoriesCollectionProvider: FC = ({ children }) => {
    const [categories, setCategories] = useState<Categories<Array<string>>>({})
    const [categoriesLoading, setCategoriesLoading] = useState(true)

    useEffect(() => {
        FirebaseService.firestore
            .collection('categories')
            .doc('static')
            .get()
            .then(documentSnapshot => {
                setCategoriesLoading(false)
                setCategories(documentSnapshot.data() as Categories<Array<string>>)
            })
    }, [])

    return (
        <Context.Provider value={{ categoriesCollection: categories, categoriesLoading }}>
            {children}
        </Context.Provider>
    )
}

export default CategoriesCollectionProvider
