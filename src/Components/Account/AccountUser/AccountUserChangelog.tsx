import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Hidden,
    IconButton,
    ListSubheader,
    makeStyles,
    Typography,
    useTheme,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import UpdateIconRounded from '@material-ui/icons/UpdateRounded'
import { useEffect, useState } from 'react'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import Progress from '@/Components/Shared/Progress'
import { SlideUp } from '@/Components/Shared/Transitions'
import { Issue, Pullrequest } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

const useStyles = makeStyles(theme => ({
    dialogContent: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    issueContainer: {
        marginBottom: theme.spacing(2),
    },
    labelsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
}))

const AccountUserChangelog = () => {
    const [pullrequests, setPullrequests] = useState<Pullrequest[]>([])
    const [issues, setIssues] = useState<Issue[]>([])
    const [changelogOpen, setChangelogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const classes = useStyles()

    const theme = useTheme()
    const { isDialogFullscreen } = useBreakpointsContext()

    useEffect(() => {
        setLoading(true)
        return FirebaseService.firestore
            .collection('pullrequests')
            .orderBy('closedAt', 'desc')
            .limit(20)
            .onSnapshot(querySnapshot => {
                setPullrequests(querySnapshot.docs.map(doc => doc.data() as Pullrequest))
                setLoading(false)
            })
    }, [])

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
                label={import.meta.env.__VERSION__}
                color={
                    pullrequests.some(pr => pr.shortSha === import.meta.env.__VERSION__) &&
                    pullrequests[0]?.shortSha !== import.meta.env.__VERSION__
                        ? 'secondary'
                        : 'default'
                }
            />
            <Dialog
                fullScreen={isDialogFullscreen}
                open={changelogOpen}
                onClose={() => setChangelogOpen(false)}
                keepMounted
                TransitionComponent={SlideUp}
                maxWidth="sm"
                fullWidth>
                <DialogTitle>Changelog</DialogTitle>
                {loading && <Progress variant="absolute" />}
                <DialogContent className={classes.dialogContent}>
                    {pullrequests.map(pr => (
                        <Accordion variant="elevation" key={pr.shortSha}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1}>
                                    <Grid item xs={12} sm={9}>
                                        <Grid container alignItems="center" spacing={3}>
                                            <Grid item xs={4} sm={3}>
                                                <Chip
                                                    label={pr.shortSha}
                                                    color={
                                                        pr.shortSha === import.meta.env.__VERSION__
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
                                    <Hidden xsDown>
                                        <Grid item>
                                            <Typography>
                                                {pr.closedAt.toDate().toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    </Hidden>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1}>
                                    <Grid item>
                                        <ListSubheader disableGutters>{pr.creator}</ListSubheader>
                                    </Grid>
                                    <Grid item>
                                        <ListSubheader disableGutters>
                                            {pr.closedAt.toDate().toLocaleString()} Uhr
                                        </ListSubheader>
                                    </Grid>
                                    {pr.issueNumbers && pr.issueNumbers.length > 0 ? (
                                        <Grid item xs={12}>
                                            {getRelatedIssues(pr).map(issue => (
                                                <Grid
                                                    key={issue.number}
                                                    container
                                                    wrap="nowrap"
                                                    justifyContent="space-between"
                                                    className={classes.issueContainer}>
                                                    <Grid item xs={9}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={2}>
                                                                <Typography noWrap>
                                                                    {issue.number}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={10}>
                                                                <Typography>
                                                                    {issue.title}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item className={classes.labelsContainer}>
                                                        {issue.labels.map(label => (
                                                            <Chip
                                                                key={issue.number + label.name}
                                                                label={label.name}
                                                                size="small"
                                                                style={{
                                                                    color: theme.palette.getContrastText(
                                                                        '#' + label.color
                                                                    ),
                                                                    backgroundColor:
                                                                        '#' + label.color,
                                                                    margin: theme.spacing(0.5),
                                                                }}
                                                            />
                                                        ))}
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography>
                                                Keine zugehörigen Issues vorhanden
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
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
