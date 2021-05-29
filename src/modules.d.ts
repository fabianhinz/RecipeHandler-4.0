declare module 'browser-image-compression'

declare var __VERSION__: string
declare var __USE_EMULATORS__: boolean
interface Navigator {
    share?: (data?: { title?: string; text?: string; url?: string }) => Promise<void>
}
