import {
    Avatar,
    Button,
    ButtonBase,
    Checkbox,
    Chip,
    createStyles,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Slide,
    Typography,
} from '@material-ui/core'
import { Camera, ImageSearch } from 'mdi-material-ui'
import React, { useState } from 'react'

import { Recipe } from '../../model/model'
import SelectionDrawer from '../Shared/SelectionDrawer'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: 125,
            height: 125,
            backgroundColor: theme.palette.secondary.main,
        },
        actionContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        actionCameraIcon: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            fontSize: theme.typography.pxToRem(60),
        },
        subheader: {
            padding: 0,
            display: 'flex',
            justifyContent: 'space-between',
            background: theme.palette.background.paper,
        },
    })
)

type RecipeParts = keyof Pick<Recipe, 'ingredients' | 'description'> | undefined
type Item = string

const TesseractSelection = () => {
    const [checkedItems, setCheckedItems] = useState<Set<Item>>(new Set())
    const [memberOf, setMemberOf] = useState<Map<Item, RecipeParts>>(new Map())

    const classes = useStyles()

    const handleListItemClick = (item: string) => () => {
        setCheckedItems(previous => {
            if (previous.has(item)) previous.delete(item)
            else previous.add(item)
            return new Set(previous)
        })
    }

    const handleMemberButtonsClick = (recipeParts: RecipeParts) => () => {
        setMemberOf(previous => {
            checkedItems.forEach(item => {
                if (previous.get(item) && previous.get(item) === recipeParts)
                    previous.set(item, undefined)
                else previous.set(item, recipeParts)
            })
            return new Map(previous)
        })
    }

    const renderChipByItem = (item: string) => {
        const currentMember = memberOf.get(item)
        if (!currentMember) return <></>

        return (
            <Slide in direction="left">
                <Chip
                    size="small"
                    label={currentMember === 'description' ? 'Beschreibung' : 'Zutaten'}
                />
            </Slide>
        )
    }

    return (
        <SelectionDrawer
            buttonProps={{
                startIcon: <ImageSearch />,
                label: 'Einscannen',
            }}
            header={
                <Grid wrap="nowrap" container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleMemberButtonsClick('ingredients')}
                            fullWidth
                            variant="outlined">
                            Zutaten
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleMemberButtonsClick('description')}
                            fullWidth
                            variant="outlined">
                            Beschreibung
                        </Button>
                    </Grid>
                </Grid>
            }>
            <div className={classes.actionContainer}>
                <ButtonBase>
                    <Avatar variant="rounded" className={classes.avatar}>
                        <Camera className={classes.actionCameraIcon} />
                    </Avatar>
                </ButtonBase>
            </div>
            <ListSubheader className={classes.subheader}>Ergebnisse</ListSubheader>
            <List>
                {[
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyamdd',
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyamaa',
                    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyamffff',
                ].map(item => (
                    <ListItem button onClick={handleListItemClick(item)} disableGutters key={item}>
                        <ListItemIcon>
                            <Checkbox checked={checkedItems.has(item)} disableRipple />
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={<Typography noWrap>{item}</Typography>}
                            secondary={renderChipByItem(item)}
                        />
                    </ListItem>
                ))}
            </List>
        </SelectionDrawer>
    )
}

export default TesseractSelection
