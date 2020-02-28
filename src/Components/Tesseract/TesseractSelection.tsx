import { Button, createStyles, makeStyles } from '@material-ui/core'
import { ImageSearch } from 'mdi-material-ui'
import React from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        btn: {
            fontFamily: 'Ubuntu',
            textTransform: 'unset',
        },
    })
)

const TesseractSelection = () => {
    const classes = useStyles()
    return (
        <>
            <Button
                size="large"
                variant="contained"
                startIcon={<ImageSearch />}
                fullWidth
                className={classes.btn}>
                Einscannen
            </Button>
        </>
    )
}

export default TesseractSelection
