import { makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { useLayoutEffect, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { useAttachment } from '@/hooks/useAttachment'
import useImgSrcLazy from '@/hooks/useImgSrcLazy'
import { AttachmentDoc, User } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

type StyleProps = {
  imgSrc?: string
  user?: User
  imgLoading?: boolean
  attachmentRefLoading?: boolean
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
    backgroundImage: props => {
      if (props.imgLoading || props.attachmentRefLoading) {
        return 'unset'
      }
      if (props.imgSrc) {
        return `url(${CSS.escape(props.imgSrc)})`
      }

      return `linear-gradient(90deg,${
        theme.palette.type === 'light' ? '#8EDB91' : '#74B377'
      } 30%,#81c784 70%)`
    },
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
    filter: theme.palette.type === 'light' ? 'brightness(110%)' : 'brightness(90%)',
    width: 400,
    display: props.imgSrc ? 'none' : 'static',
    [theme.breakpoints.only('xs')]: {
      flex: 1,
    },
  }),
}))

interface Props {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Background = ({ Icon }: Props) => {
  const [firstAttachment, setFirstAttachment] = useState<AttachmentDoc | undefined>()
  const match = useRouteMatch<{ name: string }>([PATHS.recipeEdit(), PATHS.details()])
  const location = useLocation()
  const { attachmentRef, attachmentRefLoading } = useAttachment(firstAttachment)
  const { imgSrc, imgLoading } = useImgSrcLazy({
    src: attachmentRef?.fullDataUrl,
    skipOnUndefined: true,
  })
  const { user } = useFirebaseAuthContext()
  const classes = useStyles({ imgSrc, imgLoading, attachmentRefLoading, user })

  useLayoutEffect(() => {
    setFirstAttachment(undefined)
    if (match === null || !user) return

    FirebaseService.firestore
      .collection('recipes')
      .doc(match.params.name)
      .collection('attachments')
      .orderBy('createdDate', 'desc')
      .limit(5)
      .get()
      .then(snapshot => {
        const randomDoc = snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)]

        if (randomDoc) setFirstAttachment(randomDoc.data() as AttachmentDoc)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user])

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
