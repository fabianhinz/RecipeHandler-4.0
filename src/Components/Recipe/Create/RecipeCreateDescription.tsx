import { TextField } from '@material-ui/core'
import BookIcon from '@material-ui/icons/BookTwoTone'
import React, { useState } from 'react'

import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'

interface Props {
    description: string
    onDescriptionChange: (value: string) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => {
    const [value, setValue] = useState(description)

    return (
        <RecipeCard
            variant="preview"
            header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
            content={
                <TextField
                    label="optional"
                    value={value}
                    rows={15}
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onDescriptionChange(value)}
                    fullWidth
                    multiline
                    variant="outlined"
                    margin="dense"
                />
            }
        />
    )
}

export default RecipeCreateDescription
