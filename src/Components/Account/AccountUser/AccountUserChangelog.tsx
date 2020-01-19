import {
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { SlideUp } from '../../Shared/Transitions'

interface Pullrequest {
    closedAt: string
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
}

const AccountUserChangelog = ({ isOpen, onClose }: Props) => {
    // const classes = useStyles()
    const { isDialogFullscreen } = useBreakpointsContext()
    const [pullrequests, setPullrequests] = useState<Array<Pullrequest>>()
    const [issues, setIssues] = useState<Array<Issue>>()

    useEffect(() => {
        FirebaseService.firestore
            .collection('pullrequests')
            .get()
            .then(querySnapshot => {
                setPullrequests(
                    querySnapshot.docs
                        .map(doc => doc.data() as Pullrequest)
                        .filter(pr => pr.creator !== 'dependabot-preview[bot]')
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
            <Dialog
                fullScreen={isDialogFullscreen}
                open={isOpen}
                onClose={onClose}
                TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                <DialogContent>
                    <List>
                        {pullrequests?.map(pr => (
                            <ListItem key={pr.shortSha}>
                                <ListItemText
                                    primary={
                                        <div>
                                            <Chip label={pr.shortSha} />
                                            {pr.title} <br />
                                            {pr.creator} {pr.closedAt}
                                            {relatingIssues(pr).map(issue => (
                                                <div>{issue.title}</div>
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
