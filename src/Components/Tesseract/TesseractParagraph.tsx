import { Chip, createStyles, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import React from 'react'
import { Paragraph } from 'tesseract.js'

import { TesseractPart, TesseractText } from '../../model/model'
import { BORDER_RADIUS } from '../../theme'

type StyleProps = Pick<Props, 'confidence'>

const useStyles = makeStyles(theme =>
    createStyles({
        confidenceContainer: {
            height: 12,
            backgroundColor: '#81c78480',
            borderRadius: BORDER_RADIUS,
            width: '100%',
        },
        confidence: {
            width: ({ confidence }: StyleProps) => `${confidence}%`,
            height: '100%',
            borderTopLeftRadius: BORDER_RADIUS,
            borderBottomLeftRadius: BORDER_RADIUS,
            backgroundColor: '#81c784',
        },
    })
)

interface Props extends Pick<Paragraph, 'text' | 'confidence'> {
    onChipClick: (text: TesseractText, parts: TesseractPart) => () => void
    results: Map<string, TesseractPart>
}

const TesseractParagraph = ({ text, confidence, onChipClick, results }: Props) => {
    const classes = useStyles({ confidence })

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item style={{ marginTop: 16 }}>
                <Divider />
            </Grid>
            <Grid item>
                <Grid container spacing={1}>
                    <Grid item>
                        <Chip
                            icon={<AssignmentIcon />}
                            color={results.get(text) === 'description' ? 'secondary' : 'default'}
                            onClick={onChipClick(text, 'description')}
                            label="Beschreibung"
                        />
                    </Grid>
                    <Grid item>
                        <Chip
                            icon={<BookIcon />}
                            color={results.get(text) === 'ingredients' ? 'secondary' : 'default'}
                            onClick={onChipClick(text, 'ingredients')}
                            label="Zutaten"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <div className={classes.confidenceContainer}>
                    <div className={classes.confidence} />
                </div>
            </Grid>
            <Grid item>
                <Typography>{text}</Typography>
            </Grid>
        </Grid>
    )
}

export default TesseractParagraph
