import { createFileRoute } from "@tanstack/react-router";
import { getMovieDetail, json } from "@/lib/muno.server";

export const Route = createFileRoute("/api/movie/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const movie = await getMovieDetail(params.id);
        if (!movie) return json({ error: "Movie not found" }, 0);
        return json(movie, 3600);
      },
    },
  },
});
