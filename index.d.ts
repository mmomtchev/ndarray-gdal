import ndarray from 'ndarray';

declare module 'gdal-async' {

export interface ArrayOptions {
  data?: ndarray.NdArray<2>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface RasterBandPixels {
    /**
     * Read the selected region into the given ndarray or a new ndarray
     *
     * @method readArray
     * @param {ArrayOptions} options
     * @param {ndarray.NdArray<2>} [options.data]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @returns {ndarray.NdArray}
     */
    readArray(opt: ArrayOptions) : ndarray.NdArray<2>;

    /**
     * Write the selected region from the given ndarray
     *
     * @method writeArray
     * @param {ArrayOptions} options
     * @param {ndarray.NdArray} [options.data]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @returns {void}
     */
    writeArray(opt: ArrayOptions) : ndarray.NdArray<2>;
  }

}
