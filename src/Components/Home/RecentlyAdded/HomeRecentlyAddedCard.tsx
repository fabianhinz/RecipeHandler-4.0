import React, { FC } from "react";
import {
    Grid,
    Typography,
    makeStyles,
    createStyles,
    Avatar,
    Paper,
    CardActionArea
} from "@material-ui/core";
import { Recipe, AttachementMetadata } from "../../../model/model";
import { useRouterContext } from "../../Provider/RouterProvider";
import { useAttachementRef } from "../../../hooks/useAttachementRef";
import Skeleton from "@material-ui/lab/Skeleton";
import { PATHS } from "../../Routes/Routes";

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: 80,
            height: 80,
            fontSize: theme.typography.pxToRem(40)
        },
        paper: {
            padding: theme.spacing(2)
        }
    })
);

export const HomeRecentlyAddedCard: FC<{
    recipe: Recipe<AttachementMetadata>;
    skeleton: boolean;
}> = ({ recipe, skeleton }) => {
    const { attachementRef, attachementRefLoading } = useAttachementRef(recipe.attachements[0]);
    const { history } = useRouterContext();
    const classes = useStyles();

    return (
        <Grid xs={12} sm={6} lg={4} item>
            <CardActionArea onClick={() => history.push(PATHS.details(recipe.name), { recipe })}>
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2} alignItems="center">
                        <Grid item>
                            {attachementRefLoading || skeleton ? (
                                <Skeleton variant="circle" width={80} height={80} />
                            ) : (
                                <Avatar className={classes.avatar} src={attachementRef.dataUrl}>
                                    {recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            )}
                        </Grid>
                        <Grid item zeroMinWidth>
                            {skeleton ? (
                                <>
                                    <Skeleton width="4rem" height="1rem" />
                                    <Skeleton width="8rem" height="1rem" />
                                </>
                            ) : (
                                <>
                                    <Typography noWrap variant="subtitle1">
                                        {recipe.name}
                                    </Typography>
                                    <Typography noWrap color="textSecondary">
                                        Erstellt am{" "}
                                        {recipe.createdDate.toDate().toLocaleDateString()}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </CardActionArea>
        </Grid>
    );
};
