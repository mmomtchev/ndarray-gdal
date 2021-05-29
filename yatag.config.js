module.exports = {
  include: [ 'ndarray-gdal.js' ],
  output: 'index.d.ts',
  filter: (name) => !name.match(/options\./g),
  header: 'import ndarray from \'ndarray\'',
  augmentation: 'gdal-async'
};
