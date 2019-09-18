import React, { FC, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { Category } from "./Category";
import { CategoryAs, CategoryVariants } from "../../model/model";

interface CategoryWrapperProps {
    edit?: boolean;
    fromRecipe?: CategoryAs<Array<string>>;
    onChange?: (categories: CategoryAs<Array<string>>) => void;
}

export const CategoryWrapper: FC<CategoryWrapperProps> = ({ onChange, edit, fromRecipe }) => {
    const [categories, setCategories] = useState<CategoryAs<Set<string>>>({
        type: new Set<string>(),
        time: new Set<string>()
    });

    useEffect(() => {
        if (!fromRecipe) return;
        setCategories({
            time: new Set(fromRecipe.time),
            type: new Set(fromRecipe.type)
        });
    }, [fromRecipe]);

    const handleClick = (category: string, variant: CategoryVariants) => {
        if (categories[variant].has(category)) categories[variant].delete(category);
        else categories[variant].add(category);

        if (onChange)
            onChange({
                type: Array.from(categories.type),
                time: Array.from(categories.time)
            });
        setCategories({ ...categories });
    };

    return (
        <>
            <Box marginBottom={1}>
                <Category
                    edit={edit}
                    variant="type"
                    items={["ToDo"]}
                    onClick={handleClick}
                    selected={categories.type}
                />
            </Box>
            <Box marginBottom={1}>
                <Category
                    edit={edit}
                    variant="time"
                    items={["ToDo"]}
                    onClick={handleClick}
                    selected={categories.time}
                />
            </Box>
        </>
    );
};
