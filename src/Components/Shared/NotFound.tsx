import { Box, Grow } from '@material-ui/core'

import notFoundLogo from '@/icons/notFound.png'

interface Props {
  visible: boolean
}

const preloadImg = new Image()
preloadImg.src = notFoundLogo

const NotFound = ({ visible }: Props) => (
  <>
    {visible && (
      <Grow in timeout={250}>
        <Box flexGrow={1} padding={4} display="flex" justifyContent="center">
          <img alt="not-found" src={preloadImg.src} width={200} height="100%" />
        </Box>
      </Grow>
    )}
  </>
)
export default NotFound
