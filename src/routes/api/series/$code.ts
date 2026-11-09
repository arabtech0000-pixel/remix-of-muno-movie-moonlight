import { createFileRoute } from "@tanstack/react-router";
import { json, normalizeMovie, upstreamJson } from "@/lib/muno.server";
import { episodeOrderKey } from "@/muno/services/seriesEpisodes";

export const Route = createFileRoute("/api/series/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // The upstream series lookup is slow (often ~20s), so allow it time.
        const data = await upstreamJson<any>(`/series/${encodeURIComponent(params.code)}`, 30 * 60 * 1000, 45000);
        if (!data || data.error) return new Response(JSON.stringify({ error: "Episodes unavailable" }), {
          status: 503, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
        const eps = Array.isArray(data?.episodes) ? data.episodes : [];
        // Episode rows already carry poster, size and stream; no per-episode lookups.
        const episodes = eps.map((raw: any) => ({
          ...normalizeMovie({ ...raw, category_id: raw.category_id ?? 5 }),
          isSeries: true,
          seriesCode: String(data.series_code || raw.series_code || params.code),
        })).sort((a: any, b: any) => episodeOrderKey(a) - episodeOrderKey(b));
        return json({ series_code: String(data.series_code || params.code), count: episodes.length, episodes },
          eps.length ? 1800 : 0);
      },
    },
  },
});
