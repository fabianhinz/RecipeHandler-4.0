import DissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined'
import VeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import VerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import { IconContainerProps } from '@material-ui/lab/Rating'
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
