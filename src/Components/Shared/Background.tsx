import { Theme, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Skeleton } from '@mui/material';
import { getDocs } from 'firebase/firestore'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router'

import { PATHS } from '@/Components/Routes/Routes'
import { resolveNRecipeAttachmentsOrderedByCreatedDateAsc } from '@/firebase/firebaseQueries'
import { useAttachment } from '@/hooks/useAttachment'
import useImgSrcLazy from '@/hooks/useImgSrcLazy'
import { AttachmentDoc } from '@/model/model'

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
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
        : 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(255,255,255,0.7) 100%)',
  },
  icon: props => ({
    padding: theme.spacing(2),
    filter:
      theme.palette.mode === 'light' ? 'brightness(110%)' : 'brightness(90%)',
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
      theme.palette.mode === 'light' ? '#8EDB91' : '#74B377'
    } 30%,#81c784 70%)`
  }, [attachmentRefLoading, imgLoading, imgSrc, theme.palette.mode])

  const classes = useStyles({ backgroundImage })

  useLayoutEffect(() => {
    setFirstAttachment(undefined)
    if (match === null) {
      return
    }

    void getDocs(
      resolveNRecipeAttachmentsOrderedByCreatedDateAsc(match.params.name)
    ).then(snapshot => {
      if (snapshot.docs.length === 0) {
        setFirstAttachment(undefined)
        return
      }

      const randomDoc =
        snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)]

      if (randomDoc.exists()) {
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
        <Skeleton variant="rectangular" className={classes.skeleton} />
      ) : imgSrc ? (
        <div className={classes.gradient} />
      ) : (
        <Icon className={classes.icon} />
      )}
    </div>
  );
}
