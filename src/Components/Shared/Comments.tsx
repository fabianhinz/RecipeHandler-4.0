import React, { FC } from "react";
import CommentIcon from "@material-ui/icons/CommentTwoTone";
import { IconButton } from "@material-ui/core";
// ToDo
export const Comments: FC = () => {
    return (
        <IconButton onClick={e => e.stopPropagation()}>
            <CommentIcon />
        </IconButton>
    );
};
