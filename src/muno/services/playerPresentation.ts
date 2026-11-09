interface PresentationEnvironment {
  isFullscreen: () => boolean;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  lockOrientation?: ((orientation: 'landscape') => Promise<void>) | undefined;
  unlockOrientation?: () => void;
}

// Start on the Watch button's gesture, before React mounts the player.
export function beginPlayerLandscape(env: PresentationEnvironment): () => void {
  let closed = false;
  let ownsFullscreen = false;
  let ownsOrientation = false;
  const restore = () => {
    if (ownsOrientation) { env.unlockOrientation?.(); ownsOrientation = false; }
    if (ownsFullscreen && env.isFullscreen()) {
      ownsFullscreen = false;
      void env.exitFullscreen().catch(() => {});
    }
  };
  const enter = async () => {
    try {
      if (!env.isFullscreen()) { await env.requestFullscreen(); ownsFullscreen = true; }
      if (closed) { restore(); return; }
      if (env.lockOrientation) {
        await env.lockOrientation('landscape');
        ownsOrientation = true;
      }
    } catch { /* Unsupported browsers retain the usable inline player. */ }
    if (closed) restore();
  };
  void enter();
  return () => { closed = true; restore(); };
}

export function openBrowserPlayerLandscape(): () => void {
  const orientation = screen.orientation as ScreenOrientation & {
    lock?: (orientation: 'landscape') => Promise<void>;
  };
  return beginPlayerLandscape({
    isFullscreen: () => Boolean(document.fullscreenElement),
    requestFullscreen: () => document.documentElement.requestFullscreen?.() ?? Promise.reject(),
    exitFullscreen: () => document.exitFullscreen(),
    lockOrientation: orientation?.lock ? value => orientation.lock?.(value) ?? Promise.resolve() : undefined,
    unlockOrientation: () => orientation?.unlock?.(),
  });
}