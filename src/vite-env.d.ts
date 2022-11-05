/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  RECIPE_HANDLER_USE_EMULATORS: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const RECIPE_HANDLER_APP_VERSION: string
