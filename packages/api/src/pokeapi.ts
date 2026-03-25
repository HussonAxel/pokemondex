const POKEAPI_HOSTNAME = "pokeapi.co";
const POKEAPI_PATH_PREFIX = "/api/v2/";
const POKEAPI_TIMEOUT_MS = 3_000;
const POKEAPI_CACHE_TTL_MS = 30 * 60 * 1_000;
const POKEAPI_CACHE_MAX_ENTRIES = 256;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const cache = new Map<string, CacheEntry>();

function evictExpiredEntry(url: string) {
  const entry = cache.get(url);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(url);
    return null;
  }

  cache.delete(url);
  cache.set(url, entry);
  return entry.value;
}

function setCachedValue(url: string, value: unknown) {
  cache.set(url, {
    expiresAt: Date.now() + POKEAPI_CACHE_TTL_MS,
    value,
  });

  if (cache.size <= POKEAPI_CACHE_MAX_ENTRIES) {
    return;
  }

  const oldestKey = cache.keys().next().value;
  if (oldestKey) {
    cache.delete(oldestKey);
  }
}

function normalizePokeApiUrl(url: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid PokeAPI URL");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error("PokeAPI URL must use HTTPS");
  }

  if (parsedUrl.hostname !== POKEAPI_HOSTNAME) {
    throw new Error("Only pokeapi.co URLs are allowed");
  }

  if (!parsedUrl.pathname.startsWith(POKEAPI_PATH_PREFIX)) {
    throw new Error("Only /api/v2 PokeAPI endpoints are allowed");
  }

  parsedUrl.hash = "";
  return parsedUrl.toString();
}

export async function fetchPokeApiJson<T>(url: string): Promise<T> {
  const normalizedUrl = normalizePokeApiUrl(url);
  const cachedValue = evictExpiredEntry(normalizedUrl);

  try {
    const response = await fetch(normalizedUrl, {
      signal: AbortSignal.timeout(POKEAPI_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`PokeAPI request failed with status ${response.status}`);
    }

    const data = (await response.json()) as T;
    setCachedValue(normalizedUrl, data);
    return data;
  } catch (error) {
    if (cachedValue) {
      return cachedValue as T;
    }

    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new Error("PokeAPI request timed out");
    }

    if (error instanceof Error) {
      throw new Error(`PokeAPI request failed: ${error.message}`);
    }

    throw new Error("PokeAPI request failed");
  }
}
