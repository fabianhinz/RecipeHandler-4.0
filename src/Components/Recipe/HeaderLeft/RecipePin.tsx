import React, { FC } from "react";
import { Recipe, AttachementMetadata } from "../../../model/model";
import AttachFile from "@material-ui/icons/AttachFile";
import { IconButton } from "@material-ui/core/";
import { useDraggableRecipesContext } from "../../Provider/DraggableRecipesProvider";

export const RecipePin: FC<Pick<Recipe<AttachementMetadata>, "name">> = ({ name }) => {
    const { handleDraggableChange } = useDraggableRecipesContext();

    return (
        <IconButton onClick={() => handleDraggableChange(name)}>
            <AttachFile />
        </IconButton>
    );
};
