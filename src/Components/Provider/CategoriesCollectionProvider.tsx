import React, { FC, useContext, useEffect, useState } from 'react'

import { FirebaseService } from '../../firebase'
import { Categories } from '../../model/model'

type CategoriesCollection = { categoriesCollection: Categories<Array<string>> }

const Context = React.createContext<CategoriesCollection | null>(null)

export const useCategoriesCollectionContext = () => useContext(Context) as CategoriesCollection

export const CategoriesCollectionProvider: FC = ({ children }) => {
    const [categories, setCategories] = useState<Categories<Array<string>>>({})

    useEffect(() => {
        FirebaseService.firestore
            .collection('categories')
            .doc('static')
            .get()
            .then(documentSnapshot =>
                setCategories(documentSnapshot.data() as Categories<Array<string>>)
            )
    }, [])

    return (
        <Context.Provider value={{ categoriesCollection: categories }}>{children}</Context.Provider>
    )
}
