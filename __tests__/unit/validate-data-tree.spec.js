'use strict';

const validateDataTree = require('../../lib/validate-data-tree');

describe('validateDataTree testing suite', () => {
  it('should run without errors on valid data trees', () => {
    expect(() => validateDataTree(null)).not.toThrow();
    expect(() => validateDataTree(true)).not.toThrow();
    expect(() => validateDataTree(100)).not.toThrow();
    expect(() => validateDataTree('str')).not.toThrow();
    expect(() => validateDataTree({ foo: 'bar' })).not.toThrow();
  });

  it('should return non-object trees', () => {
    expect(validateDataTree(null)).toEqual(null);
    expect(validateDataTree(true)).toEqual(true);
    expect(validateDataTree(false)).toEqual(false);
    expect(validateDataTree(42)).toEqual(42);
    expect(validateDataTree('str')).toEqual('str');
  });

  it('should error when encountering undefined values at any level', () => {
    expect(() => validateDataTree({ value: undefined })).toThrow();
    expect(() => validateDataTree({ nested: { object: { value: undefined } } })).toThrow();
  });

  it('should remove null values from the tree at any level', () => {
    expect(validateDataTree({ type: 'cat', value: null }))
      .toEqual({ type: 'cat' });
    expect(validateDataTree({ nested: { object: { type: 'cat', value: null } } }))
      .toEqual({ nested: { object: { type: 'cat' } } });
  });

  it('should not remove null values when passed doNotStripNull as an option', () => {
    expect(validateDataTree({ type: 'cat', value: null }, { doNotStripNull: true }))
      .toEqual({ type: 'cat', value: null });
    expect(validateDataTree({ nested: { object: { type: 'cat', value: null } } }, { doNotStripNull: true }))
      .toEqual({ nested: { object: { type: 'cat', value: null } } });
  });

  it('should null out empty objects at any level', () => {
    expect(validateDataTree({})).toEqual(null);
    expect(validateDataTree({ value: null })).toEqual(null);
    expect(validateDataTree({ nested: { object: null } })).toEqual(null);
    expect(validateDataTree({ nested: { object: { value: null }, type: 'cat' } })).toEqual({ nested: { type: 'cat' } });
  });

  it('should separate slashed keys into single keys at different levels of the data tree', () => {
    expect(validateDataTree({ 'foo/bar': true })).toEqual({ foo: { bar: true } });
    expect(validateDataTree({ foo: { 'bar/baz': true } })).toEqual({ foo: { bar: { baz: true } } });
    expect(validateDataTree({ 'foo/bar': { 'baz/max': true } })).toEqual({ foo: { bar: { baz: { max: true } } } });
  });
});
