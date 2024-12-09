import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-stack-grid.esm.js',
      format: 'esm',
      exports: 'named',
    },
    {
      file: 'dist/vue-stack-grid.umd.js',
      format: 'umd',
      name: 'StackGrid',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
  ],
  plugins: [
    vue({
      css: false,
      template: {
        isProduction: true,
      },
    }),
    postcss({
      extract: false,
      modules: false,
      inject: true,
    }),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
  ],
  external: ['vue'],
}