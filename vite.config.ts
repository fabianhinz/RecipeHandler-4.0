import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __USE_EMULATORS__: Boolean(process.env.useEmulators),
        __VERSION__: JSON.stringify(
            process.env.VERSION || (process.env.NODE_ENV === 'production' ? 'unkown' : 'dev')
        ),
    },
    plugins: [react(), svgrPlugin(), tsconfigPaths()],
})
