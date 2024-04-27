[npm-img]: https://img.shields.io/npm/v/rollup-plugin-no-emit.svg
[npm-url]: https://www.npmjs.com/package/rollup-plugin-no-emit
[ci-img]: https://github.com/Arnesfield/rollup-plugin-no-emit/workflows/Node.js%20CI/badge.svg
[ci-url]: https://github.com/Arnesfield/rollup-plugin-no-emit/actions?query=workflow%3A"Node.js+CI"

# rollup-plugin-no-emit

[![npm][npm-img]][npm-url]
[![Node.js CI][ci-img]][ci-url]

A Rollup plugin that skips emit for generated bundles.

## Install

```sh
npm install --save-dev rollup-plugin-no-emit
```

## Usage

```javascript
// ES6
import noEmit from 'rollup-plugin-no-emit';

// CommonJS
const { noEmit } = require('rollup-plugin-no-emit');
```

Use the plugin, example `rollup.config.js`:

```javascript
import noEmit from 'rollup-plugin-no-emit';

export default {
  input: 'src/index.js',
  output: { dir: 'dist' },
  plugins: [noEmit(/* plugin options */)]
};
```

## Options

You can pass an options object to `noEmit` with the following properties:

### emit

Type: `boolean`<br>
Default: `false`

Set to `true` to invalidate plugin and emit files.

### match

Type: `(fileName: string, output: OutputChunk | OutputAsset) => boolean`

Return `true` to skip emit for output file.

In the example below (`rollup.config.js`), the output file `dist/index.js` is emitted while `dist/output.js` is skipped:

```javascript
import noEmit from 'rollup-plugin-no-emit';

export default {
  input: 'src/index.js',
  output: [{ file: 'dist/index.js' }, { file: 'dist/output.js' }],
  plugins: [noEmit({ match: file => file === 'output.js' })]
};
```

## License

Licensed under the [MIT License](LICENSE).
