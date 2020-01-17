import { Card, CardContent } from '@material-ui/core'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Rating, { IconContainerProps } from '@material-ui/lab/Rating'
import React from 'react'

const customIcons: { [index: string]: { icon: React.ReactElement; label: string } } = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
}

function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props
    return <span {...other}>{customIcons[value].icon}</span>
}

const Satisfaction = () => {
    return (
        <Card>
            <CardContent>
                <Rating
                    name="customized-icons"
                    value={2}
                    getLabelText={(value: number) => customIcons[value].label}
                    IconContainerComponent={IconContainer}
                />
            </CardContent>
        </Card>
    )
}

export default Satisfaction
