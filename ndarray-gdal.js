
const ndarray = require('ndarray');
const gdal = require('gdal-async');

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
fromGDALDataType[gdal.GDT_Int16] = 'int16';
fromGDALDataType[gdal.GDT_Int32] = 'int32';
fromGDALDataType[gdal.GDT_Byte] = 'uint8';
fromGDALDataType[gdal.GDT_UInt16] = 'uint16';
fromGDALDataType[gdal.GDT_UInt32] = 'uint32';
fromGDALDataType[gdal.GDT_Float32] = 'float32';
fromGDALDataType[gdal.GDT_Float64] = 'float64';


function setup(gdal) {
  /**
   * Read the selection region into the given ndarray or a new ndarray
   *
   * @method readArray
   * @param {object} options
   * @param {ndarray=} options.data
   * @param {number=} options.x
   * @param {number=} options.y
   * @param {number=} options.width
   * @param {number=} options.height
   * @returns {ndarray}
   */
  function readArray({ data, x, y, width, height }) {
    if (!y) y = 0;
    if (!x) x = 0;

    if (!data) {
      if (!height || !width) {
        throw new TypeError('without data, width and height are mandatory');
      }
      const ta = this.read(x, y, width, height);
      const nd = ndarray(ta, [ height, width ]);
      return nd;
    }

    if (!data.stride) {
      throw new TypeError('data must be an \'ndarray\'');
    }

    if (data.shape.length != 2) {
      throw new RangeError('data must have exacly 2 dimensions');
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
      line_space: data.stride[0] * data.data.BYTES_PER_ELEMENT
    });

    return data;
  }

  /**
   * Write the selection region from the given ndarray
   *
   * @method readArray
   * @param {object} options
   * @param {ndarray=} options.data
   * @param {number=} options.x
   * @param {number=} options.y
   * @param {number=} options.width
   * @param {number=} options.height
   * @returns {void}
   */
  function writeArray({ data, x, y, width, height }) {
    if (!data || !data.stride) {
      throw new TypeError('data must be an \'ndarray\'');
    }

    if (data.shape.length != 2) {
      throw new RangeError('data must have exacly 2 dimensions');
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
      line_space: data.stride[0] * data.data.BYTES_PER_ELEMENT
    });

    return data;
  }

  gdal.RasterBandPixels.prototype.readArray = readArray;
  gdal.RasterBandPixels.prototype.writeArray = writeArray;
}

module.exports = setup;
