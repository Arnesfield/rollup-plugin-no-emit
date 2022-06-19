import esbuild from 'rollup-plugin-esbuild';
import mocha from './test/mocha';
import pkg from './package.json';

export default {
  input: 'test/index.spec.ts',
  output: { dir: 'tmp/test', format: 'cjs', entryFileNames: '[name].cjs' },
  plugins: [mocha(), esbuild({ minify: true })],
  external: Object.keys(pkg.devDependencies)
};
