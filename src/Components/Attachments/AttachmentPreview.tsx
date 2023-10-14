import { Skeleton, Theme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useRef } from 'react'

import { useAttachment } from '@/hooks/useAttachment'
import useImgSrcLazy from '@/hooks/useImgSrcLazy'
import { AttachmentDoc } from '@/model/model'
import elementIdService from '@/services/elementIdService'

const useStyles = makeStyles<Theme>(theme => ({
  skeleton: {
    borderRadius: theme.shape.borderRadius,
    height: 300,
  },
  img: {
    cursor: 'pointer',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    objectFit: 'cover',
  },
}))

interface Props {
  attachment: AttachmentDoc
  onClick: (originId: string) => void
}

const AttachmentPreview = ({ attachment, onClick }: Props) => {
  const originIdRef = useRef(elementIdService.getId('attachment-origin'))

  const { attachmentRef } = useAttachment(attachment)
  const { imgLoading, imgSrc } = useImgSrcLazy({
    src: attachmentRef.mediumDataUrl,
  })
  const classes = useStyles()

  if (imgLoading)
    return (
      <Skeleton
        variant="rectangular"
        animation="wave"
        className={classes.skeleton}
      />
    )

  return (
    <img
      onClick={() => onClick(originIdRef.current)}
      alt=""
      id={originIdRef.current}
      width="100%"
      height="100%"
      className={classes.img}
      src={imgSrc}
    />
  )
}

export default AttachmentPreview
