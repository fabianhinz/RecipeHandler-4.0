declare module 'browser-image-compression'

interface Navigator {
  share?: (data?: {
    title?: string
    text?: string
    url?: string
  }) => Promise<void>
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
