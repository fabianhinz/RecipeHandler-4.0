import Splitter from '@devbookhq/splitter'
import { Theme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useState } from 'react'

import { BORDER_RADIUS } from '@/theme'

const useStyles = makeStyles<Theme>(theme => ({
  container: {
    overflowX: 'auto',
  },
  splitDragger: {
    backgroundColor: theme.palette.text.secondary,
    transition: theme.transitions.create('background-color'),
  },
  splitGutter: {
    background: theme.palette.divider,
    margin: theme.spacing(0, 1),
    borderRadius: BORDER_RADIUS,
  },
}))

interface Props {
  children: [React.ReactNode, React.ReactNode]
}

export const ExpensesSplitView = (props: Props) => {
  const [splitterSizes, setSplitterSizes] = useState([40, 60])
  const classes = useStyles()

  const handleResizeFinished = (_: unknown, newSizes: number[]) => {
    setSplitterSizes(newSizes)
  }

  return (
    <Splitter
      initialSizes={splitterSizes}
      minWidths={[400, 400]}
      onResizeFinished={handleResizeFinished}
      draggerClassName={classes.splitDragger}
      gutterClassName={classes.splitGutter}>
      {props.children}
    </Splitter>
  )
}
