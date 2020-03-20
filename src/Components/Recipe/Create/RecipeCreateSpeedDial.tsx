import EyeIcon from '@material-ui/icons/RemoveRedEye'
import SaveIcon from '@material-ui/icons/Save'
import { SpeedDialAction } from '@material-ui/lab'
import React from 'react'

import SpeedDialWrapper from '../../Shared/SpeedDialWrapper'
interface Props {
    onPreview: () => void
    onSave: () => void
}

const RecipeCreateSpeedDial = ({ onPreview, onSave }: Props) => {
    return (
        <SpeedDialWrapper>
            <SpeedDialAction
                icon={<EyeIcon />}
                onClick={onPreview}
                tooltipTitle="Rezeptvorschau"
                FabProps={{ size: 'medium' }}
            />
            <SpeedDialAction
                icon={<SaveIcon />}
                onClick={onSave}
                tooltipTitle="Rezept speichern"
                FabProps={{ size: 'medium' }}
            />
        </SpeedDialWrapper>
    )
}

export default RecipeCreateSpeedDial
