import { makeStyles, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'

import { useAttachment } from '../../hooks/useAttachment'
import useImgSrcLazy from '../../hooks/useImgSrcLazy'
import { AttachmentDoc } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles<Theme, { imgSrc?: string; isExactAndLoading?: boolean }>(theme => ({
    iconContainer: {
        zIndex: -1,
        position: 'fixed',
        top: 0,
        left: 95,
        width: '100vw',
        height: '60vh',
        backgroundImage: props =>
            props.isExactAndLoading
                ? ''
                : `url(${props.imgSrc}), linear-gradient(90deg,${
                      theme.palette.type === 'light' ? '#8EDB91' : '#74B377'
                  } 30%,#81c784 70%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        [theme.breakpoints.only('xs')]: {
            display: 'none',
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
        marginTop: 64,
        padding: theme.spacing(2),
        filter: theme.palette.type === 'light' ? 'brightness(110%)' : 'brightness(90%)',
        width: 400,
        display: props.imgSrc ? 'none' : 'static',
    }),
}))

interface Props {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Background = ({ Icon }: Props) => {
    const match = useRouteMatch<{ name: string }>([PATHS.recipeEdit(), PATHS.details()])
    const [firstAttachment, setFirstAttachment] = useState<AttachmentDoc | undefined>()
    const attachment = useAttachment(firstAttachment)
    const { imgSrc, imgLoading } = useImgSrcLazy({ src: attachment.attachmentRef?.fullDataUrl })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const isExactAndLoading = useMemo(() => match?.isExact && imgLoading, [imgLoading])
    const classes = useStyles({ imgSrc, isExactAndLoading })

    useEffect(() => {
        if (match === null) return

        FirebaseService.firestore
            .collection('recipes')
            .doc(match.params.name)
            .collection('attachments')
            .orderBy('createdDate', 'desc')
            .limit(10)
            .get()
            .then(snapshot => {
                const randomDoc = snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)]

                if (randomDoc) setFirstAttachment(randomDoc.data() as AttachmentDoc)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classes.iconContainer}>
            {isExactAndLoading ? (
                <Skeleton variant="rect" className={classes.skeleton} />
            ) : imgSrc ? (
                <div className={classes.gradient} />
            ) : (
                <Icon className={classes.icon} />
            )}
        </div>
    )
}
