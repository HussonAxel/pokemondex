const POKEAPI_HOSTNAME = "pokeapi.co";
const POKEAPI_PATH_PREFIX = "/api/v2/";
const POKEAPI_TIMEOUT_MS = 3_000;
const POKEAPI_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const POKEAPI_CACHE_MAX_ENTRIES = 2_048;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<unknown>>();

function getCachedEntry(url: string) {
  const entry = cache.get(url);
  if (!entry) {
    return null;
  }

  cache.delete(url);
  cache.set(url, entry);
  return entry;
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
  const cachedEntry = getCachedEntry(normalizedUrl);

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.value as T;
  }

  const pendingRequest = pendingRequests.get(normalizedUrl);
  if (pendingRequest) {
    return pendingRequest as Promise<T>;
  }

  const request = fetch(normalizedUrl, {
    signal: AbortSignal.timeout(POKEAPI_TIMEOUT_MS),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`PokeAPI request failed with status ${response.status}`);
      }

      const data = (await response.json()) as T;
      setCachedValue(normalizedUrl, data);
      return data;
    })
    .finally(() => {
      pendingRequests.delete(normalizedUrl);
    });

  pendingRequests.set(normalizedUrl, request);

  try {
    return await request;
  } catch (error) {
    if (cachedEntry) {
      return cachedEntry.value as T;
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
