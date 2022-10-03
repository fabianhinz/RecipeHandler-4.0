import BookIcon from '@material-ui/icons/Book'

import MarkdownInput from '@/Components/Markdown/MarkdownInput'
import StyledCard from '@/Components/Shared/StyledCard'

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
