import { VisibilityOff } from '@mui/icons-material'
import EyeIcon from '@mui/icons-material/RemoveRedEye'
import SaveIcon from '@mui/icons-material/Save'
import { SpeedDialAction } from '@mui/material'

import SpeedDialWrapper from '@/Components/Shared/SpeedDialWrapper'
interface Props {
  isPreview: boolean
  onPreviewClick: () => void
  onSaveClick: () => void
}

const RecipeCreateSpeedDial = ({
  onPreviewClick,
  onSaveClick,
  isPreview,
}: Props) => {
  return (
    <SpeedDialWrapper>
      <SpeedDialAction
        icon={isPreview ? <VisibilityOff /> : <EyeIcon />}
        onClick={onPreviewClick}
        tooltipTitle={isPreview ? 'zum Rezept' : 'zur Vorschau'}
        FabProps={{ size: 'medium' }}
      />
      <SpeedDialAction
        icon={<SaveIcon />}
        onClick={onSaveClick}
        tooltipTitle="Rezept speichern"
        FabProps={{ size: 'medium' }}
      />
    </SpeedDialWrapper>
  )
}

export default RecipeCreateSpeedDial
