import { createFileRoute } from "@tanstack/react-router";
import { MOVIE_SERVER_URL, getMovieDetail, json, secureUrl } from "@/lib/muno.server";

// Resolves the real stream URL for a movie or episode.
export const Route = createFileRoute("/api/play/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = encodeURIComponent(params.id);
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 6000);
          const res = await fetch(`${MOVIE_SERVER_URL}/movie/${id}/play`, {
            redirect: "manual",
            signal: ctrl.signal,
          });
          clearTimeout(t);
          const loc = secureUrl(res.headers.get("location"));
          if (loc) return json({ success: true, streamUrl: loc }, 1800);
        } catch (e) {
          console.error("play redirect failed", e);
        }
        const detail = await getMovieDetail(params.id);
        if (detail?.videoUrl) return json({ success: true, streamUrl: detail.videoUrl }, 1800);
        return json({ success: false, error: "No stream available for this title" }, 0);
      },
    },
  },
});
