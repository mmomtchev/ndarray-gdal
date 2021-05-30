# ndarray-gdal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/ndarray-gdal)](https://www.npmjs.com/package/ndarray-gdal)
![Node.js CI](https://github.com/mmomtchev/ndarray-gdal/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/mmomtchev/ndarray-gdal/branch/master/graph/badge.svg?token=UhQePZnXkt)](https://codecov.io/gh/mmomtchev/ndarray-gdal)

Plugin for [`gdal-async`](https://github.com/mmomtchev/node-gdal-async) allowing zero-copy I/O from and to [`scijs/ndarray`](https://github.com/scijs/ndarray).

This module requires at least `gdal-async@3.2.99`.

# Installation

```bash
npm install --save gdal-async ndarray ndarray-gdal
```

# Usage

```js
const gdal = require('gdal-async');
const ndarray = require('ndarray');
require('ndarray-gdal');

const ds = gdal.open('test/sample.tif');
const band = ds.bands.get(1);

// Creating a new ndarray
const nd1 = band.pixels.readArray({ width: ds.rasterSize.x, height: ds.rasterSize.y });

// Reading into existing ndarray with a non-default stride
const nd2 = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y),
                    [ ds.rasterSize.y, ds.rasterSize.x ], [ ds.rasterSize.x, -1 ]);
// read the whole raster band fitting it in the array, resampling if needed
band.pixels.readArray({ data: nd2 });

// Writing from an ndarray (size can be deduced from the array)
band.pixels.writeArray({ data: nd2 });
```

I/O from and to all strides is supported without copying/rotation, but positive/positive row-major stride will be the fastest as it is usually the one that matches the file format. Interleaving is provided by the GDAL C++ implementation which uses SIMD instructions on CPUs that support it.

## TypeScript

TypeScript is supported via a module augmentation definition file.

```sh
npm install --save @types/ndarray
```

```ts
import * as gdal from 'gdal-async';
import ndarray from 'ndarray';
import 'ndarray-gdal';

const ds: gdal.Dataset = gdal.open('test/sample.tif');
const nd: ndarray.NdArray<2> = ds.bands.get(1).pixels.readArray({
                width: ds.rasterSize.x, 
                height: ds.rasterSize.y });
```

## Asynchronous I/O

Same rules for asynchronous I/O as `gdal-async` apply, you should refer to its documentation.

```js
const nd = await gdal.openAsync('test/sample.tif')
            .then((ds) => ds.bands.getAsync(1))
            .then((band) => band.pixels.readArrayAsync())
            .catch((e) => console.error(`bad things happened ${e}`));
```

# Copyright

Copyright &copy; 2021 [Momtchil Momtchev, @mmomtchev](https://github.com/mmomtchev)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
