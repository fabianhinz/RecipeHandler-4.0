import { createStyles, Grid, InputBase, makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'

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
    onNameChange: (value: string) => void
}

const RecipeCreateHeader = ({ inputDisabled, name, onNameChange }: Props) => {
    const [value, setValue] = useState(name)
    const classes = useStyles()

    return (
        <Grid container>
            <Grid item xs={12}>
                <InputBase
                    autoFocus={name.length === 0}
                    disabled={inputDisabled}
                    className={classes.textFieldName}
                    value={value}
                    placeholder="Name"
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onNameChange(value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography component="span" color="textSecondary">
                    Ein Rezept sollte mindestens einen Namen und Kategorie aufweisen. Nach erfolgter
                    Speicherung ist die Änderung des Rezeptnamens nicht mehr möglich.
                </Typography>
            </Grid>
        </Grid>
    )
}

export default RecipeCreateHeader
