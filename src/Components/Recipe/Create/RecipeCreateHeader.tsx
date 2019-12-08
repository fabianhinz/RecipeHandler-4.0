import { createStyles, Grid, InputBase, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1),
            width: '100%',
            ...theme.typography.h5,
        },
    })
)

interface Props {
    inputDisabled?: boolean
    name: string
    onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const RecipeCreateHeader = ({ inputDisabled, name, onNameChange }: Props) => {
    const classes = useStyles()

    return (
        <Grid container>
            <Grid item xs={12}>
                <InputBase
                    autoFocus
                    disabled={inputDisabled}
                    className={classes.textFieldName}
                    value={name}
                    placeholder="Name"
                    onChange={onNameChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography component="span" color="textSecondary">
                    Ein Rezept sollte mindestens einen Namen und Kategorie aufweißen. Nach erfolgter
                    Speicherung ist die Änderung des Rezeptnamens nicht mehr möglich
                </Typography>
            </Grid>
        </Grid>
    )
}

export default RecipeCreateHeader
