import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// https://vite.dev/config/
const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()]
})

export default mergeConfig(viteConfig, defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setup.ts",
  },
}))
