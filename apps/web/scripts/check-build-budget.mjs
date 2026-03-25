import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_MAIN_JS_BYTES = 900_000;
const scriptDir = dirname(fileURLToPath(import.meta.url));
const candidateDirs = [
  join(scriptDir, "../.output/public/assets"),
  join(scriptDir, "../.vercel/output/static/assets"),
  join(scriptDir, "../.vercel/output/static"),
];

async function findMainChunk(dir) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const nestedMainChunk = await findMainChunk(fullPath);
      if (nestedMainChunk) {
        return nestedMainChunk;
      }
      continue;
    }

    if (entry.name.startsWith("main-") && entry.name.endsWith(".js")) {
      return fullPath;
    }
  }

  return null;
}

let mainChunkPath = null;

for (const candidateDir of candidateDirs) {
  mainChunkPath = await findMainChunk(candidateDir);
  if (mainChunkPath) {
    break;
  }
}

if (!mainChunkPath) {
  throw new Error(
    `Unable to find the main client chunk in any known build output: ${candidateDirs.join(", ")}`,
  );
}

const mainChunkContents = await readFile(mainChunkPath);
const mainChunkName = mainChunkPath.split("/").at(-1) ?? mainChunkPath;

if (mainChunkContents.byteLength > MAX_MAIN_JS_BYTES) {
  throw new Error(
    `Main client chunk ${mainChunkName} is ${mainChunkContents.byteLength} bytes, above the ${MAX_MAIN_JS_BYTES} byte budget`,
  );
}

console.log(
  `Build budget OK: ${mainChunkName} is ${mainChunkContents.byteLength} bytes`,
);
