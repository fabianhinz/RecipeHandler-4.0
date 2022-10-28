/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
declare const USE_EMULATORS: boolean
