import AssignmentIcon from '@mui/icons-material/Assignment'
import BookIcon from '@mui/icons-material/Book'
import { Chip, Divider, Grid, Theme, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import makeStyles from '@mui/styles/makeStyles'
import { Paragraph } from 'tesseract.js'

import { TesseractResult } from '@/model/model'

type StyleProps = Pick<Props, 'confidence'>

const useStyles = makeStyles<Theme>(theme => ({
  confidenceContainer: {
    height: 12,
    backgroundColor: ({ confidence }: StyleProps) =>
      confidence > 80 ? '#81c78480' : red[500] + '80',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
  },
  confidence: {
    width: ({ confidence }: StyleProps) => `${confidence}%`,
    height: '100%',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    backgroundColor: ({ confidence }: StyleProps) =>
      confidence > 80 ? '#81c784' : red[500] + '80',
  },
}))

interface Props extends Pick<Paragraph, 'text' | 'confidence'> {
  onChipClick: (tesseractResult: TesseractResult) => void
  descriptionChecked: boolean
  ingredientsChecked: boolean
}

const TesseractParagraph = ({
  text,
  confidence,
  onChipClick,
  descriptionChecked,
  ingredientsChecked,
}: Props) => {
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
              icon={<BookIcon />}
              color={ingredientsChecked ? 'secondary' : 'default'}
              onClick={() =>
                onChipClick({ text, tesseractPart: 'ingredients' })
              }
              label="Zutaten"
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<AssignmentIcon />}
              color={descriptionChecked ? 'secondary' : 'default'}
              onClick={() =>
                onChipClick({ text, tesseractPart: 'description' })
              }
              label="Beschreibung"
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
