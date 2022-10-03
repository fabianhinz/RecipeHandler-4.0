import { Grid, makeStyles } from '@material-ui/core'

interface Props {
    children: React.ReactNode
}

const useStyles = makeStyles(() => ({
    container: {
        overflowX: 'hidden',
    },
}))

const EntryGridContainer = ({ children }: Props) => {
    const classes = useStyles()

    return (
        <Grid container className={classes.container} spacing={4}>
            {children}
        </Grid>
    )
}

export default EntryGridContainer
