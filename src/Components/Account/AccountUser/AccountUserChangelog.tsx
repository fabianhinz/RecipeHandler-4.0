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
    // const classes = useStyles()
    const { isDialogFullscreen } = useBreakpointsContext()
    const [pullrequests, setPullrequests] = useState<Array<Pullrequest>>()
    const [issues, setIssues] = useState<Array<Issue>>()
    const classes = useStyles()

    useEffect(() => {
        FirebaseService.firestore
            .collection('pullrequests')
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
            .get()
            .then(querySnapshot => {
                setIssues(querySnapshot.docs.map(doc => doc.data() as Issue))
            })
    }, [])

    const relatingIssues = (pullrequest: Pullrequest) => {
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
                    pullrequests && pullrequests[0]?.shortSha === __VERSION__
                        ? 'default'
                        : 'secondary'
                }
            />
            <Dialog
                fullScreen={isDialogFullscreen}
                open={isOpen}
                onClose={onClose}
                TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                <DialogContent>
                    <List>
                        {pullrequests?.map(pr => (
                            <ListItem key={pr.shortSha} alignItems="flex-start">
                                <ListItemIcon className={classes.itemChip}>
                                    <Chip
                                        label={pr.shortSha}
                                        color={pr.shortSha === __VERSION__ ? 'primary' : 'default'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <div>
                                            {pr.title} <br />
                                        </div>
                                    }
                                    secondary={
                                        <div>
                                            created by <b>{pr.creator}</b>
                                            <br />
                                            merged: {new Date(pr.closedAt).toLocaleDateString()}
                                            {', '}
                                            {new Date(pr.closedAt).toLocaleTimeString()} Uhr
                                            <br /> <br />
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
