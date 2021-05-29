const gdal = require('gdal-async');
require('../ndarray-gdal');
const { assert } = require('chai');

describe('ndarray-gdal JS', () => {
  describe('readArray', () => {
    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.readArray);
    });
  });

  describe('writeArray', () => {
    it('should exist', () => {
      assert.isFunction(gdal.RasterBandPixels.prototype.writeArray);
    });
  });
});
