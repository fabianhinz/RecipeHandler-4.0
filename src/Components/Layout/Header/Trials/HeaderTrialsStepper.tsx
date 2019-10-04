import { createStyles, IconButton, makeStyles, MobileStepper } from '@material-ui/core'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        dialogPaper: {
            position: 'relative',
            overflow: 'unset',
        },
        fabContainer: {
            position: 'absolute',
            top: -25,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
        },
        mobileStepper: {
            flexGrow: 1,
            background: 'unset',
        },
    })
)

interface HeaderTrialsStepperProps {
    steps: number
    activeStep: number
    onNext: () => void
    onPrevious: () => void
}

export const HeaderTrialsStepper: FC<HeaderTrialsStepperProps> = ({
    steps,
    activeStep,
    onNext,
    onPrevious,
}) => {
    const classes = useStyles()

    return (
        <MobileStepper
            className={classes.mobileStepper}
            steps={steps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={
                <IconButton onClick={onNext} disabled={activeStep === steps - 1}>
                    <KeyboardArrowRight />
                </IconButton>
            }
            backButton={
                <IconButton onClick={onPrevious} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                </IconButton>
            }
        />
    )
}
