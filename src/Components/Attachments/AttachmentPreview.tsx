import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useRef } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import useImgSrcLazy from '../../hooks/useImgSrcLazy'
import { AttachmentDoc } from '../../model/model'
import elementIdService from '../../services/elementIdService'

const useStyles = makeStyles(theme => {
    const responsiveDimenstions = {
        [theme.breakpoints.between('xs', 'sm')]: {
            width: 250 - theme.spacing(4),
            height: 250 - theme.spacing(4),
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: 300 - theme.spacing(4),
            height: 300 - theme.spacing(4),
        },
        [theme.breakpoints.up('xl')]: {
            width: 350 - theme.spacing(4),
            height: 350 - theme.spacing(4),
        },
    }

    return createStyles({
        skeleton: {
            ...responsiveDimenstions,
        },
        img: {
            ...responsiveDimenstions,
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: theme.shadows[2],
            objectFit: 'cover',
        },
    })
})

interface Props {
    attachment: AttachmentDoc
    onClick: (originId: string) => void
}

const AttachmentPreview = ({ attachment, onClick }: Props) => {
    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef } = useAttachment(attachment)
    const { imgLoading, imgSrc } = useImgSrcLazy({ src: attachmentRef.mediumDataUrl })
    const classes = useStyles()

    return (
        <Grid item>
            {imgLoading ? (
                <Skeleton variant="circle" animation="wave" className={classes.skeleton} />
            ) : (
                <img
                    onClick={() => onClick(originIdRef.current)}
                    className={classes.img}
                    alt=""
                    id={originIdRef.current}
                    src={imgSrc}
                />
            )}
        </Grid>
    )
}

export default AttachmentPreview
