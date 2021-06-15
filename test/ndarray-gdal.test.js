const gdal = require('gdal-async');
require('../ndarray-gdal');
const { assert } = require('chai');

describe('ndarray-gdal JS', () => {
  describe('gdal.RasterBand', () => {
    describe('readArray', () => {
      it('should exist', () => {
        assert.isFunction(gdal.RasterBandPixels.prototype.readArray);
      });
    });

    describe('readArrayAsync', () => {
      it('should exist', () => {
        assert.isFunction(gdal.RasterBandPixels.prototype.readArrayAsync);
      });
    });

    describe('writeArray', () => {
      it('should exist', () => {
        assert.isFunction(gdal.RasterBandPixels.prototype.writeArray);
      });
    });

    describe('writeArrayAsync', () => {
      it('should exist', () => {
        assert.isFunction(gdal.RasterBandPixels.prototype.writeArrayAsync);
      });
    });
  });

  if (gdal.MDArray) {
    describe('gdal.MDArray', () => {
      describe('readArray', () => {
        it('should exist', () => {
          assert.isFunction(gdal.MDArray.prototype.readArray);
        });
      });

      describe('readArrayAsync', () => {
        it('should exist', () => {
          assert.isFunction(gdal.MDArray.prototype.readArrayAsync);
        });
      });
    });
  }
});
