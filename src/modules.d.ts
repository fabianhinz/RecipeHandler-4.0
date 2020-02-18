declare module 'browser-image-compression'

declare var __VERSION__
interface Navigator {
    share?: (data?: { title?: string; text?: string; url?: string }) => Promise<void>
}
