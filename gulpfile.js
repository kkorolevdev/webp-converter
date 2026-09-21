const gulp = require('gulp');
const webp = require('gulp-webp');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const SRC_DIR = './src';
const DIST_DIR = './dist';

const IMAGE_GLOBS = [
  './src/**/*.jpg',
  './src/**/*.jpeg',
  './src/**/*.png',
  './src/**/*.bmp',
  './src/**/*.gif',
  './src/**/*.tiff',
  './src/**/*.tif',
  './src/**/*.JPG',
  './src/**/*.JPEG',
  './src/**/*.PNG',
  './src/**/*.BMP',
  './src/**/*.GIF',
  './src/**/*.TIFF',
  './src/**/*.TIF',
];

// Source paths picked up by the most recent 'build' run, consumed by 'clean:src'.
let processedFiles = [];

function collectProcessed() {
  return new Transform({
    objectMode: true,
    transform(file, encoding, callback) {
      if (file.path && !file.isDirectory()) {
        processedFiles.push(file.path);
      }
      callback(null, file);
    },
  });
}

function build() {
  processedFiles = [];
  return gulp.src(IMAGE_GLOBS, { base: SRC_DIR })
    .pipe(collectProcessed())
    .pipe(webp())
    .pipe(gulp.dest(DIST_DIR));
}

// Removes directories that are left empty under src/, deepest first. Never removes src/ itself.
async function pruneEmptyDirs(dir, root) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await pruneEmptyDirs(path.join(dir, entry.name), root);
    }
  }

  if (dir !== root && (await fs.promises.readdir(dir)).length === 0) {
    await fs.promises.rmdir(dir);
  }
}

async function cleanSrc() {
  const files = [...new Set(processedFiles)];
  let removed = 0;

  for (const file of files) {
    try {
      await fs.promises.unlink(file);
      removed += 1;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  await pruneEmptyDirs(path.resolve(SRC_DIR), path.resolve(SRC_DIR));
  console.log(`Removed ${removed} converted source file(s) from ${SRC_DIR}`);
}

gulp.task('build', build);
gulp.task('do', gulp.series(build, cleanSrc));
