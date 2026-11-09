import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';
import { ArrowLeft, Cast, Play, Pause, Unlock, Gauge, SkipForward, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Movie } from '../../types';
import { getMoviePlayStream } from '../../services/api';
import { formatPlayerTime, seekTime } from '../../services/playerControls';

interface Props {
  movie: Movie;
  onClose: () => void;
  onProgressUpdate?: (movieId: string, progress: number) => void;
  recommendations?: Movie[];
  nextMovie?: Movie;
  onPlayNext?: (movie: Movie) => void;
}

export function VideoPlayerModal(props: Props) {
  return createPortal(<PlayerSession key={props.movie.id} {...props} />, document.body);
}

function PlayerSession({ movie, onClose, onProgressUpdate, recommendations = [], nextMovie, onPlayNext }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef(onProgressUpdate);
  reportRef.current = onProgressUpdate;
  const [attempt, setAttempt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [locked, setLocked] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const lastProgress = useRef(-1);
  const related = recommendations.filter(m => m.id !== movie.id);
  const next = movie.isSeries ? nextMovie : related[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let hls: Hls | undefined;
    let fallbackUsed = false;
    let stall: ReturnType<typeof setTimeout> | undefined;
    const fail = () => {
      if (disposed) return;
      setLoading(false);
      setPlaying(false);
      setError('This movie could not be loaded from its video server.');
    };
    const startWatchdog = () => {
      clearTimeout(stall);
      stall = setTimeout(() => void recover(), 20000);
    };
    const ready = () => { clearTimeout(stall); setLoading(false); setError(null); };
    const autoplay = () => { if (!disposed) void video.play().catch(() => { if (!disposed) { setLoading(false); setPlaying(false); } }); };
    const attach = (url: string) => {
      if (disposed) return;
      hls?.destroy();
      hls = undefined;
      setError(null);
      setLoading(true);
      startWatchdog();
      if (/\.m3u8(?:\?|$)/i.test(url) && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.on(Hls.Events.MANIFEST_PARSED, autoplay);
        hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) void recover(); });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
        video.load();
        autoplay();
      }
    };
    // Backup: stream through this app's own server once before giving up.
    const recover = async () => {
      if (disposed || fallbackUsed) { fail(); return; }
      fallbackUsed = true;
      attach(`/api/stream/${encodeURIComponent(movie.id)}`);
    };
    video.addEventListener('error', recover);
    video.addEventListener('canplay', ready);
    video.addEventListener('playing', ready);
    const waiting = () => { setLoading(true); startWatchdog(); };
    video.addEventListener('waiting', waiting);
    const load = async () => {
      const url = attempt === 0 && movie.videoUrl ? movie.videoUrl : await getMoviePlayStream(movie.id);
      if (disposed) return;
      if (url) attach(url); else fail();
    };
    startWatchdog();
    void load();
    return () => {
      disposed = true;
      clearTimeout(stall);
      video.removeEventListener('error', recover);
      video.removeEventListener('canplay', ready);
      video.removeEventListener('playing', ready);
      video.removeEventListener('waiting', waiting);
      hls?.destroy();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [movie.id, movie.videoUrl, attempt]);

  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (locked) setLocked(false); else onClose(); }
    };
    document.addEventListener('keydown', keys);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', keys); };
  }, [locked, onClose]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || error) return;
    if (video.paused) void video.play().catch(() => setNotice('Tap play again to start the movie.'));
    else video.pause();
  };
  const seek = (target: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = Math.max(0, Math.min(duration, target));
    setTime(video.currentTime);
  };
  const updateTime = () => {
    const video = videoRef.current;
    if (!video) return;
    setTime(video.currentTime);
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
      const progress = Math.floor(video.currentTime / video.duration * 100);
      if (progress !== lastProgress.current) { lastProgress.current = progress; reportRef.current?.(movie.id, progress); }
    }
  };
  // Uses the phone's own cast system: Chromecast/Smart TV on Android Chrome, AirPlay on iPhone.
  const cast = async () => {
    const video = videoRef.current as (HTMLVideoElement & { remote?: { prompt: () => Promise<void>; state?: string }; webkitShowPlaybackTargetPicker?: () => void }) | null;
    if (!video) return;
    try {
      if (video.webkitShowPlaybackTargetPicker) { video.webkitShowPlaybackTargetPicker(); return; }
      if (video.remote) {
        // TVs cannot receive in-browser stream pieces, so hand them the direct movie file.
        if (video.src.startsWith('blob:') || !video.currentSrc) {
          const at = video.currentTime;
          video.src = `/api/stream/${encodeURIComponent(movie.id)}`;
          video.currentTime = at;
        }
        await video.remote.prompt();
        return;
      }
      setNotice('Casting needs Chrome on Android or Safari on iPhone. You can also use your phone\'s Screen Cast / Smart View.');
    } catch (e) {
      const name = (e as DOMException)?.name;
      setNotice(name === 'NotFoundError' ? 'No TV found. Connect your phone and TV to the same Wi‑Fi.' : name === 'NotSupportedError' ? 'This movie cannot be cast from the browser. Use your phone\'s Screen Cast / Smart View.' : 'No casting device was selected.');
    }
  };
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch { setNotice('Full screen is not available in this browser.'); }
  };
  const changeSpeed = (rate: number) => { if (videoRef.current) videoRef.current.playbackRate = rate; setSpeed(rate); setShowSpeed(false); };

  const [shown, setShown] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const poke = () => {
    setShown(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShown(false), 3000);
  };
  useEffect(() => { if (playing && !showSpeed && !showRelated) poke(); else { clearTimeout(hideTimer.current); setShown(true); } return () => clearTimeout(hideTimer.current); }, [playing, showSpeed, showRelated]);
  const hidden = !shown && playing && !error;

  return (
    <div ref={rootRef} onPointerDown={poke} onMouseMove={poke} role="dialog" aria-modal="true" aria-label={`${movie.title} video player`} className={`muno-player ${hidden ? "controls-hidden" : ""} fixed inset-0 z-[99999] flex flex-col overflow-hidden select-none`}>
      <video ref={videoRef} playsInline autoPlay preload="metadata" className="absolute inset-0 w-full h-full object-contain" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={updateTime} onLoadedMetadata={updateTime} onEnded={() => { setPlaying(false); reportRef.current?.(movie.id, 100); setShowRelated(true); }} />
      {!locked && <header className="player-top relative z-10 flex items-center gap-3 px-4 py-3 sm:px-8 sm:py-5">
        <Button variant="ghost" size="icon" className="player-icon shrink-0" aria-label="Close player" title="Back" onClick={onClose}><ArrowLeft /></Button>
        <h2 className="min-w-0 flex-1 text-sm sm:text-lg font-semibold break-words">{movie.title} by {movie.vj}</h2>
        <Button variant="ghost" size="icon" className="player-icon shrink-0" aria-label="Cast video" title="Cast to TV" onClick={cast}><Cast /></Button>
      </header>}
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {error ? <div className="player-error text-center p-5 max-w-sm" role="alert"><p className="text-sm mb-4">{error}</p><Button className="player-retry" onClick={() => { setError(null); setLoading(true); setAttempt(a => a + 1); }}>Try again</Button></div> : !locked && <div className="flex items-center gap-6 sm:gap-16">
          <Button variant="ghost" className="player-play" aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'} onClick={togglePlay}>{loading ? <Loader2 className="animate-spin" /> : playing ? <Pause /> : <Play />}</Button>
        </div>}
        {loading && !error && <p role="status" className="absolute top-1/2 mt-14 text-sm player-status">Loading ...</p>}
      </div>
      {locked ? <div className="relative z-10 p-5"><Button variant="ghost" className="player-tool" aria-label="Unlock controls" title="Unlock controls" onClick={() => setLocked(false)}><span>Unlock</span><Unlock /></Button></div> : <footer className="player-bottom relative z-10 px-4 pb-3 pt-6 sm:px-10">
        {notice && <div role="status" className="text-center text-xs pb-2" onClick={() => setNotice('')}>{notice}</div>}
        <div className="flex items-center gap-4 text-sm sm:text-base tabular-nums">
          <span>{formatPlayerTime(time)}</span>
          <input aria-label="Playback position" type="range" min={0} max={duration || 1} step={0.1} value={time} disabled={!duration} onChange={event => seek(Number(event.target.value))} className="player-timeline min-w-0 flex-1" style={{ ['--pct' as string]: `${duration ? (time / duration) * 100 : 0}%` }} />
          <span>{formatPlayerTime(duration)}</span>
        </div>
        <div className="flex items-center justify-around gap-1 mt-1">
          <Button variant="ghost" className="player-tool" aria-label="Lock controls" onClick={() => { setLocked(true); setShowSpeed(false); }}><span>Lock</span><Unlock /></Button>
          <div className="relative">
            {showSpeed && <div className="player-speed absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col p-1 rounded-md" role="menu" aria-label="Playback speed">{[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => <Button key={rate} variant="ghost" role="menuitemradio" aria-checked={rate === speed} className="player-icon" onClick={() => changeSpeed(rate)}>{rate}x</Button>)}</div>}
            <Button variant="ghost" className="player-tool" aria-expanded={showSpeed} aria-label="Playback speed" onClick={() => setShowSpeed(!showSpeed)}><span>Speed({speed}x)</span><Gauge /></Button>
          </div>
          <Button variant="ghost" className="player-tool" aria-label="Next movie" disabled={!next || !onPlayNext} onClick={() => next && onPlayNext?.(next)}><span>Next</span><SkipForward className="fill-current" /></Button>
          <Button variant="ghost" className="player-tool" aria-expanded={showRelated} onClick={() => setShowRelated(!showRelated)}><span>You may also like</span><ChevronRight /></Button>
        </div>
        {showRelated && <div className="flex gap-3 overflow-x-auto max-h-36 mt-2 pb-2">{related.length ? related.slice(0, 12).map(m => <Button key={m.id} variant="ghost" className="player-poster shrink-0 flex-col h-auto w-24 p-0" onClick={() => onPlayNext?.(m)} aria-label={`Play ${m.title}`}><img src={m.posterUrl || undefined} alt="" className="w-24 h-20 object-cover rounded" /><span className="whitespace-normal text-xs line-clamp-2">{m.title}</span></Button>) : <p className="text-xs">No more movies available.</p>}</div>}
      </footer>}
    </div>
  );
}
