import eslint from '@rollup/plugin-eslint';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import outputSize from 'rollup-plugin-output-size';
import type Pkg from './package.json';

const require = createRequire(import.meta.url);
const pkg: typeof Pkg = require('./package.json');
const input = 'src/index.ts';
// skip sourcemap and umd unless production
const WATCH = process.env.ROLLUP_WATCH === 'true';
const PROD = !WATCH || process.env.NODE_ENV === 'production';

function defineConfig(options: (false | RollupOptions)[]) {
  return options.filter((options): options is RollupOptions => !!options);
}

export default defineConfig([
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: PROD },
      { file: pkg.module, format: 'esm', sourcemap: PROD }
    ],
    plugins: [esbuild(), outputSize()]
  },
  {
    input,
    output: { file: pkg.types, format: 'esm' },
    plugins: [dts(), outputSize()]
  },
  !PROD && {
    input,
    watch: { skipWrite: true },
    plugins: [eslint(), typescript()]
  }
]);
