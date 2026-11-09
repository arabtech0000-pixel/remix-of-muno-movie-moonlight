import { useEffect, useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Movie } from '../../types';
import { movieFilename } from '@/lib/movieDownload';

export function MovieDownloadDialog({ movie, onClose, onRequested }: {
  movie: Movie | null; onClose: () => void; onRequested: (movie: Movie) => void;
}) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!movie) return;
    const controller = new AbortController();
    setState('loading');
    void fetch(`/api/download/${encodeURIComponent(movie.id)}`, { method: 'HEAD', signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(response.status === 415 ? 'This title is streaming-only and has no downloadable movie file.' : 'This movie file is unavailable. Please try again.');
        setState('ready');
      }).catch(e => {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : 'Download unavailable.'); setState('error');
      });
    return () => controller.abort();
  }, [movie]);

  return <Dialog open={Boolean(movie)} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="muno-install bg-background text-foreground max-w-sm">
      <DialogTitle>Download movie</DialogTitle>
      <DialogDescription className="break-words">{movie?.title}</DialogDescription>
      {state === 'loading' && <div role="status" className="flex items-center gap-2 text-sm"><LoaderCircle className="size-4 animate-spin" />Preparing movie file…</div>}
      {state === 'error' && <p role="alert" className="text-sm text-muted-foreground">{error}</p>}
      {state === 'ready' && movie && <>
        <p className="text-sm text-muted-foreground">Save to your phone or computer. {movie.fileSize || 'File size varies.'}</p>
        <Button asChild className="w-full"><a href={`/api/download/${encodeURIComponent(movie.id)}`} download={movieFilename(movie.title)} onClick={() => { onRequested(movie); onClose(); }}><Download />Save movie</a></Button>
      </>}
    </DialogContent>
  </Dialog>;
}