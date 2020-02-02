import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import MarkdownInput from '../../Markdown/MarkdownInput'
import StyledCard from '../../Shared/StyledCard'
import { Subtitle } from '../../Shared/Subtitle'

interface Props {
    description: string
    onDescriptionChange: (value: string) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => {
    return (
        <StyledCard header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}>
            <MarkdownInput defaultValue={description} onChange={onDescriptionChange} />
        </StyledCard>
    )
}

export default RecipeCreateDescription
