import { useMediaQuery } from '@material-ui/core'
import { useLayoutEffect } from 'react'

export const useDisableScrollEffect = (on: boolean) => {
  const isPointerFine = useMediaQuery('@media (pointer: fine)')

  useLayoutEffect(() => {
    if (!isPointerFine) return

    const htmlEl = document.getElementsByTagName('html')[0]
    const headerEl = document.getElementsByTagName('header')[0]

    if (htmlEl.getBoundingClientRect().height === window.innerHeight) return

    if (on) {
      htmlEl.setAttribute('style', 'overflow:hidden; padding-right:16px')
      headerEl.setAttribute('style', 'padding-right:16px;')
    } else {
      htmlEl.removeAttribute('style')
      headerEl.removeAttribute('style')
    }
  }, [isPointerFine, on])
}
