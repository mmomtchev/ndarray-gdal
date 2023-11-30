
const ndarray = require('ndarray');
const gdal = require('gdal-async');

const gdal_async_version = require('gdal-async/package.json').version.split('.');
if (gdal_async_version[0] < 3 ||
  gdal_async_version[0] == 3 && gdal_async_version[1] < 3) {
  throw new Error(`ndarray-gdal requires gdal-async@3.3.0 or later, ${gdal_async_version.join('.')} found`);
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

const stride = (obj) => obj.stride || obj.strides;

/**
 * @typedef ArrayOptions<T extends TypedArray = TypedArray>
 * @property {ndarray.NdArray<T>|stdlib.ndarray} [data]
 * @property {number} [x]
 * @property {number} [y]
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [resampling]
 * @property {ProgressCb} [progress_cb]
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
 * If no array is specified, a new scijs/ndarray of [width, height] size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArray<T extends TypedArray = TypedArray>
 * @param {ArrayOptions<T>} [options]
 * @param {ndarray.NdArray<T>} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @throws {Error}
 * @returns {ndarray.NdArray<T>}
 */

/**
 * @method readArray
 * @param {ArrayOptions<TypedArray>} [options]
 * @param {stdlib.ndarray} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @throws {Error}
 * @returns {stdlib.ndarray}
 */

/**
 * Read the selection region into the given ndarray or a new ndarray, async version.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the full size of the raster data.
 * If an existing array if passed in data, it would be used keeping its current stride.
 * If the array has a different size than the selection region, the data will be resampled.
 * The resampling algorithm can be specified in resampling, otherwise GDAL's default one will be used.
 * If no array is specified, a new scijs/ndarray of [width, height] size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArrayAsync<T extends TypedArray = TypedArray>
 * @param {ArrayOptions<T>} [options]
 * @param {ndarray.NdArray<T>} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {Promise<ndarray.NdArray<T>>}
 */

/**
 * @method readArrayAsync
 * @param {ArrayOptions<TypedArray>} [options]
 * @param {stdlib.ndarray} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {Promise<stdlib.ndarray>}
 */

const makeBandReadArray = (fn) => function readArray(opts) {
  let { data, x, y, width, height, resampling, progress_cb } = opts || {};
  if (!y) y = 0;
  if (!x) x = 0;
  if (!height) height = this.band.size.y;
  if (!width) width = this.band.size.x;

  if (!data) {
    data = ndarray(new fromGDALDataType[this.band.dataType](height * width), [ height, width ]);
  }

  if (!stride(data)) {
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

  const r = fn.call(this, x, y, width, height, data.data, {
    buffer_height: data.shape[0],
    buffer_width: data.shape[1],
    data_type: gdalType,
    pixel_space: stride(data)[1] * data.data.BYTES_PER_ELEMENT,
    line_space: stride(data)[0] * data.data.BYTES_PER_ELEMENT,
    offset: data.offset,
    resampling,
    progress_cb
  });

  if (typeof r.then === 'function') {
    return r.then(() => data);
  }
  return data;
};

/**
 * Write the selection region from the given ndarray.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the size of the array.
 * Resampling when writing is not supported by GDAL.
 *
 * @method writeArray
 * @param {ArrayOptions} options
 * @param {ndarray.NdArray<TypedArray>|stdlib.ndarray} options.data
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {ProgressCb} [options.progress_cb]
 * @throws {Error}
 * @returns {void}
 */

/**
 * Write the selection region from the given ndarray, async version.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the size of the array.
 * Resampling when writing is not supported by GDAL.
 *
 * @method writeArrayAsync
 * @param {ArrayOptions} options
 * @param {ndarray.NdArray<TypedArray>|stdlib.ndarray} options.data
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {Promise<void>}
 */
const makeBandWriteArray = (fn) => function writeArray(opts) {
  let { data, x, y, width, height, resampling, progress_cb } = opts || {};

  if (!data || !stride(data)) {
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

  return fn.call(this, x, y, width, height, data.data, {
    buffer_height: data.shape[0],
    buffer_width: data.shape[1],
    data_type: gdalType,
    pixel_space: stride(data)[1] * data.data.BYTES_PER_ELEMENT,
    line_space: stride(data)[0] * data.data.BYTES_PER_ELEMENT,
    offset: data.offset,
    progress_cb
  });
};

/**
 * @typedef NDArrayOptions<T extends TypedArray = TypedArray>
 * @property {ndarray.NdArray<T>|stdlib.ndarray} [data]
 * @property {number[]} [origin]
 * @property {number[]} [span]
 */

/**
 *
 * @class MDArray
 *
 * These functions are an augmentation of the gdal class gdal.RasterBandPixels
 */


/**
 * Read the selection region into the given ndarray or a new ndarray.
 *
 * origin specify the origin of the selection region and width and height specify its size.
 * origin defaults to [0, 0, ...], span defaults to the full size of the raster data.
 * If an existing array if passed in data, it would be used keeping its current stride.
 * If no array is specified, a new array of the full raster size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArray<T extends TypedArray = TypedArray>
 * @param {NDArrayOptions<T>} [options]
 * @param {ndarray.NdArray<T>} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @throws {Error}
 * @returns {ndarray.NdArray<T>}
 */

/**
 * @method readArray
 * @param {NDArrayOptions<TypedArray>} [options]
 * @param {stdlib.ndarray} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @throws {Error}
 * @returns {stdlib.ndarray}
 */
function MDArrayReadArray(opts) {
  let { data, origin, span } = opts || {};

  const dims = this.dimensions.count();
  if (!origin) origin = new Array(dims).fill(0);
  if (!span) span = this.dimensions.map((dim) => dim.size);

  if (!data) {
    data = ndarray(new fromGDALDataType[this.dataType](span.reduce((size, span) => size * span, 1)), span);
  }

  if (!stride(data)) {
    throw new TypeError('data must be an \'ndarray\'');
  }

  if (data.shape.length != dims) {
    throw new RangeError(`data must have exactly ${dims} dimensions`);
  }

  const gdalType = toGDALDataType[data.dtype];
  if (!gdalType) {
    throw new TypeError(`Type ${data.dtype} is not supported by GDAL`);
  }

  this.read({
    data: data.data,
    _offset: data.offset,
    origin,
    span,
    stride: stride(data),
    data_type: gdalType
  });

  return data;
}

/**
 * Read the selection region into the given ndarray or a new ndarray, async version.
 *
 * origin specify the origin of the selection region and width and height specify its size.
 * origin defaults to [0, 0, ...], span defaults to the full size of the raster data.
 * If an existing array if passed in data, it would be used keeping its current stride.
 * If no array is specified, a new array of the full raster size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArrayAsync<T extends TypedArray = TypedArray>
 * @param {NDArrayOptions<T>} [options]
 * @param {ndarray.NdArray<T>} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @returns {Promise<ndarray.NdArray<T>>}
 */

/**
 * @method readArrayAsync
 * @param {NDArrayOptions} [options]
 * @param {stdlib.ndarray} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @returns {Promise<stdlib.ndarray>}
 */
async function MDArrayReadArrayAsync(opts) {
  let { data, origin, span } = opts || {};

  const dims = await this.dimensions.countAsync();
  if (!origin) origin = new Array(dims).fill(0);

  if (!span) {
    span = await Promise.all((() => {
      const result = [];
      for (let i = 0; i < dims; i++) {
        result.push(this.dimensions.getAsync(i).then((dim) => dim.size));
      }
      return result;
    })());
  }

  if (!data) {
    data = ndarray(new fromGDALDataType[this.dataType](span.reduce((size, span) => size * span, 1)), span);
  }

  if (!stride(data)) {
    throw new TypeError('data must be an \'ndarray\'');
  }

  if (data.shape.length != dims) {
    throw new RangeError(`data must have exactly ${dims} dimensions`);
  }

  const gdalType = toGDALDataType[data.dtype];
  if (!gdalType) {
    throw new TypeError(`Type ${data.dtype} is not supported by GDAL`);
  }

  const r = this.readAsync({
    data: data.data,
    _offset: data.offset,
    origin,
    span,
    stride: stride(data),
    data_type: gdalType
  });

  return r.then(() => data);
}

const rejectOnException = (fn) => function (opts) {
  try {
    return fn.call(this, opts);
  } catch (e) {
    return Promise.reject(e);
  }
};

gdal.RasterBandPixels.prototype.readArray = makeBandReadArray(gdal.RasterBandPixels.prototype.read);
gdal.RasterBandPixels.prototype.writeArray = makeBandWriteArray(gdal.RasterBandPixels.prototype.write);
gdal.RasterBandPixels.prototype.readArrayAsync = rejectOnException(makeBandReadArray(gdal.RasterBandPixels.prototype.readAsync));
gdal.RasterBandPixels.prototype.writeArrayAsync = rejectOnException(makeBandWriteArray(gdal.RasterBandPixels.prototype.writeAsync));

if (typeof gdal.MDArray !== 'undefined') {
  gdal.MDArray.prototype.readArray = MDArrayReadArray;
  gdal.MDArray.prototype.readArrayAsync = MDArrayReadArrayAsync;
}
