import Mocha from 'mocha';
import { dirname, join } from 'path';
import rimraf from 'rimraf';

function remove(file) {
  return new Promise((resolve, reject) => {
    rimraf(file, error => (error ? reject(error) : resolve()));
  });
}

export default function mocha() {
  /** @type {string[]} */
  let files = [];

  async function runTest() {
    const mocha = new Mocha();
    // enables rerunning tests in watch mode
    // NOTE: taken from https://github.com/mochajs/mocha/issues/995#issuecomment-365441585
    mocha.suite.on('require', (_, file) => {
      delete require.cache[file];
    });

    // copy file names for this call
    const testFiles = Array.from(files);
    for (const file of testFiles) {
      mocha.addFile(file);
    }

    try {
      await new Promise((resolve, reject) => {
        const runner = mocha.run().on('end', () => {
          const { failures } = runner;
          if (failures === 0) {
            return resolve();
          }
          reject(new Error(`Tests failed: ${failures}`));
        });
      });
    } finally {
      // remove generated files
      await Promise.all(testFiles.map(file => remove(file)));
    }
  }

  return {
    name: 'mocha',
    buildStart() {
      files = [];
    },
    generateBundle(opts, bundle) {
      /** @type {string} */
      const dir = opts.dir || dirname(opts.file);
      const names = Object.keys(bundle).map(file => join(dir, file));
      files.push(...names);
    },
    closeBundle: runTest
  };
}
