import React from "react";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { Slide } from "@material-ui/core";

export const SlideUp = React.forwardRef<unknown, TransitionProps>((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));
