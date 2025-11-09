import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/components/**/*.vue', 'src/types/**/*.ts']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/StackGrid.vue'),
      name: 'VueStackGrid',
      fileName: 'vue-stack-grid'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})