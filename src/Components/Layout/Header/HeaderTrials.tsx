import {
    Backdrop,
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    createStyles,
    Fade,
    GridList,
    GridListTile,
    GridListTileBar,
    makeStyles,
    Typography,
} from '@material-ui/core'
import React, { FC } from 'react'

import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        gridList: {
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
    })
)

export const HeaderTrials: FC = () => {
    const { isMobile, isDialogFullscreen, isDrawerBottom } = useBreakpointsContext()
    const classes = useStyles()
    return (
        <Fade in>
            <Backdrop open className={classes.backdrop}>
                <Container maxWidth="lg">
                    {[
                        {
                            img: 'https://picsum.photos/800?random=1',
                            title: 'test1',
                            createdDate: new Date().toLocaleDateString(),
                            description:
                                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        },
                        {
                            img: 'https://picsum.photos/800?random=2',
                            title: 'test2',
                            createdDate: new Date().toLocaleDateString(),
                            description:
                                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        },
                        {
                            img: 'https://picsum.photos/800?random=3',
                            title: 'test3',
                            createdDate: new Date().toLocaleDateString(),
                            description:
                                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        },
                        {
                            img: 'https://picsum.photos/800?random=4',
                            title: 'test4',
                            createdDate: new Date().toLocaleDateString(),
                            description:
                                'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                        },
                    ].map(trial => (
                        <Card key={trial.title} raised>
                            <CardHeader title={trial.title} subheader={trial.createdDate} />
                            <CardContent>
                                <CardMedia image={trial.img} />
                                <Typography variant="body2" color="textSecondary">
                                    {trial.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Container>
            </Backdrop>
        </Fade>
    )
}
