# WebP Converter

A simple Gulp-based tool that batch-converts images to WebP format while preserving the original folder structure.

## Usage

1. Place images into the `src/` folder (subdirectories are supported).
2. Run the build command:

```bash
npm run build
```

3. Converted `.webp` images will appear in the `dist/` folder, mirroring the structure of `src/`.

### Convert and clear the source folder

`gulp do` does everything `gulp build` does, then deletes the source images it just
converted from `src/` (including those in subdirectories):

```bash
npm run do
# or: npx gulp do
```

Only the files that were actually converted are removed. Unsupported file types are
left untouched, and subdirectories under `src/` are removed only if converting emptied
them completely. The `src/` folder itself is always kept.

## Supported formats

`jpg`, `jpeg`, `png`, `bmp`, `gif`, `tiff`, `tif` (case-insensitive)

All other file types are ignored.

## Example

```
src/
  photo.jpg
  products/
    item.png
    details/
      close-up.jpeg

→ npm run build →

dist/
  photo.webp
  products/
    item.webp
    details/
      close-up.webp
```

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm

Install dependencies:

```bash
npm install
```
