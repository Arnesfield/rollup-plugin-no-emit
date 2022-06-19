import { assert } from 'chai';
import { OutputBundle, OutputChunk, Plugin } from 'rollup';
import noEmit from '../src';

function mock(...keys: string[]) {
  const bundle: OutputBundle = {};
  for (const key of keys) {
    bundle[key] = {} as OutputChunk;
  }
  const run = (plugin: Plugin) => {
    (plugin.generateBundle as any)({}, bundle, false);
  };
  return { bundle, run };
}

describe('noEmit', () => {
  it('should be a function', () => {
    assert.typeOf(noEmit, 'function');
  });

  it('should return an object', () => {
    const emit = noEmit();
    assert.isObject(emit);
    assert.equal(emit.name, 'no-emit');
    assert.isFunction(emit.generateBundle);
  });

  it('should clear output bundle', () => {
    const { bundle, run } = mock('index');
    assert.lengthOf(Object.keys(bundle), 1);
    run(noEmit());
    assert.isEmpty(bundle);
  });
});

describe('options.match', () => {
  it('should conditionally clear output bundle', () => {
    const match = 'file';
    const { bundle, run } = mock('index', match);
    assert.lengthOf(Object.keys(bundle), 2);

    run(noEmit({ match: file => file === match }));
    assert.lengthOf(Object.keys(bundle), 1);
  });
});

describe('options.emit', () => {
  it('should invalidate plugin when `true`', () => {
    const { bundle, run } = mock('index', 'file');
    assert.lengthOf(Object.keys(bundle), 2);

    run(noEmit({ emit: true }));
    assert.lengthOf(Object.keys(bundle), 2);

    run(noEmit({ emit: true, match: file => file === 'index' }));
    assert.lengthOf(Object.keys(bundle), 2);
  });
});
