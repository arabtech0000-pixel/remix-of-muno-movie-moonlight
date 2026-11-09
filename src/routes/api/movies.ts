import { createFileRoute } from "@tanstack/react-router";
import { getMovieDetail, json } from "@/lib/muno.server";

// Batch movie details: /api/movies?ids=1,2,3 (max 40 per call).
export const Route = createFileRoute("/api/movies")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const ids = (new URL(request.url).searchParams.get("ids") || "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => /^\d+$/.test(s))
          .slice(0, 40);
        const movies = await Promise.all(ids.map((id) => getMovieDetail(id)));
        return json(movies.filter(Boolean), 3600);
      },
    },
  },
});
