import { createFileRoute } from "@tanstack/react-router";
import { getMovieDetail, json, normalizeMovie, upstreamJson } from "@/lib/muno.server";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const q = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 100);
        if (!q) return json([]);
        const data = await upstreamJson<any>(`/search?q=${encodeURIComponent(q)}`, 10 * 60 * 1000);
        if (!data || data.error || data.status === false) return new Response(JSON.stringify({ error: "Search unavailable" }), {
          status: 503, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
        const out = new Map<string, any>();
        const add = (raw: any) => {
          const m = normalizeMovie(raw);
          if (m.title && !out.has(m.id)) out.set(m.id, m);
        };
        const list = Array.isArray(data) ? data : [];
        list.forEach(add);
        (data.movies || []).forEach(add);
        for (const s of data.series || []) {
          const eps = Array.isArray(s.episodes) ? s.episodes : [];
          if (eps.length) {
            eps.forEach((ep: any) => add({ ...ep, title: ep.title || s.title, image: ep.image || s.image }));
          } else {
            add({ id: s.series_code, title: s.title, image: s.image, series_code: s.series_code });
          }
        }
        // Search records omit description/duration and sometimes artwork: hydrate
        // them before opening details, preserving any richer search fields.
        const movies = await Promise.all(Array.from(out.values()).map(async movie => {
          const detail = await getMovieDetail(movie.id);
          return detail ? { ...movie, ...detail, posterUrl: detail.posterUrl || movie.posterUrl,
            videoUrl: detail.videoUrl || movie.videoUrl } : movie;
        }));
        return json(movies, 600);
      },
    },
  },
});
