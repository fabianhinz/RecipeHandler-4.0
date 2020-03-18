import { createStyles, makeStyles } from '@material-ui/core'
import SpeedDialIcon from '@material-ui/icons/ClassRounded'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import SaveIcon from '@material-ui/icons/Save'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import React, { useState } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        speedDial: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            width: 95,
            display: 'flex',
            padding: theme.spacing(2),
            justifyContent: 'center',
            alignItems: 'center',
            left: 0,
            bottom: `env(safe-area-inset-bottom)`,
        },
    })
)

interface Props {
    onPreview: () => void
    onSave: () => void
}

const RecipeCreateSpeedDial = ({ onPreview, onSave }: Props) => {
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const classes = useStyles()

    return (
        <SpeedDial
            className={classes.speedDial}
            FabProps={{ color: 'secondary' }}
            ariaLabel="recipe create speed dial"
            open={speedDialOpen}
            onOpen={() => setSpeedDialOpen(true)}
            onClose={() => setSpeedDialOpen(false)}
            icon={<SpeedDialIcon />}
            openIcon={<SpeedDialIcon />}>
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
        </SpeedDial>
    )
}

export default RecipeCreateSpeedDial
