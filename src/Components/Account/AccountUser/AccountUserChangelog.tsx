import {
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TimelineIcon from '@material-ui/icons/TimelineRounded'
import React, { useEffect, useState } from 'react'

import { Issue, Pullrequest } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { SlideUp } from '../../Shared/Transitions'

const useStyles = makeStyles(theme =>
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
            flexBasis: '80%',
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
            FirebaseService.firestore.collection('pullrequests').onSnapshot(querySnapshot =>
                setPullrequests(
                    querySnapshot.docs
                        // TODO timestamp speichern und mit querysyntax filtern
                        .map(doc => doc.data() as Pullrequest)
                        .filter(pr => pr.creator !== 'dependabot-preview[bot]')
                        .sort((a, b) => {
                            return new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime()
                        })
                )
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

    const relatingIssues = (pullrequest: Pullrequest) => {
        const relatedIssues: Issue[] = []
        pullrequest.issueNumbers?.forEach(number => {
            issues?.forEach(issue => {
                if (issue.number.toString() === number) {
                    relatedIssues.push(issue)
                }
            })
        })
        return relatedIssues
    }

    // expansionpanel statt list
    return (
        <>
            <Chip
                onClick={() => setOpenChangelog(true)}
                icon={<TimelineIcon />}
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
                <DialogContent>
                    {pullrequests.map(pr => (
                        <ExpansionPanel key={pr.shortSha}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.expansionPanelHeaderVersion}>
                                    <Chip
                                        label={pr.shortSha}
                                        color={pr.shortSha === __VERSION__ ? 'primary' : 'default'}
                                    />
                                </Typography>
                                <Typography className={classes.expansionPanelHeaderTitle}>
                                    {pr.title}
                                </Typography>
                                <Typography>
                                    {new Date(pr.closedAt).toLocaleDateString()}
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    <Typography gutterBottom>{pr.creator}</Typography>
                                    <Typography gutterBottom>
                                        {new Date(pr.closedAt).toLocaleDateString()}
                                        {', '}
                                        {new Date(pr.closedAt).toLocaleTimeString()} Uhr
                                    </Typography>
                                    <List>
                                        {relatingIssues(pr).map(issue => (
                                            <ListItem key={issue.number}>
                                                <Typography
                                                    className={classes.expansionPanelContentIssues}>
                                                    {issue.title}
                                                </Typography>
                                                <Chip label={issue.labels.join(', ')} />
                                                {/* {issue.labels.map(label => (
                                                    <Chip label={label.name ? label.name : label} />
                                                ))} */}
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}
                    {/* <List>
                        {pullrequests?.map(pr => (
                            <ListItem key={pr.shortSha}>
                                <ListItemSecondaryAction>
                                    <Chip
                                        label={pr.shortSha}
                                        color={pr.shortSha === __VERSION__ ? 'primary' : 'default'}
                                    />
                                </ListItemSecondaryAction>
                                <ListItemText
                                    primary={pr.title}
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
                                            {relatingIssues(pr).map(issue => (
                                                <div key={issue.number}>
                                                    <i>- {issue.title}</i>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List> */}
                </DialogContent>
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
