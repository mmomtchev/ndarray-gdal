/// <reference types="@stdlib/types"/>
import ndarray from 'ndarray';
import * as stdlib from '@stdlib/types/ndarray';
import * as gdal from 'gdal-async';


declare module 'gdal-async' {

export type ArrayOptions<T extends TypedArray = TypedArray> = {
	data?: ndarray.NdArray<T>|stdlib.ndarray;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	resampling?: string;
	progress_cb?: ProgressCb;
}

export type NDArrayOptions<T extends TypedArray = TypedArray> = {
	data?: ndarray.NdArray<T>|stdlib.ndarray;
	origin?: number[];
	span?: number[];
}

export interface MDArray {
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
  readArray<T extends TypedArray = TypedArray>(options?: NDArrayOptions<T>): ndarray.NdArray<T>

  /**
 * @method readArray
 * @param {NDArrayOptions<TypedArray>} [options]
 * @param {stdlib.ndarray} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @throws {Error}
 * @returns {stdlib.ndarray}
 */
  readArray(options?: NDArrayOptions<TypedArray>): stdlib.ndarray

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
  readArrayAsync<T extends TypedArray = TypedArray>(options?: NDArrayOptions<T>): Promise<ndarray.NdArray<T>>

  /**
 * @method readArrayAsync
 * @param {NDArrayOptions} [options]
 * @param {stdlib.ndarray} [options.data] Existing ndarray to use
 * @param {number[]} [options.origin] [0, ...] if not specified
 * @param {number[]} [options.span] Full size if not specified
 * @returns {Promise<stdlib.ndarray>}
 */
  readArrayAsync(options?: NDArrayOptions): Promise<stdlib.ndarray>
}

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
  readArray<T extends TypedArray = TypedArray>(options?: ArrayOptions<T>): ndarray.NdArray<T>

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
  readArray(options?: ArrayOptions<TypedArray>): stdlib.ndarray

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
  readArrayAsync<T extends TypedArray = TypedArray>(options?: ArrayOptions<T>): Promise<ndarray.NdArray<T>>

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
  readArrayAsync(options?: ArrayOptions<TypedArray>): Promise<stdlib.ndarray>

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
 * @param {ndarray.NdArray<TypedArray>|stdlib.ndarray} options.data
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
