import { useState, useEffect } from "react";
import { FirebaseService } from "../firebase";
import { Categories } from "../model/model";
import { useSnackbar } from "notistack";

export const useCategoriesCollection = () => {
    const [categoriesCollection, setCategoriesCollection] = useState<Categories<
        Array<string>
    > | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        return FirebaseService.firestore
            .collection("categories")
            .onSnapshot(
                querySnapshot =>
                    setCategoriesCollection(querySnapshot.docs[0].data() as Categories<
                        Array<string>
                    >),
                error => enqueueSnackbar(error.message, { variant: "error" })
            );
    }, [enqueueSnackbar]);

    return { categoriesCollection };
};
