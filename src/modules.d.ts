declare module 'browser-image-compression'

interface Navigator {
  share?: (data?: { title?: string; text?: string; url?: string }) => Promise<void>
}
