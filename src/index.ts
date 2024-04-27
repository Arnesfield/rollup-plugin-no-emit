import { OutputBundle, Plugin } from 'rollup';

/** The plugin options. */
export interface Options {
  /** Set to `true` to invalidate plugin and emit files. */
  emit?: boolean;
  /**
   * Return `true` to skip emit for output file.
   * @param fileName The output bundle file name to match.
   * @param output The Rollup output chunk or asset.
   * @returns Determines if the output file will be skipped or not.
   */
  match?(fileName: string, output: OutputBundle[keyof OutputBundle]): boolean;
}

/** @deprecated since v1.2.0. Use {@linkcode Options} instead. */
export type RollupNoEmitOptions = Options;

/**
 * Skip emit for generated bundles.
 * @param options The plugin options.
 * @returns The plugin.
 */
export function noEmit(options: Options = {}): Plugin {
  const { emit, match } = options;
  const skipMatch = typeof match !== 'function';
  return {
    name: 'no-emit',
    generateBundle(_, bundle) {
      if (emit) {
        return;
      }
      for (const file in bundle) {
        if (skipMatch || match(file, bundle[file])) {
          delete bundle[file];
        }
      }
    }
  };
}

export default noEmit;
