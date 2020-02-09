import {
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogTitle,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    List,
    ListItem,
    makeStyles,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import UpdateIconRounded from '@material-ui/icons/UpdateRounded'
import React, { useEffect, useState } from 'react'

import { Issue, Pullrequest } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { SlideUp } from '../../Shared/Transitions'

const useStyles = makeStyles(() =>
    createStyles({
        expansionPanelHeaderVersion: {
            flexBasis: '20%',
            flexShrink: 0,
        },
        expansionPanelHeaderTitle: {
            flexBasis: '60%',
            flexShrink: 0,
        },
        expansionPanelContentIssues: {
            flexBasis: '70%',
            flexShrink: 0,
        },
        expansionPanelContentIssueNumber: {
            flexBasis: '10%',
            flexShrink: 0,
        },
    })
)

const AccountUserChangelog = () => {
    const { isDialogFullscreen } = useBreakpointsContext()
    const [pullrequests, setPullrequests] = useState<Pullrequest[]>([])
    const [issues, setIssues] = useState<Issue[]>([])
    const [openChangelog, setOpenChangelog] = useState(false)
    const classes = useStyles()

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('pullrequests')
                .orderBy('closedAt', 'desc')
                .onSnapshot(querySnapshot =>
                    setPullrequests(querySnapshot.docs.map(doc => doc.data() as Pullrequest))
                ),
        []
    )

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('issues')
                .onSnapshot(querySnapshot =>
                    setIssues(querySnapshot.docs.map(doc => doc.data() as Issue))
                ),
        []
    )

    const relatingIssues = (pullrequest: Pullrequest) =>
        issues.filter(issue => pullrequest.issueNumbers?.includes(issue.number.toString()))

    return (
        <>
            <Chip
                onClick={() => setOpenChangelog(true)}
                icon={<UpdateIconRounded />}
                label={__VERSION__}
                color={pullrequests[0]?.shortSha === __VERSION__ ? 'default' : 'secondary'}
            />
            <Dialog
                fullScreen={isDialogFullscreen}
                open={openChangelog}
                onClose={() => setOpenChangelog(false)}
                keepMounted
                TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                {pullrequests.map(pr => (
                    <ExpansionPanel key={pr.shortSha}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Chip
                                label={pr.shortSha}
                                color={pr.shortSha === __VERSION__ ? 'primary' : 'default'}
                            />
                            <Typography className={classes.expansionPanelHeaderTitle}>
                                {pr.title}
                            </Typography>
                            <Typography>{pr.closedAt.toDate().toLocaleDateString()}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Typography gutterBottom>{pr.creator}</Typography>
                                <Typography gutterBottom>
                                    {pr.closedAt.toDate().toLocaleDateString()}
                                    {', '}
                                    {pr.closedAt.toDate().toLocaleTimeString()} Uhr
                                </Typography>
                                <List>
                                    {relatingIssues(pr).map(issue => (
                                        <ListItem key={issue.number}>
                                            <Typography
                                                className={
                                                    classes.expansionPanelContentIssueNumber
                                                }>
                                                {issue.number}
                                            </Typography>
                                            <Typography
                                                className={classes.expansionPanelContentIssues}>
                                                {issue.title}
                                            </Typography>
                                            {issue.labels.map(label => (
                                                <Chip
                                                    key={issue.number + label.name}
                                                    label={label.name}
                                                    style={{
                                                        backgroundColor: '#' + label.color,
                                                        margin: '2px',
                                                        height: '20px',
                                                    }}
                                                />
                                            ))}
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
                <DialogActions>
                    <IconButton onClick={() => setOpenChangelog(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AccountUserChangelog
