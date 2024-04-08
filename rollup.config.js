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
    },
    {
      file: 'dist/vue-stack-grid.umd.js',
      format: 'umd',
      name: 'StackGrid',
      globals: {
        vue: 'Vue',
      },
    },
  ],
  plugins: [
    vue(),
    postcss({
      extract: false,
      minimize: true,
    }),
    commonjs(),
    nodeResolve(),
  ],
  external: ['vue'],
}
