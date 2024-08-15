// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js', // Entry file
  output: [
    {
      file: 'dist/index.cjs.js', // CommonJS (for Node) output
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // ES Module (for bundlers) output
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // Resolves node_modules
    commonjs(), // Converts CommonJS modules to ES6
    terser(), // Minifies the code
  ],
};
