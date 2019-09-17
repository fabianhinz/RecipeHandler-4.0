import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { BORDER_RADIUS } from "../../../Theme";
import { CategoryChipsReadonly } from "../../category/CategoryChips";
import {
    createStyles,
    Grid,
    makeStyles,
    Typography
    } from "@material-ui/core";
import { Recipe } from "../../../util/Mock";
import { Subtitle } from "../../../util/Subtitle";

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            borderRadius: BORDER_RADIUS
        }
    })
);

type RecipeResultProps = Recipe;

export const RecipeResult: FC<RecipeResultProps> = ({
    name,
    created,
    categories,
    attachements,
    ingredients,
    description
}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">{name}</Typography>
            </Grid>

            <Grid item>
                <CategoryChipsReadonly variant="type" items={categories.type} />
            </Grid>
            <Grid item>
                <CategoryChipsReadonly variant="time" items={categories.time} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {attachements.map(attachement => (
                        <Grid xs={12} md={6} lg={4} item key={attachement.name}>
                            <img
                                className={classes.img}
                                src={attachement.dataUrl}
                                alt=""
                                width="100%"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
                <ReactMarkdown source={ingredients} />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
                <Subtitle icon={<BookIcon />} text="Beschreibung" />
                <ReactMarkdown source={description} />
            </Grid>

            <Grid item xs={12}>
                {/* <Typography variant="caption">Erstellt am: {created}</Typography> */}
            </Grid>
        </Grid>
    );
};
