import { createStyles, Grid, InputBase, makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        inputBaseRoot: {
            width: '100%',
            ...theme.typography.h5,
        },
        inputBaseInput: {
            fontFamily: 'Ubuntu',
            padding: 0,
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <InputBase
                    autoFocus
                    disabled={inputDisabled}
                    classes={{ root: classes.inputBaseRoot, input: classes.inputBaseInput }}
                    value={value}
                    placeholder="Name"
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onNameChange(value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography component="span" color="textSecondary">
                    Ein Rezept sollte mindestens einen Namen und Kategorie aufweisen. Nach erfolgter
                    Speicherung ist die Änderung des Rezeptnamens nicht mehr möglich. Erfolgt eine
                    Verknüpfung zu einer Idee, so wird diese nach dem Speichern des Rezepts
                    gelöscht.
                </Typography>
            </Grid>
        </Grid>
    )
}

export default RecipeCreateHeader
