import { createStyles, Grid, InputBase, makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { PATHS } from '../../Routes/Routes'

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
    const match = useRouteMatch()

    return (
        <Grid container spacing={match.path === PATHS.recipeCreate ? 2 : 0}>
            <Grid item xs={12}>
                <InputBase
                    disabled={inputDisabled}
                    classes={{ root: classes.inputBaseRoot, input: classes.inputBaseInput }}
                    value={value}
                    placeholder="Name"
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onNameChange(value)}
                />
            </Grid>
            {match.path === PATHS.recipeCreate && (
                <Grid item xs={12}>
                    <Typography component="span" color="textSecondary">
                        Ein Rezept sollte mindestens einen Namen und Kategorie aufweisen. Nach
                        erfolgter Speicherung ist die Änderung des Rezeptnamens nicht mehr möglich.
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}

export default RecipeCreateHeader
