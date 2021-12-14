import { makeStyles, Popover, PopoverPosition } from '@material-ui/core'
import { ReactNode, useLayoutEffect, useState } from 'react'

import { Recipe } from '../../model/model'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecipeBookmarkButton from '../Recipe/RecipeBookmarkButton'
import RecipeCookCounterButton from '../Recipe/RecipeCookCounterButton'
import RecipeShareButton from '../Recipe/RecipeShareButton'

const useStyles = makeStyles(theme => ({
    homeRecipeContextMenuRoot: {
        padding: theme.spacing(1),
        display: 'flex',
    },
}))

interface Props {
    children: ReactNode
    name: Recipe['name']
    numberOfComments?: Recipe['numberOfAttachments']
}

const HomeRecipeContextMenu = (props: Props) => {
    const [childRef, setChildRef] = useState<null | HTMLDivElement>(null)
    const [anchorPosition, setAnchorPosition] = useState<PopoverPosition | undefined>()
    const { user } = useFirebaseAuthContext()
    const classes = useStyles()

    useLayoutEffect(() => {
        if (!childRef) return

        childRef.oncontextmenu = e => {
            setAnchorPosition({ top: e.clientY, left: e.clientX })
        }
    }, [childRef])

    return (
        <>
            <Popover
                PaperProps={{ className: classes.homeRecipeContextMenuRoot }}
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                open={Boolean(anchorPosition)}
                onClose={() => setAnchorPosition(undefined)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <RecipeBookmarkButton name={props.name} />
                <RecipeShareButton name={props.name} />
                {user && props.numberOfComments !== undefined && (
                    <Comments
                        name={props.name}
                        collection="recipes"
                        numberOfComments={props.numberOfComments}
                    />
                )}
                <RecipeCookCounterButton name={props.name} />
            </Popover>
            <div
                ref={el => {
                    if (el) setChildRef(el)
                }}>
                {props.children}
            </div>
        </>
    )
}

export default HomeRecipeContextMenu
