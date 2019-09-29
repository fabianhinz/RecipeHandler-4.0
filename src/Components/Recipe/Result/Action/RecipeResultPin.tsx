import React, { FC } from "react";
import AttachFile from "@material-ui/icons/AttachFile";
import { IconButton } from "@material-ui/core/";
import { useDraggableRecipesContext } from "../../../Provider/DraggableRecipesProvider";

interface RecipeResultPinProps {
    name: string;
}

export const RecipeResultPin: FC<RecipeResultPinProps> = ({ name }) => {
    const { handleDraggableChange } = useDraggableRecipesContext();

    return (
        <IconButton onClick={() => handleDraggableChange(name)}>
            <AttachFile />
        </IconButton>
    );
};
