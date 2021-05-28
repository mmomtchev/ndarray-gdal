const gdal = require('gdal-async');
const ndarray = require('ndarray');
require('../ndarray-gdal')(gdal);
const ops = require('ndarray-ops');
const { assert } = require('chai');

describe('ndarray-gdal', () => {
  describe('readArray', () => {
    let original;
    let ds, band;

    before(() => {
      const ds = gdal.open('test/sample.tif');
      const band = ds.bands.get(1);
      original = band.pixels.read(0, 0, ds.rasterSize.x, ds.rasterSize.y);
    });

    beforeEach(() => {
      ds = gdal.open('test/sample.tif');
      band = ds.bands.get(1);
    });

    afterEach(() => {
      ds.close();
    });

    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.readArray);
    });

    it('should create a new array when needed', () => {
      const nd = band.pixels.readArray({ width: ds.rasterSize.x, height: ds.rasterSize.y });
      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], ds.rasterSize.x);
      assert.equal(nd.stride[1], 1);
      assert.deepEqual(original, nd.data);
    });

    it('should write to a preallocated array', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y), [ ds.rasterSize.y, ds.rasterSize.x ]);
      band.pixels.readArray({ data: nd });
      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], ds.rasterSize.x);
      assert.equal(nd.stride[1], 1);
      assert.deepEqual(original, nd.data);
    });

    it('should support column-major stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y), [ ds.rasterSize.y, ds.rasterSize.x ], [ 1, ds.rasterSize.y ]);
      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });
      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], 1);
      assert.equal(nd.stride[1], ds.rasterSize.y);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

    it('should support row-negative stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y), [ ds.rasterSize.y, ds.rasterSize.x ], [ -ds.rasterSize.x, 1 ]);
      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });
      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], -ds.rasterSize.x);
      assert.equal(nd.stride[1], 1);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

    it('should support column-negative stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y), [ ds.rasterSize.y, ds.rasterSize.x ], [ 1, -ds.rasterSize.y ]);
      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });
      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], 1);
      assert.equal(nd.stride[1], -ds.rasterSize.y);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

  });

  describe('writeArray', () => {

    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.writeArray);
    });

    it('should write data from an ndarray', () => {
      const src = gdal.open('test/sample.tif');
      const dst = gdal.open('temp', 'w', 'MEM', src.rasterSize.x, src.rasterSize.y, 1);
      const original = src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      dst.bands.get(1).pixels.writeArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });
      const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      assert.deepEqual(original.data, res.data);
    });

  });
});
