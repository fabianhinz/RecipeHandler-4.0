import { Avatar, createStyles, Grid, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { Rating, RatingProps } from '@material-ui/lab'
import React, { ReactText, useState } from 'react'

import { useUsersContext } from '../Provider/UsersProvider'
import SatisfactionIconContainer from './SatisfactionIconContainer'

const useStyles = makeStyles(() =>
    createStyles({
        avatar: {
            width: 50,
            height: 50,
            margin: '8px 0px',
        },
    })
)

interface Props extends Pick<RatingProps, 'value' | 'onChange' | 'disabled'> {
    uid: string
}

const SatisfactionUser = ({ uid, ...ratingProps }: Props) => {
    const [tooltipTitle, setTooltipTitle] = useState<ReactText>('')

    const classes = useStyles()

    const { getByUid } = useUsersContext()
    const user = getByUid(uid)

    if (!user) return <></>

    const handleActiveChange = (_event: React.ChangeEvent<{}>, value: number) => {
        switch (value) {
            case 1: {
                setTooltipTitle('Das war wohl nix')
                break
            }
            case 2: {
                setTooltipTitle('Geht so')
                break
            }
            case 3: {
                setTooltipTitle('Nomnomnom')
                break
            }
            case 4: {
                setTooltipTitle('Wie - nichts mehr da?')
                break
            }
            case 5: {
                setTooltipTitle('Ich will meeeehr')
                break
            }
        }
    }

    return (
        <Grid container wrap="nowrap" spacing={2} alignItems="center">
            <Grid item>
                <Avatar className={classes.avatar} src={user.profilePicture}>
                    {user.username.slice(0, 1)}
                </Avatar>
            </Grid>
            <Grid item zeroMinWidth>
                <Typography gutterBottom noWrap variant="subtitle1">
                    {user.username}{' '}
                </Typography>
                <Tooltip title={tooltipTitle} placement="bottom-start">
                    <Rating
                        {...ratingProps}
                        onChangeActive={handleActiveChange}
                        name="recipe-user-satisfaction"
                        size="large"
                        IconContainerComponent={SatisfactionIconContainer}
                    />
                </Tooltip>
            </Grid>
        </Grid>
    )
}

export default SatisfactionUser
