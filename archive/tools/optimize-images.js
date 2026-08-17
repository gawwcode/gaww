#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = process.argv.slice(2);
const options = {
  source: 'addons/images',
  output: 'addons/images/optimized',
  quality: 65,
  maxWidth: 1600,
  maxHeight: 1800,
  inPlace: false,
};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  switch (arg) {
    case '--source':
      options.source = args[++i];
      break;
    case '--output':
      options.output = args[++i];
      break;
    case '--quality':
      options.quality = Number(args[++i]) || options.quality;
      break;
    case '--max-width':
      options.maxWidth = Number(args[++i]) || options.maxWidth;
      break;
    case '--max-height':
      options.maxHeight = Number(args[++i]) || options.maxHeight;
      break;
    case '--in-place':
      options.inPlace = true;
      break;
    default:
      break;
  }
}

const rootDir = path.resolve(__dirname, '..', '..');
const sourceRoot = path.resolve(rootDir, options.source);
const outputRoot = path.resolve(rootDir, options.output);
const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full));
    } else if (entry.isFile() && allowedExt.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }

  return files;
}

async function optimizeFile(inputFile) {
  const ext = path.extname(inputFile).toLowerCase();
  const targetDir = options.inPlace
    ? path.dirname(inputFile)
    : path.join(outputRoot, path.relative(sourceRoot, path.dirname(inputFile))); 

  const targetName = `${path.basename(inputFile, ext)}.webp`;
  const outputFile = path.join(targetDir, targetName);

  fs.mkdirSync(targetDir, { recursive: true });

  let sharpImage = sharp(inputFile);
  const metadata = await sharpImage.metadata();

  if (metadata.width && metadata.height) {
    const maxWidth = Math.min(options.maxWidth, metadata.width || options.maxWidth);
    const maxHeight = Math.min(options.maxHeight, metadata.height || options.maxHeight);
    sharpImage = sharpImage.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  await sharpImage
    .webp({ quality: options.quality, effort: 6 })
    .toFile(outputFile);

  return {
    inputFile,
    outputFile,
    size: fs.statSync(outputFile).size,
  };
}

(async () => {
  if (!fs.existsSync(sourceRoot)) {
    console.error(`Source folder not found: ${sourceRoot}`);
    process.exit(1);
  }

  const files = listFiles(sourceRoot);

  if (!files.length) {
    console.log(`No image files found in ${sourceRoot}`);
    return;
  }

  console.log(`Optimizing ${files.length} images from ${sourceRoot}`);

  let processed = 0;
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const originalSize = fs.statSync(file).size;
    totalOriginal += originalSize;

    const result = await optimizeFile(file);
    totalOptimized += result.size;
    processed += 1;

    if (options.inPlace && path.extname(file).toLowerCase() !== '.webp') {
      fs.unlinkSync(file);
    }

    console.log(`${processed}/${files.length} — ${path.relative(rootDir, file)} → ${path.relative(rootDir, result.outputFile)} (${Math.round((result.size / 1024) * 10) / 10} KB)`);
  }

  const saved = totalOriginal - totalOptimized;
  console.log(`\nDone: ${processed} files processed.`);
  console.log(`Original total: ${(totalOriginal / 1024).toFixed(1)} KB`);
  console.log(`Optimized total: ${(totalOptimized / 1024).toFixed(1)} KB`);
  console.log(`Saved: ${(saved / 1024).toFixed(1)} KB`);
  console.log(`Output folder: ${outputRoot}`);
})();
