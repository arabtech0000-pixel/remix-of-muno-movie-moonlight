import { createFileRoute } from "@tanstack/react-router";
import { json, normalizeMovie, upstreamJson } from "@/lib/muno.server";

// Home catalog: posters/ids from /dashboard. Titles are filled by /api/movies.
export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        const data = await upstreamJson<any>("/dashboard", 5 * 60 * 1000, 10000);
        if (!data || !Array.isArray(data.movies)) {
          return json({ error: "Movie server unavailable", movies: [], sections: [] }, 0);
        }
        return json({
          sections: data.sections || [],
          movies: data.movies.map(normalizeMovie),
        });
      },
    },
  },
});
