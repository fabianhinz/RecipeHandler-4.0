import { IconButton, Tooltip, TooltipProps } from '@material-ui/core/'
import { GridOff, GridOn } from '@material-ui/icons'

import { useLayoutStore } from '@/store/LayoutStore'

interface Props {
    tooltipProps?: Pick<TooltipProps, 'placement'>
}

const RecipeGridButton = ({ tooltipProps }: Props) => {
    const gridListActive = useLayoutStore(store => store.gridListActive)
    const setPartialLayout = useLayoutStore(store => store.setPartialLayout)

    return (
        <Tooltip {...tooltipProps} title={gridListActive ? 'Bilder schließen' : 'Bilder anzeigen'}>
            <IconButton onClick={() => setPartialLayout({ gridListActive: !gridListActive })}>
                {gridListActive ? <GridOff /> : <GridOn />}
            </IconButton>
        </Tooltip>
    )
}

export default RecipeGridButton
