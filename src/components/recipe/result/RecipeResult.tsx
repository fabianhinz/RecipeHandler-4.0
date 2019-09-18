import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { RecipeResultImg } from "./RecipeResultImg";
import { Grid, Typography } from "@material-ui/core";
import { Recipe, AttachementData, AttachementMetadata } from "../../../model/model";
import { Subtitle } from "../../Shared/Subtitle";
import { Category } from "../../Category/Category";

type RecipeResultProps = Recipe<AttachementData | AttachementMetadata>;

export const RecipeResult: FC<RecipeResultProps> = props => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="h6">{props.name}</Typography>
        </Grid>

        <Grid item>
            <Category readonly variant="type" items={props.categories.type} />
        </Grid>
        <Grid item>
            <Category readonly variant="time" items={props.categories.time} />
        </Grid>

        <Grid item xs={12}>
            <Grid container spacing={2}>
                {props.attachements.map(attachement => (
                    <RecipeResultImg key={attachement.name} attachement={attachement} />
                ))}
            </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
            <ReactMarkdown source={props.ingredients} />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
            <Subtitle icon={<BookIcon />} text="Beschreibung" />
            <ReactMarkdown source={props.description} />
        </Grid>

        <Grid item xs={12}>
            {/* ToDo: Time */}
            {/* <Typography variant="caption">Erstellt am: {created}</Typography> */}
        </Grid>
    </Grid>
);
