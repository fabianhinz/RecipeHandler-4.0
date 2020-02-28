import {
    Avatar,
    Button,
    ButtonBase,
    Checkbox,
    Chip,
    createStyles,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Slide,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { Camera, ContentSave, ImageSearch } from 'mdi-material-ui'
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
            marginBottom: theme.spacing(1),
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
export type TesseractResult = { item: Item; recipePart: RecipeParts }
export type TesseractResults = TesseractResult[]
interface Props {
    onSave: (results: TesseractResults) => void
}

const TesseractSelection = ({ onSave }: Props) => {
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

    const getResult = () =>
        [...memberOf.entries()]
            .filter(([item]) => checkedItems.has(item))
            .map(([item, recipePart]) => ({ item, recipePart } as TesseractResult))

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
            {closeDrawer => (
                <>
                    <div className={classes.actionContainer}>
                        <ButtonBase>
                            <Avatar variant="rounded" className={classes.avatar}>
                                <Camera className={classes.actionCameraIcon} />
                            </Avatar>
                        </ButtonBase>
                    </div>
                    <ListSubheader className={classes.subheader}>
                        Ergebnisse{' '}
                        <Tooltip
                            placement="left"
                            title={checkedItems.size === 0 ? '' : 'In Rezept übernehmen'}>
                            <div>
                                <IconButton
                                    onClick={() => {
                                        onSave(getResult())
                                        closeDrawer()
                                    }}
                                    disabled={checkedItems.size === 0}>
                                    <ContentSave />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </ListSubheader>
                    <List>
                        {['1', '2', '3'].map((item, index) => (
                            <ListItem
                                button
                                onClick={handleListItemClick(item)}
                                disableGutters
                                key={index}>
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
                </>
            )}
        </SelectionDrawer>
    )
}

export default TesseractSelection
