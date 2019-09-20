import { useState, useEffect } from "react";
import { FirebaseService } from "../firebase";
import { Categories } from "../model/model";
import { useSnackbar } from "notistack";

export const useCategoriesCollection = () => {
    const [categories, setCategories] = useState<Categories<Array<string>> | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        return FirebaseService.firestore
            .collection("categories")
            .onSnapshot(
                querySnapshot =>
                    setCategories(querySnapshot.docs[0].data() as Categories<Array<string>>),
                error => enqueueSnackbar(error.message, { variant: "error" })
            );
    }, [enqueueSnackbar]);

    return { categories };
};
