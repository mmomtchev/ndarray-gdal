# ndarray-gdal

Plugin for `gdal-async` that adds support for [`scijs/ndarray`](https://github.com/scijs/ndarray)

# Installation

```bash
npm install --save gdal-async ndarray ndarray-gdal
```

# Usage

```js
const gdal = require('gdal-async');
const ndarray = require('ndarray');
require('ndarray-gdal')(gdal);

const ds = gdal.open('sample.tif');
const band = ds.bands.get(1);

// Creating a new ndarray
const nd1 = band.pixels.readArray({ width: ds.rasterSize.x, height: ds.rasterSize.y });

// Reading into existing ndarray (size can be deduced from the array)
const nd2 = ndarray(new Uint8Array(ds.rasterSize.x * ds.rasterSize.y), [ ds.rasterSize.y, ds.rasterSize.x ]);
band.pixels.readArray({ data: nd2 });

// Writing from an ndarray (size can be deduced from the array)
band.pixels.writeArray({ data: nd2 });
```

Both row-major and column-major strides are supported, but row-major will be significantly faster. Still, it is much faster to use a column-major stride than to manually transpose the resulting array in JS.


# Copyright

Copyright &copy; 2021 [Momtchil Momtchev, @mmomtchev](https://github.com/mmomtchev)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
