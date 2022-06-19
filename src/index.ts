import { Plugin } from 'rollup';

/**
 * Rollup no emit plugin options.
 */
export interface RollupNoEmitOptions {
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

/**
 * Skip emit for generated bundles.
 * @param options The plugin options.
 * @returns The plugin.
 */
export default function noEmit(options: RollupNoEmitOptions = {}): Plugin {
  return {
    name: 'no-emit',
    generateBundle(_, bundle) {
      if (options.emit) {
        return;
      }
      const { match } = options;
      for (const file in bundle) {
        if (typeof match !== 'function' || match(file)) {
          delete bundle[file];
        }
      }
    }
  };
}
