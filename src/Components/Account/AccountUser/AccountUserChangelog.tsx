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
    Grid,
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
        dialogContent: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    })
)

const AccountUserChangelog = () => {
    const { isDialogFullscreen } = useBreakpointsContext()
    const [pullrequests, setPullrequests] = useState<Pullrequest[]>([])
    const [issues, setIssues] = useState<Issue[]>([])
    const [changelogOpen, setChangelogOpen] = useState(false)
    const classes = useStyles()

    useEffect(() => {
        if (!changelogOpen) return

        return FirebaseService.firestore
            .collection('pullrequests')
            .orderBy('closedAt', 'desc')
            .onSnapshot(querySnapshot =>
                setPullrequests(querySnapshot.docs.map(doc => doc.data() as Pullrequest))
            )
    }, [changelogOpen])

    useEffect(() => {
        if (!changelogOpen) return

        return FirebaseService.firestore
            .collection('issues')
            .onSnapshot(querySnapshot =>
                setIssues(querySnapshot.docs.map(doc => doc.data() as Issue))
            )
    }, [changelogOpen])

    const getRelatedIssues = (pullrequest: Pullrequest) =>
        issues.filter(issue => pullrequest.issueNumbers?.includes(issue.number.toString()))

    return (
        <>
            <Chip
                onClick={() => setChangelogOpen(true)}
                icon={<UpdateIconRounded />}
                label={__VERSION__}
                color={pullrequests[0]?.shortSha === __VERSION__ ? 'default' : 'secondary'}
            />
            <Dialog
                fullScreen={isDialogFullscreen}
                open={changelogOpen}
                onClose={() => setChangelogOpen(false)}
                keepMounted
                TransitionComponent={SlideUp}>
                <DialogTitle>Changelog</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    {pullrequests.map(pr => (
                        <ExpansionPanel key={pr.shortSha}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid
                                    container
                                    alignItems="center"
                                    justify="space-between"
                                    spacing={1}>
                                    <Grid item xs={12} sm={9}>
                                        <Grid container alignItems="center" spacing={3}>
                                            <Grid item xs={4} sm={3}>
                                                <Chip
                                                    label={pr.shortSha}
                                                    color={
                                                        pr.shortSha === __VERSION__
                                                            ? 'primary'
                                                            : 'default'
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={8} sm={9}>
                                                <Typography>{pr.title}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {pr.closedAt.toDate().toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid item>
                                        <Typography>{pr.creator}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {pr.closedAt.toDate().toLocaleString()} Uhr
                                        </Typography>
                                    </Grid>
                                    {getRelatedIssues.length > 0 && (
                                        <Grid item xs={12}>
                                            <List>
                                                {getRelatedIssues(pr).map(issue => (
                                                    <ListItem key={issue.number}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={2} sm={1}>
                                                                <Typography>
                                                                    {issue.number}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={10} sm={8}>
                                                                <Typography>
                                                                    {issue.title}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                {issue.labels.map(label => (
                                                                    <Chip
                                                                        key={
                                                                            issue.number +
                                                                            label.name
                                                                        }
                                                                        label={label.name}
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#' + label.color,
                                                                            margin: '2px',
                                                                            height: '20px',
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                    )}
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={() => setChangelogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AccountUserChangelog
