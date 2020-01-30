import { Box, Grow } from '@material-ui/core'
import React from 'react'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'

interface Props {
    visible: boolean
}

const NotFound = ({ visible }: Props) => (
    <>
        {visible && (
            <Box padding={2} display="flex" justifyContent="center">
                <Grow in timeout={250}>
                    <NotFoundIcon width={200} />
                </Grow>
            </Box>
        )}
    </>
)
export default NotFound
