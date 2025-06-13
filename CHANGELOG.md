# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [1.5.1] 2025-06-13
 - Fix `Float16Array` compatibility with latest `gdal-async`

## [1.5.0] 2023-11-30
 - When using TypeScript, support automatic typing of the returned array through generics

## [1.4.0] 2023-09-21
 - Update all dependencies and test with recent Node.js versions

### [1.3.1] 2022-09-24
 - Fix `Cannot find module '@stdlib/types/ndarray' or its corresponding type declarations.` when using @stdlib with TypeScript and transpiling to JavaScript with `tsc`

## [1.3.0] 2022-03-26
 - Compatibility with `@stdlib/ndarray`
 
### [1.2.1] 2021-10-04
 - Compatibility with `@types/ndarray@1.0.10`

## [1.2.0] 2021-06-15
 - Add read-only support for MDArrays on GDAL >= 3.1
 
## [1.1.0] 2021-05-30
 - Improve the the documentation
 - Allow specifying of the resampling algorithm
 - Allow specifying a progress callback
 - Generate `index.d.ts` with yatag
 - Switch the unit testing to TS
 - Add {Read|Write}ArrayAsync()

# [1.0.0] 2021-05-29

### Initial import
 - Support zero-copy I/O for all `scijs/ndarray` stride types in `gdal-async`
