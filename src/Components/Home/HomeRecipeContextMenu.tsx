import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  PopoverPosition,
  useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AddCircleOutlined } from '@mui/icons-material'
import { ReactNode, useState } from 'react'

import RecipeBookmarkButton from '@/Components/Recipe/RecipeBookmarkButton'
import RecipeShareButton from '@/Components/Recipe/RecipeShareButton'
import { PATHS } from '@/Components/Routes/Routes'
import { Recipe } from '@/model/model'

const useStyles = makeStyles(theme => ({
  homeRecipeContextMenuRoot: {
    display: 'flex',
  },
}))

interface Props {
  children: ReactNode
  name: Recipe['name']
  numberOfComments?: Recipe['numberOfAttachments']
}

const HomeRecipeContextMenu = (props: Props) => {
  const [anchorPosition, setAnchorPosition] = useState<
    PopoverPosition | undefined
  >()
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <Popover
        PaperProps={{ className: classes.homeRecipeContextMenuRoot }}
        transitionDuration={{
          enter: theme.transitions.duration.complex,
          exit: 0,
        }}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={Boolean(anchorPosition)}
        onClose={() => setAnchorPosition(undefined)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <List disablePadding onClick={() => setAnchorPosition(undefined)}>
          <ListItem
            onClick={() => window.open(PATHS.details(props.name))}
            button>
            <ListItemIcon>
              <AddCircleOutlined />
            </ListItemIcon>
            <ListItemText primary="In neuem Tab öffnen" />
          </ListItem>
          <Divider />

          <RecipeBookmarkButton variant="ListItem" name={props.name} />
          <RecipeShareButton variant="ListItem" name={props.name} />
        </List>
      </Popover>
      <div
        onContextMenu={e => {
          setAnchorPosition({ top: e.clientY, left: e.clientX })
        }}>
        {props.children}
      </div>
    </>
  )
}

export default HomeRecipeContextMenu
