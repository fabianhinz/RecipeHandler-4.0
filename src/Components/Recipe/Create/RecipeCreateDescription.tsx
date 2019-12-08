import { TextField } from '@material-ui/core'
import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'

interface Props {
    description: string
    onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => (
    <RecipeCard
        variant="preview"
        header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
        content={
            <TextField
                label="optional"
                value={description}
                rows={15}
                onChange={onDescriptionChange}
                fullWidth
                multiline
                variant="outlined"
                margin="dense"
            />
        }
    />
)

export default RecipeCreateDescription
