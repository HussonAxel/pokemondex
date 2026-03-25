import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const assetsDir = new URL("../.output/public/assets", import.meta.url);
const MAX_MAIN_JS_BYTES = 900_000;

const assetFiles = await readdir(assetsDir);
const mainChunk = assetFiles.find(
  (file) => file.startsWith("main-") && file.endsWith(".js"),
);

if (!mainChunk) {
  throw new Error("Unable to find the main client chunk in .output/public/assets");
}

const mainChunkPath = join(assetsDir.pathname, mainChunk);
const mainChunkContents = await readFile(mainChunkPath);

if (mainChunkContents.byteLength > MAX_MAIN_JS_BYTES) {
  throw new Error(
    `Main client chunk ${mainChunk} is ${mainChunkContents.byteLength} bytes, above the ${MAX_MAIN_JS_BYTES} byte budget`,
  );
}

console.log(
  `Build budget OK: ${mainChunk} is ${mainChunkContents.byteLength} bytes`,
);
