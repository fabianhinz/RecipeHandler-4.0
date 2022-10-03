import { VisibilityOff } from '@material-ui/icons'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import SaveIcon from '@material-ui/icons/Save'
import { SpeedDialAction } from '@material-ui/lab'

import SpeedDialWrapper from '@/Components/Shared/SpeedDialWrapper'
interface Props {
  isPreview: boolean
  onPreviewClick: () => void
  onSaveClick: () => void
}

const RecipeCreateSpeedDial = ({ onPreviewClick, onSaveClick, isPreview }: Props) => {
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
