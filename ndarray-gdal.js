
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
 * @typedef ArrayOptions { data?: ndarray.NdArray, y?: number,  width?: number, height?: number }
 */


/**
 * Read the selected region into the given ndarray or a new ndarray
 *
 * @method readArray
 * @param {ArrayOptions} [options]
 * @param {ndarray.NdArray} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @returns {ndarray.NdArray}
 */
function readArray(opts) {
  let { data, x, y, width, height } = opts || {};
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
    offset: data.offset
  });

  return data;
}

/**
 * Write the selected region from the given ndarray
 *
 * @method writeArray
 * @param {ArrayOptions} options
 * @param {ndarray.NdArray} options.data
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @returns {void}
 */
function writeArray(opts) {
  let { data, x, y, width, height } = opts || {};

  if (!data || !data.stride) {
    throw new TypeError('data must be an \'ndarray\'');
  }

  if (data.shape.length != 2) {
    throw new RangeError('data must have exactly 2 dimensions');
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
    offset: data.offset
  });

  return data;
}

gdal.RasterBandPixels.prototype.readArray = readArray;
gdal.RasterBandPixels.prototype.writeArray = writeArray;
