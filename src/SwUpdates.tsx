import { Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useLayoutEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export const SwUpdates = () => {
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()
  const snackbar = useSnackbar()

  useLayoutEffect(() => {
    if (offlineReady) {
      snackbar.enqueueSnackbar('Die Anwendung wurde installiert', { variant: 'success' })
    }
  }, [offlineReady, snackbar])

  useLayoutEffect(() => {
    if (needRefresh) {
      snackbar.enqueueSnackbar('Update verfügbar. Jetzt installieren?', {
        variant: 'info',
        persist: true,
        action: key => (
          <div onClick={() => snackbar.closeSnackbar(key)}>
            <Button onClick={() => updateServiceWorker(true)}>Ja</Button>
            <Button>Nein</Button>
          </div>
        ),
      })
    }
  }, [needRefresh, snackbar, updateServiceWorker])

  return null
}
