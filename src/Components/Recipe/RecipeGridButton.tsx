import { GridOff, GridOn } from '@mui/icons-material'
import { IconButton, Tooltip, TooltipProps } from '@mui/material/'

import { useLayoutStore } from '@/store/LayoutStore'

interface Props {
  tooltipProps?: Pick<TooltipProps, 'placement'>
}

const RecipeGridButton = ({ tooltipProps }: Props) => {
  const gridListActive = useLayoutStore(store => store.gridListActive)
  const setPartialLayout = useLayoutStore(store => store.setPartialLayout)

  return (
    <Tooltip
      {...tooltipProps}
      title={gridListActive ? 'Bilder schließen' : 'Bilder anzeigen'}>
      <IconButton
        onClick={() => setPartialLayout({ gridListActive: !gridListActive })}
        size="large">
        {gridListActive ? <GridOff /> : <GridOn />}
      </IconButton>
    </Tooltip>
  )
}

export default RecipeGridButton
