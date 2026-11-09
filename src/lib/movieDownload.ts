export function movieFilename(title: string, extension = 'mp4') {
  const name = title.replace(/[^a-zA-Z0-9 _.-]/g, '').trim().slice(0, 120) || 'MunoMovies';
  return `${name}.${extension}`;
}

export function isDownloadableMovieUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.b-cdn.net') && /\.(mp4|m4v|webm)$/i.test(url.pathname);
  } catch { return false; }
}