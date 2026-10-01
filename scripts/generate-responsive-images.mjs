import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputDir = path.join(root, 'public/images/responsive');
const manifestPath = path.join(root, 'src/data/responsive-images.json');
const sources = [
  { file: 'src/data/project-pages.ts', widths: [480, 800, 1200, 1600] },
  { file: 'src/pages/private-clients.astro', widths: [320, 540] },
  { file: 'src/pages/retail.astro', widths: [320, 540] },
];

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const requestedImages = new Map();

for (const source of sources) {
  const content = await fs.readFile(path.join(root, source.file), 'utf8');
  const matches = content.matchAll(/['"](\/images\/[^'"]+\.(?:jpe?g|png))['"]/gi);

  for (const match of matches) {
    requestedImages.set(match[1], source.widths);
  }
}

const manifest = {};

for (const [publicPath, requestedWidths] of [...requestedImages].sort(([a], [b]) => a.localeCompare(b))) {
  const inputPath = path.join(root, 'public', publicPath);
  const metadata = await sharp(inputPath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${publicPath}`);
  }

  const widths = [...new Set([
    ...requestedWidths.filter((width) => width < metadata.width),
    Math.min(requestedWidths.at(-1), metadata.width),
  ])].sort((a, b) => a - b);
  const basename = path.basename(publicPath, path.extname(publicPath));
  const entry = {
    width: metadata.width,
    height: metadata.height,
    avif: [],
    webp: [],
  };

  for (const width of widths) {
    const height = Math.round((metadata.height / metadata.width) * width);

    for (const format of ['avif', 'webp']) {
      const filename = `${basename}-${width}.${format}`;
      const outputPath = path.join(outputDir, filename);
      const pipeline = sharp(inputPath).resize({ width, withoutEnlargement: true });

      if (format === 'avif') {
        await pipeline.avif({ quality: 52, effort: 6 }).toFile(outputPath);
      } else {
        await pipeline.webp({ quality: 76, effort: 6 }).toFile(outputPath);
      }

      entry[format].push({
        src: `/images/responsive/${filename}`,
        width,
        height,
      });
    }
  }

  manifest[publicPath] = entry;
}

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Generated responsive variants for ${Object.keys(manifest).length} images.`);
