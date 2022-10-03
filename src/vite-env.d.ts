/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly USE_EMULATORS: boolean
  readonly VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
