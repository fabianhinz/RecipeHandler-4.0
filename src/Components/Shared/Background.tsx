import { makeStyles, Theme, useTheme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router'

import { PATHS } from '@/Components/Routes/Routes'
import { useAttachment } from '@/hooks/useAttachment'
import useImgSrcLazy from '@/hooks/useImgSrcLazy'
import { AttachmentDoc } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

type StyleProps = {
  backgroundImage: string
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  iconContainer: {
    zIndex: -1,
    position: 'fixed',
    display: 'flex',
    justifyContent: 'flex-start',
    top: 64,
    left: 95,
    width: '100vw',
    height: '50vh',
    backgroundImage: props => props.backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [theme.breakpoints.only('xs')]: {
      left: 0,
    },
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    background:
      theme.palette.type === 'dark'
        ? 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
        : 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(255,255,255,0.7) 100%)',
  },
  icon: props => ({
    padding: theme.spacing(2),
    filter:
      theme.palette.type === 'light' ? 'brightness(110%)' : 'brightness(90%)',
    width: 400,
    [theme.breakpoints.only('xs')]: {
      flex: 1,
    },
  }),
}))

interface Props {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Background = ({ Icon }: Props) => {
  const [firstAttachment, setFirstAttachment] = useState<
    AttachmentDoc | undefined
  >()
  const match = useRouteMatch<{ name: string }>([
    PATHS.recipeEdit(),
    PATHS.details(),
  ])
  const location = useLocation()
  const { attachmentRef, attachmentRefLoading } = useAttachment(firstAttachment)
  const { imgSrc, imgLoading } = useImgSrcLazy({
    src: attachmentRef?.fullDataUrl,
    skipOnUndefined: true,
  })
  const theme = useTheme()

  const backgroundImage = useMemo(() => {
    if (imgLoading || attachmentRefLoading) {
      return 'unset'
    }

    if (imgSrc) {
      return `url(${CSS.escape(imgSrc)})`
    }

    return `linear-gradient(90deg,${
      theme.palette.type === 'light' ? '#8EDB91' : '#74B377'
    } 30%,#81c784 70%)`
  }, [attachmentRefLoading, imgLoading, imgSrc, theme.palette.type])

  const classes = useStyles({ backgroundImage })

  useLayoutEffect(() => {
    setFirstAttachment(undefined)
    if (match === null) {
      return
    }

    FirebaseService.firestore
      .collection('recipes')
      .doc(match.params.name)
      .collection('attachments')
      .orderBy('createdDate', 'desc')
      .limit(5)
      .get()
      .then(snapshot => {
        const randomDoc =
          snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)]

        if (randomDoc.exists) {
          setFirstAttachment(randomDoc.data() as AttachmentDoc)
        } else {
          setFirstAttachment(undefined)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className={classes.iconContainer}>
      {imgLoading || attachmentRefLoading ? (
        <Skeleton variant="rect" className={classes.skeleton} />
      ) : imgSrc ? (
        <div className={classes.gradient} />
      ) : (
        <Icon className={classes.icon} />
      )}
    </div>
  )
}
