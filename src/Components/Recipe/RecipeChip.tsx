import { Avatar, Chip, makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { useHistory } from 'react-router-dom'

import { PATHS } from '@/Components/Routes/Routes'
import { useRecipeDoc } from '@/hooks/useRecipeDoc'
import { Recipe } from '@/model/model'

const useStyles = makeStyles<Theme, Pick<Recipe, 'previewAttachmentSwatches'>>(
  theme => ({
    root: {
      transition: theme.transitions.create(['background-color', 'filter']),
      backgroundColor: props => props.previewAttachmentSwatches?.muted,
      '&:hover, &:focus': {
        backgroundColor: props => props.previewAttachmentSwatches?.muted,
        filter: 'brightness(0.8)',
      },
    },
    label: {
      color: props =>
        theme.palette.getContrastText(
          props.previewAttachmentSwatches?.muted ?? theme.palette.text.primary
        ),
    },
  })
)

type Props = {
  recipeName: string
}

const RecipeChip = (props: Props) => {
  const history = useHistory()

  const { recipeDoc } = useRecipeDoc({ recipeName: props.recipeName })
  const classes = useStyles({
    previewAttachmentSwatches: recipeDoc?.previewAttachmentSwatches,
  })

  if (!recipeDoc) {
    return (
      <Skeleton variant="rect" style={{ borderRadius: 16 }}>
        <Chip avatar={<Avatar></Avatar>} label={props.recipeName} />{' '}
      </Skeleton>
    )
  }

  return (
    <Chip
      classes={classes}
      avatar={
        <Avatar src={recipeDoc?.previewAttachment}>
          {props.recipeName.slice(0, 1)}
        </Avatar>
      }
      onClick={() => history.push(PATHS.details(props.recipeName))}
      label={props.recipeName}
    />
  )
}

export default RecipeChip
