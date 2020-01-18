import { Dialog, DialogContent, DialogTitle, ListItem, ListItemText } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { SlideUp } from '../../Shared/Transitions'

interface Pullrequest {
    closedAt: string
    creator: string
    issueNumbers: Array<string>
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
    open: boolean
}

const AccountUserChangelog = ({ open }: Props) => {
    // const classes = useStyles()
    const { isDialogFullscreen } = useBreakpointsContext()
    const [pullrequests, setPullrequests] = useState<Array<Pullrequest>>()
    const [issues, setIssues] = useState<Array<Issue>>()

    useEffect(() => {
        FirebaseService.firestore
            .collection('pullrequests')
            .get()
            .then(querySnapshot => {
                setPullrequests(querySnapshot.docs.map(doc => doc.data() as Pullrequest))
            })

        FirebaseService.firestore
            .collection('issues')
            .get()
            .then(querySnapshot => {
                setIssues(querySnapshot.docs.map(doc => doc.data() as Issue))
            })
    }, [])

    return (
        <>
            <Dialog fullScreen={isDialogFullscreen} open={open} TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                <DialogContent>
                    {pullrequests?.map(pr => (
                        <ListItem>
                            <ListItemText primary={pr.title} />
                        </ListItem>
                    ))}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AccountUserChangelog
