// Resize oversized raster photos in place, keeping URLs and aspect ratios stable.
// Run manually after adding assets: node scripts/optimize-images.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (/\.jpe?g$/i.test(file)) result.push(file);
  }
  return result;
}
(async () => {
  let before = 0, after = 0, count = 0;
  for (const file of await walk('public')) {
    const input = await fs.readFile(file);
    if (input.length < 300_000) continue;
    const output = await sharp(input).rotate().resize({width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true}).jpeg({quality: 82, mozjpeg: true}).toBuffer();
    if (output.length > input.length * .9) continue;
    await fs.writeFile(file, output);
    before += input.length; after += output.length; count++;
  }
  console.log(JSON.stringify({count, beforeMB: +(before/1e6).toFixed(2), afterMB: +(after/1e6).toFixed(2), savedMB: +((before-after)/1e6).toFixed(2)}));
})();
