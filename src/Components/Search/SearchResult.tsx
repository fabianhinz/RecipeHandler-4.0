import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Hit, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles({
    listItem: {
        borderRadius: 0,
    },
})

interface Props {
    hit: Hit
}

const SearchResult = (props: Props) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const history = useHistory()
    const classes = useStyles()

    useEffect(() => {
        let mounted = true
        FirebaseService.firestore
            .collection('recipes')
            .doc(props.hit.name)
            .get()
            .then(docSnapshot => {
                if (mounted) setRecipe(docSnapshot.data() as Recipe)
            })

        return () => {
            mounted = false
        }
    }, [props.hit.name])

    return (
        <ListItem
            key={props.hit.name}
            button
            className={classes.listItem}
            onClick={() => history.push(PATHS.details(props.hit.name))}>
            <ListItemAvatar>
                <Avatar src={recipe?.previewAttachment}>{props.hit.name.slice(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.hit.name}
                secondaryTypographyProps={{
                    component: 'div',
                }}
                secondary={
                    <>
                        {props.hit._highlightResult.ingredients.matchedWords.length > 0 && (
                            <Typography component="div" noWrap variant="caption">
                                <b>Zutaten</b>{' '}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: props.hit._snippetResult.ingredients.value,
                                    }}
                                />
                            </Typography>
                        )}

                        {props.hit._highlightResult.description.matchedWords.length > 0 && (
                            <Typography component="div" noWrap variant="caption">
                                <b>Beschreibung</b>{' '}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: props.hit._snippetResult.description.value,
                                    }}
                                />
                            </Typography>
                        )}
                    </>
                }
            />
        </ListItem>
    )
}

export default SearchResult
