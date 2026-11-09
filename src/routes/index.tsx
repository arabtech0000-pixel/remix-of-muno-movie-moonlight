import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// The app relies on browser APIs (storage, video, Firebase), so load it client-side only.
const MunoApp = lazy(() => import("@/muno/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MunoMovies — Translated movies & series" },
      { name: "description", content: "Watch the latest translated movies and series from top VJs on MunoMovies." },
      { property: "og:title", content: "MunoMovies — Translated movies & series" },
      { property: "og:description", content: "Watch the latest translated movies and series from top VJs on MunoMovies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Splash() {
  return <div className="h-screen w-full" style={{ background: "#05051F" }} />;
}

function Index() {
  return (
    <ClientOnly fallback={<Splash />}>
      <Suspense fallback={<Splash />}>
        <div className="h-screen w-full">
          <MunoApp />
        </div>
      </Suspense>
    </ClientOnly>
  );
}
