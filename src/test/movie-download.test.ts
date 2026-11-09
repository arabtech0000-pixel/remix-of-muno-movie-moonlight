import { describe, expect, it } from 'vitest';
import { movieFilename, isDownloadableMovieUrl } from '../lib/movieDownload';

describe('Movie file downloads', () => {
  it('gives Animals a usable MP4 filename', () => expect(movieFilename('Animals')).toBe('Animals.mp4'));
  it('allows real CDN MP4 files', () => expect(isDownloadableMovieUrl('https://lunoluno.b-cdn.net/timo28/tyu/Animals.mp4')).toBe(true));
  it('does not download HLS playlists as movie files', () => expect(isDownloadableMovieUrl('https://lunoluno.b-cdn.net/Animals.m3u8')).toBe(false));
  it('does not proxy arbitrary hosts', () => expect(isDownloadableMovieUrl('https://example.com/Animals.mp4')).toBe(false));
});