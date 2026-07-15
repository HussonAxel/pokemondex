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

async function findEntryChunks(dir) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const chunks = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      chunks.push(...(await findEntryChunks(fullPath)));
      continue;
    }

    if (
      (entry.name.startsWith("main-") || entry.name.startsWith("index-")) &&
      entry.name.endsWith(".js")
    ) {
      chunks.push(fullPath);
    }
  }

  return chunks;
}

let mainChunkPath = null;

for (const candidateDir of candidateDirs) {
  const entryChunks = await findEntryChunks(candidateDir);

  if (entryChunks.length > 0) {
    const chunksBySize = await Promise.all(
      entryChunks.map(async (path) => ({
        contents: await readFile(path),
        path,
      })),
    );
    chunksBySize.sort(
      (left, right) => right.contents.byteLength - left.contents.byteLength,
    );
    mainChunkPath = chunksBySize[0]?.path ?? null;
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
