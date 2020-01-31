import { Box, Grow } from '@material-ui/core'
import React from 'react'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'

interface Props {
    visible: boolean
}

const NotFound = ({ visible }: Props) => (
    <>
        {visible && (
            <Grow in timeout={250}>
                <Box flexGrow={1} padding={2} display="flex" justifyContent="center">
                    <NotFoundIcon width={200} />
                </Box>
            </Grow>
        )}
    </>
)
export default NotFound
