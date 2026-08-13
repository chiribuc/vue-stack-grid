import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.{spec,test}.{js,ts}'],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    // threads: false,
    // hookTimeout: 20000,
  },
})
