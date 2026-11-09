import { describe, expect, it } from 'vitest';
import { isSeriesMovie, mergeSeriesEpisodes, nextSeriesEpisode } from '../muno/services/seriesEpisodes';
import type { Movie } from '../muno/types';

const first: Movie = { id: '47989', title: 'Fallout', vj: 'Vj Junior', genre: 'Series', description: 'Los Angeles', duration: '01h 06m', posterUrl: 'poster', seriesCode: '76006' };
const second: Movie = { ...first, id: '47990', title: 'Fallout 2', vj: 'MunoMovies', description: '', posterUrl: null };

describe('Series episode membership and playback', () => {
  it('recognizes series records even when legacy data omits isSeries', () => {
    expect(isSeriesMovie(first)).toBe(true);
    expect(isSeriesMovie({ ...first, genre: 'Action', seriesCode: first.id })).toBe(false);
  });
  it('retains the first episode when upstream returns only later episodes', () => {
    expect(mergeSeriesEpisodes(first, [second]).map(row => row.id)).toEqual(['47989', '47990']);
  });
  it('deduplicates the selected episode and preserves series artwork and VJ', () => {
    const rows = mergeSeriesEpisodes(first, [first, second]);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({ vj: 'Vj Junior', description: 'Los Angeles', posterUrl: 'poster', isSeries: true });
  });
  it('Next plays Fallout 2 after Fallout and does not loop at the final episode', () => {
    const rows = mergeSeriesEpisodes(first, [second]);
    expect(nextSeriesEpisode(first, rows)?.id).toBe('47990');
    expect(nextSeriesEpisode(second, rows)).toBeUndefined();
  });
  it('preserves upstream episode order instead of sorting movie IDs', () => {
    const later: Movie = { ...first, id: '47000', title: 'Fallout 3' };
    const rows = mergeSeriesEpisodes(second, [first, second, later]);
    expect(rows.map(row => row.id)).toEqual(['47989', '47990', '47000']);
    expect(nextSeriesEpisode(second, rows)?.id).toBe('47000');
  });
});
describe('Series episodes run from first to last', () => {
  it('orders episodes by S01E numbers even when upstream lists them out of order', async () => {
    const { mergeSeriesEpisodes: merge } = await import('../muno/services/seriesEpisodes');
    const base = { vj: 'Vj Junior', genre: 'Series', description: '', duration: '', posterUrl: 'p' };
    const ep1 = { ...base, id: '67581', title: 'Nocturne', videoUrl: 'x/Nocturne.2026 S01E01 Lazarus.mp4' };
    const ep3 = { ...base, id: '67590', title: 'Nocturne 3', videoUrl: 'x/Nocturne%202026%20S01E03.mp4' };
    const ep2 = { ...base, id: '67583', title: 'Nocturne 2', videoUrl: 'x/Nocturne%202026%20S01E02.mp4' };
    expect(merge(ep3 as never, [ep2, ep1] as never).map(row => row.id)).toEqual(['67581', '67583', '67590']);
  });
});
