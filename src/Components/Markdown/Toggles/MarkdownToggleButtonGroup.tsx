import { withStyles } from '@material-ui/core'
import { ToggleButtonGroup } from '@material-ui/lab'

const MarkdownToggleButtonGroup = withStyles(theme => ({
    grouped: {
        border: 'none',
        padding: theme.spacing(0, 1),
        marginRight: theme.spacing(1),
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:last-child': {
            marginRight: 0,
        },
    },
}))(ToggleButtonGroup)

export default MarkdownToggleButtonGroup
