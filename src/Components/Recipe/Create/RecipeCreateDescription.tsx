import BookIcon from '@material-ui/icons/Book'
import React from 'react'

import MarkdownInput from '../../Markdown/MarkdownInput'
import StyledCard from '../../Shared/StyledCard'

interface Props {
  description: string
  onDescriptionChange: (value: string) => void
}

const RecipeCreateDescription = ({ description, onDescriptionChange }: Props) => {
  return (
    <StyledCard header="Beschreibung" BackgroundIcon={BookIcon}>
      <MarkdownInput outerValue={description} onChange={onDescriptionChange} />
    </StyledCard>
  )
}

export default RecipeCreateDescription
