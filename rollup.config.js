import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

const input = 'src/index.ts';

export default [
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'esm' }
    ],
    plugins: [esbuild()]
  },
  { input, output: { file: pkg.types, format: 'esm' }, plugins: [dts()] }
];
