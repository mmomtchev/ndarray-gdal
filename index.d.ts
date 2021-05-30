import ndarray from 'ndarray'

declare module 'gdal-async' {

export type ArrayOptions = { data?: ndarray.NdArray, x?: number, y?: number,  width?: number, height?: number, resampling?: string, progress_cb?: ProgressCb  }

export interface RasterBandPixels {
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
 * @throws {Error}
 * @returns {ndarray.NdArray<2>}
 */
  readArray(options?: ArrayOptions): ndarray.NdArray<2>

  /**
 * Read the selection region into the given ndarray or a new ndarray, async version.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the full size of the raster data.
 * If an existing array if passed in data, it would be used keeping its current stride.
 * If the array has a different size than the selection region, the data will be resampled.
 * The resampling algorithm can be specified in resampling, otherwise GDAL's default one will be used.
 * If no array is specified, a new array of [width, height] size with a default
 * positive/positive row-major stride will be allocated.
 *
 * @method readArrayAsync
 * @param {ArrayOptions} [options]
 * @param {ndarray.NdArray<2>} [options.data]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.resampling]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {Promise<ndarray.NdArray<2>>}
 */
  readArrayAsync(options?: ArrayOptions): Promise<ndarray.NdArray<2>>

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
 * @throws {Error}
 * @returns {void}
 */
  writeArray(options: ArrayOptions): void

  /**
 * Write the selection region from the given ndarray, async version.
 *
 * x, y specify the origin of the selection region and width and height specify its size.
 * [x, y] default to [0, 0], [width, height] default to the size of the array.
 * Resampling when writing is not supported by GDAL.
 *
 * @method writeArrayAsync
 * @param {ArrayOptions} options
 * @param {ndarray.NdArray<2>} options.data
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {ProgressCb} [options.progress_cb]
 * @returns {Promise<void>}
 */
  writeArrayAsync(options: ArrayOptions): Promise<void>
}

}
