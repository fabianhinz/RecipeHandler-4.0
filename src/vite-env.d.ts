/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly __USE_EMULATORS__: boolean
  readonly __VERSION__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
