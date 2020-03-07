import { createStyles, InputBase, makeStyles } from '@material-ui/core'
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
        <InputBase
            autoFocus
            disabled={inputDisabled}
            classes={{ root: classes.inputBaseRoot, input: classes.inputBaseInput }}
            value={value}
            placeholder="Name"
            onChange={e => setValue(e.target.value)}
            onBlur={() => onNameChange(value)}
        />
    )
}

export default RecipeCreateHeader
