
const ndarray = require('ndarray');
const gdal = require('gdal-async');

const gdal_async_version = require('gdal-async/package.json').version.split('.');
if (gdal_async_version[0] < 3 ||
  gdal_async_version[0] == 3 && gdal_async_version[1] < 2 ||
  gdal_async_version[0] == 3 && gdal_async_version[1] == 2 && gdal_async_version[2] < 99) {
  throw new Error(`ndarray-gdal requires gdal-async@3.2.99 or later, ${gdal_async_version.join('.')} found`);
}

const toGDALDataType = {
  int16: gdal.GDT_Int16,
  int32: gdal.GDT_Int32,
  uint8: gdal.GDT_Byte,
  uint16: gdal.GDT_UInt16,
  uint32: gdal.GDT_UInt32,
  float32: gdal.GDT_Float32,
  float64: gdal.GDT_Float64
};

const fromGDALDataType = {};
fromGDALDataType[gdal.GDT_Int16] = Int16Array;
fromGDALDataType[gdal.GDT_Int32] = Int32Array;
fromGDALDataType[gdal.GDT_Byte] = Uint8Array;
fromGDALDataType[gdal.GDT_UInt16] = Uint16Array;
fromGDALDataType[gdal.GDT_UInt32] = Uint32Array;
fromGDALDataType[gdal.GDT_Float32] = Float32Array;
fromGDALDataType[gdal.GDT_Float64] = Float64Array;

/**
 * @typedef ArrayOptions { data?: ndarray.NdArray, x?: number, y?: number,  width?: number, height?: number, resampling?: string, progress_cb?: ProgressCb  }
 */

/**
 *
 * @class RasterBandPixels
 *
 * These functions are an augmentation of the gdal class gdal.RasterBandPixels
 */


/**
 * Read the selection region into the given ndarray or a new ndarray.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the full size of the raster data.
 * If an existing array if passed in data, it would be used keeping its current stride.
 * If the array has a different size than the selection region, the data will be resampled.
 * The resampling algorithm can be specified in resampling, otherwise GDAL's default one will be used.
 * If no array is specified, a new array of [width, height] size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArray
 * @param {ArrayOptions} [options]
 * @param {ndarray.NdArray<2>} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {ndarray.NdArray<2>}
 */
function readArray(opts) {
  let { data, x, y, width, height, resampling, progress_cb } = opts || {};
  if (!y) y = 0;
  if (!x) x = 0;
  if (!height) height = this.band.size.y;
  if (!width) width = this.band.size.x;

  if (!data) {
    data = ndarray(new fromGDALDataType[this.band.dataType](height * width), [ height, width ]);
  }

  if (!data.stride) {
    throw new TypeError('data must be an \'ndarray\'');
  }

  if (data.shape.length != 2) {
    throw new RangeError('data must have exactly 2 dimensions');
  }

  if (!height) height = data.shape[0];
  if (!width) width = data.shape[1];

  const gdalType = toGDALDataType[data.dtype];
  if (!gdalType) {
    throw new TypeError(`Type ${data.dtype} is not supported by GDAL`);
  }

  this.read(x, y, width, height, data.data, {
    buffer_height: data.shape[0],
    buffer_width: data.shape[1],
    data_type: gdalType,
    pixel_space: data.stride[1] * data.data.BYTES_PER_ELEMENT,
    line_space: data.stride[0] * data.data.BYTES_PER_ELEMENT,
    offset: data.offset,
    resampling,
    progress_cb
  });

  return data;
}

/**
 * Write the selection region from the given ndarray.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the size of the array.
 * Resampling when writing is not supported by GDAL.
 *
 * @method writeArray
 * @param {ArrayOptions} options
 * @param {ndarray.NdArray<2>} options.data
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {void}
 */
function writeArray(opts) {
  let { data, x, y, width, height, resampling, progress_cb } = opts || {};

  if (!data || !data.stride) {
    throw new TypeError('data must be an \'ndarray\'');
  }

  if (data.shape.length != 2) {
    throw new RangeError('data must have exactly 2 dimensions');
  }

  if (resampling) {
    throw new Error('resampling when writing is not supported');
  }

  if (!y) y = 0;
  if (!x) x = 0;
  if (!height) height = data.shape[0];
  if (!width) width = data.shape[1];

  const gdalType = toGDALDataType[data.dtype];
  if (!gdalType) {
    throw new TypeError(`Type ${data.dtype} is not supported by GDAL`);
  }

  this.write(x, y, width, height, data.data, {
    buffer_height: data.shape[0],
    buffer_width: data.shape[1],
    data_type: gdalType,
    pixel_space: data.stride[1] * data.data.BYTES_PER_ELEMENT,
    line_space: data.stride[0] * data.data.BYTES_PER_ELEMENT,
    offset: data.offset,
    progress_cb
  });

  return data;
}

gdal.RasterBandPixels.prototype.readArray = readArray;
gdal.RasterBandPixels.prototype.writeArray = writeArray;
