import { ButtonBase, createStyles, makeStyles } from '@material-ui/core'
import { ButtonBaseProps } from '@material-ui/core/ButtonBase'
import React, { FC } from 'react'

import { BORDER_RADIUS_HUGE } from '../../theme'

const useStyles = makeStyles(() =>
    createStyles({
        buttonBase: {
            borderRadius: BORDER_RADIUS_HUGE,
        },
    })
)

export const CategoryBase: FC<ButtonBaseProps> = ({ children, ...buttonBaseProps }) => {
    const classes = useStyles()
    return (
        <ButtonBase className={classes.buttonBase} {...buttonBaseProps}>
            {children}
        </ButtonBase>
    )
}
