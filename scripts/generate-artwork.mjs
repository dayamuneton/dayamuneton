import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const portrait = [112, 224, 320];
const card = [256, 384, 560, 768];
const banner = [480, 768, 1200, 1600, 2400];
const assets = {
   "DayaMunetonB&WArt.jpg": portrait,
   "StoriesBehindTheSongs.png": card,
   "ShopMyArt.png": card,
   "MyNotes.png": card,
   "newshopartcollection.png": card,
   "newshopcelebrating.png": card,
   "newshopdayashop.png": card,
   "BannerHeads.png": banner,
   "Bannerbodies.png": banner,
   "BannerAbstracts.png": banner,
   "BannerConmemorativeArt.png": banner,
   "DayaAbout1.png": card,
   "Freebies.png": card,
   "ArtEmotions.png": card,
   "ChemistryEmotions.png": card,
   "LogoAgeOfEmotions.png": portrait,
   "HeadPhonesCommunity1.png": card,
   "HeadPhonesCommunity2.png": card,
   "HeadPhonesCommunity3.png": card,
   "MujerYourCanvas1.png": card,
   "ESCUCHA_LA_MUSICA_DE_TU_LIENZO.png": card,
   "DigitalArtFormat.png": [160, 320],
   "AcrylicOnCanvas.png": [160, 320],
   "ArtPrints.png": [160, 320],
};

const output = join("public", "artwork");
const manifest = {};
await mkdir(output, { recursive: true });
await mkdir(join("lib", "artwork"), { recursive: true });

for (const [file, requestedWidths] of Object.entries(assets)) {
   const source = await readFile(join("public", file));
   const original = sharp(source);
   const metadata = await original.metadata();
   const { width, height } = metadata.autoOrient ?? metadata;
   const widths = [...new Set(requestedWidths.map((size) => Math.min(size, width)))];
   const fallbackWidths = [...new Set([widths[0], widths[Math.floor(widths.length / 2)]])];
   const hasAlpha = metadata.hasAlpha && !(await original.stats()).isOpaque;
   const fallback = hasAlpha ? "png" : "jpg";
   const hash = createHash("sha256").update(source)
      .update(`webp-74/jpeg-80/png-palette-85/v2/${sharp.versions.sharp}`).digest("hex").slice(0, 12);
   const name = basename(file, extname(file)).toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
   const key = `${name}-${hash}`;

   for (const size of widths) {
      for (const format of ["webp", fallback]) {
         if (format === fallback && !fallbackWidths.includes(size)) continue;
         const destination = join(output, `${key}-${size}.${format}`);
         if (await access(destination).then(() => true, () => false)) continue;
         const image = sharp(source).autoOrient().resize({ width: size, withoutEnlargement: true });
         if (format === "webp") await image.webp({ quality: 74, effort: 5 }).toFile(destination);
         else if (format === "jpg") await image.jpeg({ quality: 80, mozjpeg: true }).toFile(destination);
         else await image.png({ palette: true, quality: 85, effort: 6 }).toFile(destination);
      }
   }

   manifest[`/${file}`] = { path: `/artwork/${key}`, widths, fallbackWidths, width, height, fallback };
}

await writeFile(join("lib", "artwork", "variants.json"), JSON.stringify(manifest, null, 3) + "\n");
console.log(`Generated responsive artwork for ${Object.keys(manifest).length} originals.`);
