import { createFileRoute } from '@tanstack/react-router';
import { getMovieDetail, MOVIE_SERVER_URL, secureUrl } from '@/lib/muno.server';
import { isDownloadableMovieUrl, movieFilename } from '@/lib/movieDownload';

async function download(request: Request, id: string) {
  if (!/^\d{1,12}$/.test(id)) return new Response('Invalid movie', { status: 400 });
  try {
    // Same resolution order as the player: play redirect first, then movie detail.
    let url: string | null | undefined = null;
    try {
      const playback = await fetch(`${MOVIE_SERVER_URL}/movie/${encodeURIComponent(id)}/play`, { redirect: 'manual', signal: AbortSignal.timeout(8000) });
      url = secureUrl(playback.headers.get('location'));
    } catch { /* fall back to detail */ }
    const movie = await getMovieDetail(id).catch(() => null);
    if (!url) url = movie?.videoUrl;
    if (!url) return new Response('Movie unavailable', { status: 404 });
    if (!isDownloadableMovieUrl(url)) return new Response('Streaming-only title', { status: 415 });
    const headers = new Headers();
    const range = request.headers.get('range');
    if (range) {
      if (!/^bytes=\d*-\d*$/.test(range)) return new Response('Invalid range', { status: 416 });
      headers.set('Range', range);
    }
    const ifRange = request.headers.get('if-range');
    if (ifRange) headers.set('If-Range', ifRange);
    // Deliberately do not forward browser Referer, cookies or authorization.
    // No request.signal: phone download managers reconnect and resume with Range.
    const upstream = await fetch(url, { method: request.method === 'HEAD' ? 'HEAD' : 'GET', headers, redirect: 'follow' });
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return new Response('Movie file unavailable', { status: upstream.status === 416 ? 416 : 502 });
    }
    const out = new Headers({ 'Cache-Control': 'no-store', 'Content-Disposition': `attachment; filename="${movieFilename(movie?.title || "MunoMovies", new URL(url).pathname.split('.').pop()?.toLowerCase())}"`, 'Content-Type': upstream.headers.get('content-type') || 'video/mp4', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' });
    // ETag/Last-Modified let the phone resume a paused download instead of failing.
    for (const key of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
      const value = upstream.headers.get(key); if (value) out.set(key, value);
    }
    return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers: out });
  } catch { return new Response('Download unavailable', { status: 502 }); }
}

export const Route = createFileRoute('/api/download/$id')({
  server: { handlers: {
    GET: ({ request, params }) => download(request, params.id),
    HEAD: ({ request, params }) => download(request, params.id),
  } },
});