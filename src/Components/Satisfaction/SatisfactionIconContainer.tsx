import DissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import SatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import VeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import VerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import { IconContainerProps } from '@mui/material/Rating'
import { memo } from 'react'

const customIcons: { [index: string]: { icon: React.ReactElement } } = {
  1: {
    icon: <VeryDissatisfiedIcon />,
  },
  2: {
    icon: <DissatisfiedIcon />,
  },
  3: {
    icon: <SatisfiedIcon />,
  },
  4: {
    icon: <SatisfiedAltIcon />,
  },
  5: {
    icon: <VerySatisfiedIcon />,
  },
}

const SatisfactionIconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

export default memo(SatisfactionIconContainer)
