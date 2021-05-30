const gdal = require('gdal-async');
require('../ndarray-gdal');

(async () => {
  const nd = await gdal.openAsync('test/sample.tif')
            .then((ds) => ds.bands.getAsync(1))
            .then((band) => band.pixels.readArrayAsync())
            .catch((e) => console.error(`bad things happened ${e}`));
  console.log(nd);
})()