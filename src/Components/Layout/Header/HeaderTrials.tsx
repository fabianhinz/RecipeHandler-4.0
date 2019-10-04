import {
    Backdrop,
    Box,
    Card,
    CardHeader,
    CardMedia,
    Container,
    createStyles,
    Fab,
    IconButton,
    makeStyles,
    MobileStepper,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import StarsIcon from '@material-ui/icons/StarsTwoTone'
import compressImage from 'browser-image-compression'
import React, { FC, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import SwipeableViews from 'react-swipeable-views'

import { BORDER_RADIUS } from '../../../theme'
import { readDocumentAsync } from '../../Recipe/Create/Attachements/RecipeCreateAttachements'
import { HeaderState } from './HeaderReducer'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        mobileStepper: {
            borderRadius: BORDER_RADIUS,
        },
        cardMedia: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
    })
)

interface Trial {
    fullPath: string
    title: string
    createdDate: Date
}

export const HeaderTrials: FC<HeaderState<'trialsOpen'>> = ({ trialsOpen }) => {
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [activeTrial, setActiveTrial] = useState(0)
    const classes = useStyles()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newTrials: Map<string, Trial> = new Map()

        for (const file of acceptedFiles) {
            const compressedFile: Blob = await compressImage(file, {
                maxSizeMB: 0.5,
                useWebWorker: false,
                maxWidthOrHeight: 3840,
                maxIteration: 5,
            })
            const dataUrl: string = await readDocumentAsync(compressedFile)

            newTrials.set(file.name, {
                title: file.name,
                fullPath: dataUrl,
                createdDate: new Date(),
            })
        }
        setTrials(previous => new Map([...previous, ...newTrials]))
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        noDragEventsBubbling: true,
        noDrag: true,
    })

    return (
        <Backdrop open={trialsOpen} className={classes.backdrop}>
            <Container maxWidth="sm">
                <SwipeableViews
                    index={activeTrial}
                    onChangeIndex={index => setActiveTrial(index)}
                    enableMouseEvents>
                    {[...trials.values()].map(trial => (
                        <Card key={trial.title}>
                            <CardHeader
                                title={trial.title}
                                subheader={trial.createdDate.toLocaleTimeString()}
                                action={
                                    <>
                                        <IconButton>
                                            <StarsIcon />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            />
                            <CardMedia className={classes.cardMedia} image={trial.fullPath} />
                        </Card>
                    ))}
                </SwipeableViews>
                <MobileStepper
                    className={classes.mobileStepper}
                    steps={trials.size}
                    position="static"
                    variant="dots"
                    activeStep={activeTrial}
                    nextButton={
                        <IconButton
                            onClick={() => setActiveTrial(prev => ++prev)}
                            disabled={activeTrial === trials.size - 1}>
                            <KeyboardArrowRight />
                        </IconButton>
                    }
                    backButton={
                        <IconButton
                            onClick={() => setActiveTrial(prev => --prev)}
                            disabled={activeTrial === 0}>
                            <KeyboardArrowLeft />
                        </IconButton>
                    }
                />
                <Box flexGrow={1} display="flex" justifyContent="center" marginTop={2}>
                    <div {...getRootProps}>
                        <Fab size="small" color="secondary">
                            <div {...getInputProps} />

                            <AddIcon />
                        </Fab>
                    </div>
                </Box>
            </Container>
        </Backdrop>
    )
}
