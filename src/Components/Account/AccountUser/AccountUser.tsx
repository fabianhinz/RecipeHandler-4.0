import { Grid } from '@material-ui/core'
import { LogoutVariant } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'

import useDocumentTitle from '../../../hooks/useDocumentTitle'
import useProgress from '../../../hooks/useProgress'
import { FirebaseService } from '../../../services/firebase'
import { useGridContext } from '../../Provider/GridProvider'
import { SecouredRouteFab } from '../../Routes/SecouredRouteFab'
import EntryGridContainer from '../../Shared/EntryGridContainer'
import { accountHooks } from '../helper/accountHooks'
import AccountUserAdmin from './AccountUserAdmin'
import AccountUserHeader from './AccountUserHeader'
import AccountUserSettings from './AccountUserSettings'

const AccountUser = () => {
  const gridContext = useGridContext()
  const progress = useProgress()
  const snackbar = useSnackbar()

  const authenticatedUser = accountHooks.useAuthenticatedUser()

  useDocumentTitle(authenticatedUser.username)

  const handleLogout = () => {
    progress.setProgress(true)
    FirebaseService.auth
      .signOut()
      .catch(error => snackbar.enqueueSnackbar(error.message, { variant: 'error' }))
  }

  return (
    <>
      <EntryGridContainer>
        <Grid item xs={12}>
          <AccountUserHeader />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <AccountUserSettings />

            {authenticatedUser.admin && (
              <Grid item {...gridContext.gridBreakpointProps}>
                <AccountUserAdmin />
              </Grid>
            )}
          </Grid>
        </Grid>
      </EntryGridContainer>

      <SecouredRouteFab onClick={handleLogout} icon={<LogoutVariant />} tooltipTitle="Ausloggen" />
      <progress.ProgressComponent />
    </>
  )
}

export default AccountUser
