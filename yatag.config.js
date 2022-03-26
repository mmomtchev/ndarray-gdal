module.exports = {
  include: [ 'ndarray-gdal.js' ],
  output: 'index.d.ts',
  filter: (name) => !name.match(/options\./g),
  header: 'import ndarray from \'ndarray\';\nimport * as stdlib from \'@stdlib/types/ndarray\';\nimport * as gdal from \'gdal-async\';\n',
  augmentation: 'gdal-async'
};
