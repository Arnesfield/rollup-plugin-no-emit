import { expect } from 'chai';
import path from 'path';
import { rimraf } from 'rimraf';
import { RollupOptions, rollup } from 'rollup';
import noEmit from '../src';

function file(value: string) {
  return path.relative(process.cwd(), path.resolve(__dirname, value));
}

const files = {
  add: file('fixtures/add.js'),
  index: file('fixtures/index.js'),
  tmp: file('fixtures/tmp')
};

async function bundle(options: RollupOptions) {
  const build = await rollup(options);
  const outputOptions = Array.isArray(options.output)
    ? options.output
    : options.output
    ? [options.output]
    : [];
  const outputs = await Promise.all(
    outputOptions.map(async output => {
      await build.generate(output);
      return build.write(output);
    })
  );
  return outputs.flatMap(output => output.output);
}

// remove tmp dir after build.write()
afterEach(async () => {
  await rimraf(file('fixtures/tmp'));
});

describe('noEmit', () => {
  it('should be a function', () => {
    expect(noEmit).to.be.a('function');
  });

  it('should return an object (plugin)', () => {
    const plugin = noEmit();
    expect(plugin).to.be.an('object');
    expect(plugin).to.have.property('name').that.equals('no-emit');
    expect(plugin).to.have.property('generateBundle').which.is.a('function');
  });

  it('should clear output bundle', async () => {
    const options = {
      input: files.index,
      output: [
        { dir: files.tmp },
        { dir: `${files.tmp}/dir1` },
        { dir: `${files.tmp}/dir2` }
      ]
    } satisfies RollupOptions;
    const outputs1 = await bundle(options);
    expect(outputs1).to.have.length(options.output.length);

    const outputs2 = await bundle({ ...options, plugins: [noEmit()] });
    expect(outputs2).to.have.length(0);
  });
});

describe('options', () => {
  describe('match', () => {
    it('should filter output bundle', async () => {
      const options: RollupOptions = {
        input: { index: files.index, add: files.add },
        output: { dir: files.tmp }
      };
      const outputs1 = await bundle(options);
      expect(outputs1).to.have.length(2);

      const indexName = path.basename(files.index);
      const outputs2 = await bundle({
        ...options,
        plugins: [
          noEmit({
            match(file, output) {
              expect(file).to.be.a('string');
              expect(output).to.be.an('object');
              return file === indexName;
            }
          })
        ]
      });
      expect(outputs2).to.have.length(1);
    });
  });

  describe('emit', () => {
    it('should invalidate plugin when `true`', async () => {
      const options: RollupOptions = {
        input: files.index,
        output: { dir: files.tmp }
      };
      const outputs1 = await bundle({
        ...options,
        plugins: [noEmit({ emit: false })]
      });
      expect(outputs1).to.have.length(0);

      const outputs2 = await bundle({
        ...options,
        plugins: [noEmit({ emit: true })]
      });
      expect(outputs2).to.not.have.length(0);
    });

    it('should avoid calling `match` when `true`', async () => {
      const options: RollupOptions = {
        input: files.index,
        output: { dir: files.tmp }
      };
      let callCount = 0;
      const match = () => {
        callCount++;
        return true;
      };
      await bundle({ ...options, plugins: [noEmit({ emit: false, match })] });
      expect(callCount).to.be.greaterThan(0);

      callCount = 0;
      await bundle({ ...options, plugins: [noEmit({ emit: true, match })] });
      expect(callCount).to.equal(0);
    });
  });
});
