# rollup-plugin-no-emit

[![npm](https://img.shields.io/npm/v/rollup-plugin-no-emit.svg)](https://www.npmjs.com/package/rollup-plugin-no-emit)

A Rollup plugin that skips emit for generated bundles.

## Install

```sh
npm install --save-dev rollup-plugin-no-emit
```

## Usage

Use the module.

```javascript
// ES6
import noEmit from 'rollup-plugin-no-emit';

// CommonJS
const noEmit = require('rollup-plugin-no-emit').default;
```

Example:

```javascript
// rollup.config.js
import noEmit from 'rollup-plugin-no-emit';

export default {
  input: 'src/index.js',
  output: { dir: 'lib' },
  plugins: [noEmit()]
};
```

### Plugin Options

You can pass an options object to `noEmit` with the following properties:

```typescript
interface RollupNoEmitOptions {
  /**
   * Set to `true` to invalidate plugin and emit files.
   */
  emit?: boolean;
  /**
   * Match output file name to skip emit.
   * @param fileName The output bundle file name to match.
   * @returns Determines if the file name will be skipped or not.
   */
  match?(fileName: string): boolean;
}
```

In the example below, output file `lib/index.js` is emitted while `lib/output.js` is skipped:

```javascript
// rollup.config.js
import noEmit from 'rollup-plugin-no-emit';

export default {
  input: 'src/index.js',
  output: [{ file: 'lib/index.js' }, { file: 'lib/output.js' }],
  plugins: [noEmit({ match: file => file === 'output.js' })]
};
```

## License

Licensed under the [MIT License](LICENSE).
