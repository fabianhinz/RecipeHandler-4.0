import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import MarkdownInput from '../../Markdown/MarkdownInput'
import StyledCard from '../../Shared/RecipeCard'
import { Subtitle } from '../../Shared/Subtitle'

interface Props {
    description: string
    onDescriptionChange: (value: string) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => {
    return (
        <StyledCard
            transitionOrder={2}
            variant="preview"
            header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
            content={<MarkdownInput defaultValue={description} onChange={onDescriptionChange} />}
        />
    )
}

export default RecipeCreateDescription
