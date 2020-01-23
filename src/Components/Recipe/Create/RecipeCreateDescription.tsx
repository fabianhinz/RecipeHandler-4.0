import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import MarkdownInput from '../../Shared/MarkdownInput'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'

interface Props {
    description: string
    onDescriptionChange: (value: string) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => {
    return (
        <RecipeCard
            transitionOrder={2}
            variant="preview"
            header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
            content={<MarkdownInput defaultValue={description} onChange={onDescriptionChange} />}
        />
    )
}

export default RecipeCreateDescription
