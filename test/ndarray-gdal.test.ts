import * as gdal from 'gdal-async';
import ndarray from 'ndarray';
import '..';
import ops from 'ndarray-ops';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('ndarray-gdal TS', () => {
  describe('readArray', () => {
    let original: gdal.TypedArray;
    let ds: gdal.Dataset, band: gdal.RasterBand;

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

    it('should guess the size with no arguments', () => {
      const nd = band.pixels.readArray();

      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], ds.rasterSize.x);
      assert.equal(nd.stride[1], 1);
      assert.deepEqual(original, nd.data);
    });

    it('should support column-major stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y),
        [ ds.rasterSize.y, ds.rasterSize.x ], [ 1, ds.rasterSize.y ]);

      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });

      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], 1);
      assert.equal(nd.stride[1], ds.rasterSize.y);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

    it('should support row-negative stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y),
        [ ds.rasterSize.y, ds.rasterSize.x ], [ -ds.rasterSize.x, 1 ]);

      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });

      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], -ds.rasterSize.x);
      assert.equal(nd.stride[1], 1);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

    it('should support column-negative stride', () => {
      const nd = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y),
        [ ds.rasterSize.y, ds.rasterSize.x ], [ 1, -ds.rasterSize.y ]);

      band.pixels.readArray({ data: nd, width: ds.rasterSize.x, height: ds.rasterSize.y });

      assert.equal(nd.shape[0], ds.rasterSize.y);
      assert.equal(nd.shape[1], ds.rasterSize.x);
      assert.equal(nd.stride[0], 1);
      assert.equal(nd.stride[1], -ds.rasterSize.y);
      assert.isTrue(ops.equals(nd, ndarray(original, [ ds.rasterSize.y, ds.rasterSize.x ])));
    });

    it('should support partial reads', () => {
      // The top left quadrant of sample.tif is all zeros
      const w = 16, h = 12;
      const nd = ndarray(new Uint8Array(w*h), [ h, w ]);

      band.pixels.readArray({ data: nd, x: 0, y: 0, width: w, height: h });

      assert.equal(nd.shape[0], h);
      assert.equal(nd.shape[1], w);
      assert.equal(nd.stride[0], w);
      assert.equal(nd.stride[1], 1);
      const zero = ndarray(new Uint8Array(w*h), [ h, w ]);
      ops.assigns(zero, 0);
      assert.isTrue(ops.equals(nd, zero));
    });

    it('should resample on the fly if data cannot hold all the data', () => {
      // But the rest is not
      const w = 16, h = 12;
      const nd = ndarray(new Uint8Array(w*h), [ h, w ]);

      band.pixels.readArray({ data: nd });

      assert.equal(nd.shape[0], 12);
      assert.equal(nd.shape[1], 16);
      assert.equal(nd.stride[0], 16);
      assert.equal(nd.stride[1], 1);
      const zero = ndarray(new Uint8Array(w*h), [ h, w ]);
      ops.assigns(zero, 0);
      assert.isFalse(ops.equals(nd, zero));
    });

    it('should throw when data is not an ndarray', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assert.throws(() => band.pixels.readArray({ data: {} as any }), /data must be/);
    });
    it('should throw when ndarray doesn\'t have 2 dimensions', () => {
      assert.throws(() => band.pixels.readArray({ data: ndarray(new Uint8Array(1), [ 1 ]) }), /2 dimensions/);
    });
    it('should throw when the datatype is not supported', () => {
      assert.throws(() => band.pixels.readArray({ data: ndarray(new Int8Array(4), [ 2, 2 ]) }), /Type.*not supported/);
    });
  });

  describe('readArrayAsync', () => {
    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.readArrayAsync);
    });

    it('should support async reading of ndarray', () => {
      const ds = gdal.open('test/sample.tif');
      const band = ds.bands.get(1);
      const original = band.pixels.read(0, 0, ds.rasterSize.x, ds.rasterSize.y);
      const ndq = band.pixels.readArrayAsync();
      return assert.isFulfilled(ndq.then((nd) => assert.deepEqual(original, nd.data)));
    });

    it('should return a rejected Promise instead of throwing on error', () =>
      assert.isRejected(gdal.open('test/sample.tif').bands.get(1).pixels.readArrayAsync({
        data: ndarray(new Uint8Array(1), [ 1 ]) }),
      /2 dimensions/)
    );
  });

  describe('writeArray', () => {
    let src, dst;

    beforeEach(() => {
      src = gdal.open('test/sample.tif');
      dst = gdal.open('temp', 'w', 'MEM', src.rasterSize.x, src.rasterSize.y, 1);
    });

    afterEach(() => {
      dst.close();
      src.close();
    });

    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.writeArray);
    });

    it('should write data from an ndarray', () => {
      const original = src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });

      dst.bands.get(1).pixels.writeArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      assert.deepEqual(original.data, res.data);
    });

    it('should write data from an ndarray w/column-major stride', () => {
      const original = ndarray(new Uint8Array(src.rasterSize.x * src.rasterSize.y),
        [ dst.rasterSize.y, dst.rasterSize.x ], [ 1, dst.rasterSize.y ]);
      src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      dst.bands.get(1).pixels.writeArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      assert.isTrue(ops.equals(res, original));
    });

    it('should write data from an ndarray w/row-negative stride', () => {
      const original = ndarray(new Uint8Array(src.rasterSize.x * src.rasterSize.y),
        [ dst.rasterSize.y, dst.rasterSize.x ], [ -dst.rasterSize.x, 1 ]);
      src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      dst.bands.get(1).pixels.writeArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      assert.isTrue(ops.equals(res, original));
    });

    it('should write data from an ndarray w/column-negative stride', () => {
      const original = ndarray(new Uint8Array(src.rasterSize.x * src.rasterSize.y),
        [ dst.rasterSize.y, dst.rasterSize.x ], [ 1, -dst.rasterSize.y ]);
      src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      dst.bands.get(1).pixels.writeArray({ width: src.rasterSize.x, height: src.rasterSize.y, data: original });

      const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
      assert.isTrue(ops.equals(res, original));
    });

    it('should throw when data is not an ndarray', () => {
      assert.throws(() => src.bands.get(1).pixels.writeArray({
        data: {} }),
      /data must be/);
    });
    it('should throw when ndarray doesn\'t have 2 dimensions', () => {
      assert.throws(() => src.bands.get(1).pixels.writeArray({
        data: ndarray(new Uint8Array(1), [ 1 ]) }),
      /2 dimensions/);
    });
    it('should throw when the datatype is not supported', () => {
      assert.throws(() => src.bands.get(1).pixels.writeArray({
        data: ndarray(new Int8Array(4), [ 2, 2 ]) }),
      /Type.*not supported/);
    });
    it('should throw if a resampling method is specified', () => {
      assert.throws(() => src.bands.get(1).pixels.writeArray({
        data: ndarray(new Uint8Array(4), [ 2, 2 ]),
        resampling: gdal.GRA_Bilinear }),
      /resampling.*not supported/);
    });

  });

  describe('writeArrayAsync', () => {
    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.writeArrayAsync);
    });

    it('should support async reading of ndarray', () => {
      const src = gdal.open('test/sample.tif');
      const dst = gdal.open('temp', 'w', 'MEM', src.rasterSize.x, src.rasterSize.y, 1);
      const original = src.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });

      const q = dst.bands.get(1).pixels.writeArrayAsync({
        width: src.rasterSize.x,
        height: src.rasterSize.y,
        data: original });

      return assert.isFulfilled(q.then(() => {
        const res = dst.bands.get(1).pixels.readArray({ width: src.rasterSize.x, height: src.rasterSize.y });
        assert.deepEqual(original.data, res.data);
      }));
    });

    it('should return a rejected Promise instead of throwing on error', () =>
      assert.isRejected(gdal.open('test/sample.tif').bands.get(1).pixels.writeArrayAsync({
        data: ndarray(new Uint8Array(4), [ 2, 2 ]),
        resampling: gdal.GRA_Bilinear }),
      /resampling.*not supported/)
    );

  });

});
