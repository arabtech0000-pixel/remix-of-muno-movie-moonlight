// Server-side client for the MunoWatch movie server. Normalizes raw records
// into the app's Movie shape and caches responses per worker instance.
export const MOVIE_SERVER_URL = "https://mumowatch.ai.studio";

const CATEGORY_MAP: Record<number, string> = {
  1: "Action",
  2: "Horror",
  3: "Romance",
  5: "Series",
  6: "Kung Fu",
  7: "Adventure",
  8: "Drama",
  9: "Comedy",
  10: "Horror",
  12: "Crime",
  14: "Sci Fi",
  15: "Romance",
  17: "Local Drama",
  19: "Thriller",
  25: "Shows",
  26: "Sport",
};

type Cached = { data: unknown; at: number };
const cache = new Map<string, Cached>();

export async function upstreamJson<T = any>(path: string, ttlMs: number, timeoutMs = 8000): Promise<T | null> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < ttlMs) return hit.data as T;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${MOVIE_SERVER_URL}${path}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`Movie server ${path} failed [${res.status}]`);
      return hit ? (hit.data as T) : null;
    }
    const data = (await res.json()) as T;
    cache.set(path, { data, at: Date.now() });
    if (cache.size > 2000) cache.delete(cache.keys().next().value as string);
    return data;
  } catch (e) {
    console.error(`Movie server ${path} error`, e);
    return hit ? (hit.data as T) : null;
  } finally {
    clearTimeout(t);
  }
}

/** Upgrade to https and encode spaces etc. so browsers can load the file. */
export function secureUrl(url?: string | null): string | undefined {
  if (!url || !String(url).trim()) return undefined;
  let u = String(url).trim().replace(/^http:\/\//i, "https://");
  try {
    u = encodeURI(decodeURI(u));
  } catch {
    u = encodeURI(u);
  }
  return u;
}

const clean = (s?: string | null) => (s && String(s).trim() ? String(s).trim() : "");

export function genreFor(categoryId: unknown): string {
  return CATEGORY_MAP[Number(categoryId)] || "Movies";
}

export function normalizeMovie(raw: any) {
  const title = clean(raw.title);
  const isSeries =
    Number(raw.category_id) === 5 ||
    /^EPS\b/i.test(title) ||
    (raw.series_code && String(raw.series_code) !== String(raw.id));
  const desc = clean(raw.description).replace(/\s*\.\.\.$/, "…");
  return {
    id: String(raw.id),
    title,
    vj: clean(raw.vj) || "MunoMovies",
    genre: genreFor(raw.category_id),
    category_id: String(raw.category_id ?? ""),
    duration: clean(raw.duration) || "",
    fileSize: clean(raw.size) || undefined,
    rating: "16+",
    narration: "Translated (Luganda)",
    description: desc,
    posterUrl: secureUrl(raw.image),
    heroBannerUrl: secureUrl(raw.image),
    videoUrl: secureUrl(raw.playingurl),
    seriesCode: raw.series_code ? String(raw.series_code) : undefined,
    isSeries: Boolean(isSeries),
    isLocked: false,
    metadataResolved: Boolean(title),
  };
}

export async function getMovieDetail(id: string) {
  const raw = await upstreamJson<any>(`/movie/${encodeURIComponent(id)}`, 6 * 60 * 60 * 1000);
  if (!raw || !raw.id) return null;
  return normalizeMovie(raw);
}

export const json = (data: unknown, maxAge = 300) =>
  new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
