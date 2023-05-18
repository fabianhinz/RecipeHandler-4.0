import {
  Avatar,
  Box,
  Card,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Zoom,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { Timestamp } from 'firebase/firestore'
import { memo, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { CategoryResult } from '@/Components/Category/CategoryResult'
import { PATHS } from '@/Components/Routes/Routes'
import useImgSrcLazy from '@/hooks/useImgSrcLazy'
import { Recipe } from '@/model/model'
import { BORDER_RADIUS } from '@/theme'

import { useUsersContext } from '../Provider/UsersProvider'
import HomeRecipeContextMenu from './HomeRecipeContextMenu'

export const RECIPE_CARD_HEIGHT = 300

const useStyles = makeStyles<
  Theme,
  { hover: boolean; swatches: Recipe['previewAttachmentSwatches'] }
>(theme => ({
  userAvatar: {
    height: 40,
    width: 40,
    border: `2px solid ${theme.palette.divider}`,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  avatar: {
    width: '100%',
    height: RECIPE_CARD_HEIGHT,
    fontSize: theme.typography.pxToRem(60),
    borderRadius: BORDER_RADIUS,
    [theme.breakpoints.up('lg')]: {
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: BORDER_RADIUS,
    },
  },
  compactPaper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  card: {
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    border: 'none',
    boxShadow: theme.shadows[1],
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${theme.spacing(1)}px 0px`,
    height: props => (props.hover ? '100%' : '66%'),
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'flex-end',
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.easeOut,
    }),
    background: props => {
      if (!props.swatches)
        return theme.palette.type === 'dark'
          ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
          : 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(0,0,0,0))'

      return theme.palette.type === 'dark'
        ? `linear-gradient(to top, ${props.swatches.darkVibrant}, rgba(0,0,0,0))`
        : `linear-gradient(to top, ${props.swatches.lightVibrant}, rgba(0,0,0,0))`
    },
  },
  typographyRecipeName: {
    textDecoration: props => (props.hover ? 'underline' : 'none'),
  },
}))

interface Props {
  recipe: Recipe
  lastCookedDate?: Timestamp
}

const HomeRecipeCard = ({ recipe, lastCookedDate }: Props) => {
  const [hover, setHover] = useState(false)

  const { imgSrc, imgLoading } = useImgSrcLazy({
    src: recipe.previewAttachment,
    skipOnUndefined: true,
  })
  const { getByUid } = useUsersContext()
  const classes = useStyles({
    hover,
    swatches: recipe.previewAttachmentSwatches,
  })

  const editor = useMemo(
    () => getByUid(recipe.editorUid),
    [getByUid, recipe.editorUid]
  )

  const changeHover = (state: 'active' | 'inactive') => () => {
    setHover(state === 'active')
  }

  if (imgLoading)
    return (
      <Grid item xs={6} md={4} lg={3} xl={2}>
        <Skeleton className={classes.avatar} variant="rect" />
      </Grid>
    )

  return (
    <>
      <Grid item xs={6} md={4} lg={3} xl={2}>
        <HomeRecipeContextMenu
          name={recipe.name}
          numberOfComments={recipe.numberOfComments}>
          <Link
            to={{ pathname: PATHS.details(recipe.name), state: { recipe } }}>
            <Card
              onMouseEnter={changeHover('active')}
              onMouseLeave={changeHover('inactive')}
              className={classes.card}>
              <Avatar variant="square" className={classes.avatar} src={imgSrc}>
                {recipe.name.slice(0, 1).toUpperCase()}
              </Avatar>
              {editor && (
                <Zoom in mountOnEnter>
                  <Avatar
                    className={classes.userAvatar}
                    src={editor.profilePicture}>
                    {editor.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                </Zoom>
              )}
              <div className={classes.avatarOverlay}>
                <Box mx={1}>
                  <Typography
                    className={classes.typographyRecipeName}
                    variant="h6"
                    gutterBottom>
                    {recipe.name}
                  </Typography>
                </Box>

                {lastCookedDate ? (
                  <Box mx={1}>
                    <Typography>
                      {lastCookedDate.toDate().toLocaleDateString()}
                    </Typography>
                  </Box>
                ) : (
                  <CategoryResult
                    extraPadding
                    swatches={recipe.previewAttachmentSwatches}
                    categories={recipe.categories}
                  />
                )}
              </div>
            </Card>
          </Link>
        </HomeRecipeContextMenu>
      </Grid>
    </>
  )
}

export default memo(
  HomeRecipeCard,
  (prev, next) =>
    prev.recipe.name === next.recipe.name &&
    prev.recipe.previewAttachment === next.recipe.previewAttachment &&
    prev.recipe.createdDate === next.recipe.createdDate &&
    prev.recipe.categories === next.recipe.categories
)
