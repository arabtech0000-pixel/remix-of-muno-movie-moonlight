<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep catalog membership in the pure catalogFilters module; exact VJ and genre matching prevents unrelated fallback titles.
- Series details load hydrated episodes using the selected movie ID (the upstream lookup does not accept series codes); series playback keeps the returned episode order for Next instead of unrelated recommendations.
- The player owns its media lifecycle per movie and uses HLS.js for HLS streams; shared pure helpers handle bounded seeking.
- Player presentation starts from the Watch gesture and restores only fullscreen/orientation it acquired, so unsupported browsers still retain working controls.
- The phone shell is viewport-bound with a nonshrinking safe-area navigation row, preventing browser chrome from clipping navigation.
- Search merges matching loaded catalog rows with hydrated upstream results by movie ID; upstream failures are distinct from zero matches and requests are abortable.
- Movie CDN (b-cdn.net) returns 403 for any Referer header; the app sends no-referrer (root referrer meta) so streams play.
- Home-screen installation is manifest-only with one shared invitation; use browser install events and manual platform guidance without app-shell service workers to keep previews and streaming uncached.
- Movie downloads use a same-origin streamed attachment endpoint restricted to movie CDN files; never buffer whole movies or claim browser requests prove completed offline storage.
- The Android app is a Capacitor shell loading the published site (capacitor.config.json server.url), built by .github/workflows/android-apk.yml; this keeps server routes and streaming working without a static export.
- Serve converter ownership proof from public/.well-known/assetlinks.json; never publish the converter's signing keystore or signing credentials.
- Resolve admin menu visibility outside auth-state callbacks using has_role; protected admin server functions remain the authority for access.
- Load admin member activity through the authenticated, admin-guarded database RPC so listing works without host service credentials; account mutations still require configured privileged server functions.
