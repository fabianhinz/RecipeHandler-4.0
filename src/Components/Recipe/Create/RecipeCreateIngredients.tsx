import { Box, createStyles, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import React, { useState } from 'react'

import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'

const useStyles = makeStyles(() =>
    createStyles({
        iconButtonSubtitle: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
    })
)

interface Props {
    amount: number
    onDecreaseAmount: () => void
    onIncreaseAmount: () => void
    ingredients: string
    onIngredientsChange: (value: string) => void
}

const RecipeCreateIngredients = ({
    amount,
    onDecreaseAmount,
    onIncreaseAmount,
    ingredients,
    onIngredientsChange,
}: Props) => {
    const [value, setValue] = useState(ingredients)
    const classes = useStyles()

    return (
        <RecipeCard
            transitionOrder={1}
            variant="preview"
            header={
                <Subtitle icon={<AssignmentIcon />} text="Zutaten für">
                    <Box display="flex" alignItems="center">
                        <IconButton
                            className={classes.iconButtonSubtitle}
                            onClick={onDecreaseAmount}
                            size="small">
                            <RemoveIcon />
                        </IconButton>
                        <Box marginLeft={0.5} marginRight={0.5} width={25} textAlign="center">
                            <Typography variant="h6">{amount}</Typography>
                        </Box>
                        <IconButton
                            className={classes.iconButtonSubtitle}
                            onClick={onIncreaseAmount}
                            size="small">
                            <AddIcon />
                        </IconButton>
                        <Box marginLeft={0.5} marginRight={0.5} width={25} textAlign="center">
                            <Typography variant="h5">
                                {amount < 2 ? 'Person' : 'Personen'}
                            </Typography>
                        </Box>
                    </Box>
                </Subtitle>
            }
            content={
                <TextField
                    label="optional"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onIngredientsChange(value)}
                    fullWidth
                    rows={15}
                    multiline
                    variant="outlined"
                    margin="dense"
                />
            }
        />
    )
}

export default RecipeCreateIngredients
