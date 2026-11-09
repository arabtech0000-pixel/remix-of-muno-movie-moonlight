import { createFileRoute } from "@tanstack/react-router";
import { MOVIE_SERVER_URL, getMovieDetail, secureUrl } from "@/lib/muno.server";

// Backup playback path: relays the movie file (with Range support) from the
// video host without browser headers that the host rejects.
async function resolve(id: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${MOVIE_SERVER_URL}/movie/${encodeURIComponent(id)}/play`, { redirect: "manual" });
    const loc = secureUrl(res.headers.get("location"));
    if (loc) return loc;
  } catch {}
  return (await getMovieDetail(id))?.videoUrl;
}

export const Route = createFileRoute("/api/stream/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = await resolve(params.id);
        if (!url) return new Response("No stream", { status: 404 });
        const headers: Record<string, string> = {};
        const range = request.headers.get("range");
        if (range) headers['Range'] = range;
        const up = await fetch(url, { headers });
        const out = new Headers();
        for (const h of ["content-type", "content-length", "content-range", "accept-ranges"]) {
          const v = up.headers.get(h);
          if (v) out.set(h, v);
        }
        if (!out.has("accept-ranges")) out.set("accept-ranges", "bytes");
        return new Response(up.body, { status: up.status, headers: out });
      },
    },
  },
});
