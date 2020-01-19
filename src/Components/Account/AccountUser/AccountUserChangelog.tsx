import {
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import TimelineIcon from '@material-ui/icons/TimelineRounded'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { SlideUp } from '../../Shared/Transitions'
// ? PullRequest, Label und Issue types bitte hier hin >> model.ts
interface Pullrequest {
    closedAt: string
    closedAtFormated: Date | undefined
    creator: string
    issueNumbers: Array<string> | undefined
    shortSha: string
    title: string
}

interface Label {
    name: string
    color: string
}

interface Issue {
    labels: Array<string> | Array<Label>
    number: number
    subject: string
    title: string
}
// ? Die Props brauchen wir nicht, sofern der state nach innen wandert
interface Props {
    isOpen: boolean
    onClose: () => void
    onClick: () => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        itemChip: {
            marginRight: theme.spacing(1),
        },
    })
)

const AccountUserChangelog = ({ isOpen, onClose, onClick }: Props) => {
    // ? das darf raus :D ?!
    // const classes = useStyles()
    const { isDialogFullscreen } = useBreakpointsContext()
    // ? array bitte so instanziieren useState<T[]>([])
    const [pullrequests, setPullrequests] = useState<Array<Pullrequest>>()
    const [issues, setIssues] = useState<Array<Issue>>()
    const classes = useStyles()

    useEffect(() => {
        FirebaseService.firestore
            .collection('pullrequests')
            // ? warum kein onShnapshot ?
            .get()
            .then(querySnapshot => {
                setPullrequests(
                    querySnapshot.docs
                        .map(doc => doc.data() as Pullrequest)
                        .filter(pr => pr.creator !== 'dependabot-preview[bot]')
                        .sort((a, b) => {
                            return new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime()
                        })
                )
            })

        FirebaseService.firestore
            .collection('issues')
            // ? warum kein onShnapshot ?
            .get()
            .then(querySnapshot => {
                setIssues(querySnapshot.docs.map(doc => doc.data() as Issue))
            })
    }, [])

    const relatingIssues = (pullrequest: Pullrequest) => {
        // ? bitte sei so gut und initialisier Arrays nur via array literale --> []
        // ? warum --> naja: const test = [10] ist ein array mit einem element
        // ? --> const test = new Array(10) ist ein array mit 10 elementen...
        const relatedIssues = Array<Issue>()
        pullrequest.issueNumbers?.forEach(number => {
            issues?.forEach(issue => {
                if (issue.number.toString() === number) {
                    relatedIssues.push(issue)
                }
            })
        })
        return relatedIssues
    }

    return (
        <>
            <Chip
                onClick={onClick}
                icon={<TimelineIcon />}
                label={__VERSION__}
                color={
                    // ? shau dir mal Array.prototype.some an ;)
                    pullrequests && pullrequests[0]?.shortSha === __VERSION__
                        ? 'default'
                        : 'secondary'
                }
            />
            <Dialog
                fullScreen={isDialogFullscreen}
                open={isOpen}
                onClose={onClose}
                // ? keepMounted prop bitte setzen
                TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                <DialogContent>
                    <List>
                        {pullrequests?.map(pr => (
                            <ListItem key={pr.shortSha} alignItems="flex-start">
                                {/* ? nimm statt <ListItemIcon /> bitte <ListItemSecondaryAction /> */}
                                <ListItemIcon className={classes.itemChip}>
                                    <Chip
                                        label={pr.shortSha}
                                        color={pr.shortSha === __VERSION__ ? 'primary' : 'default'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <div>
                                            {/* was spricht gegen primary={pr.title} */}
                                            {pr.title} <br />
                                        </div>
                                    }
                                    secondary={
                                        // dachte das ist ne Anwendung für deutschsprachige menschen :D
                                        // nimm hier einfach die Typography komponente
                                        <div>
                                            created by <b>{pr.creator}</b>
                                            <br />
                                            merged: {new Date(pr.closedAt).toLocaleDateString()}
                                            {', '}
                                            {new Date(pr.closedAt).toLocaleTimeString()} Uhr
                                            <br /> <br />
                                            {/* fänds super wenn wir sowas toggle ähnliches machen
                                            schau dir mal den showInfo state an --> AccountUser */}
                                            {relatingIssues(pr).map(issue => (
                                                <div>
                                                    <i>- {issue.title}</i>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AccountUserChangelog
