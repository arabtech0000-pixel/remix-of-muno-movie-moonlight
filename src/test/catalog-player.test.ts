import { describe, expect, it } from 'vitest';
import { filterCatalog } from '../muno/services/catalogFilters';
import { seekTime } from '../muno/services/playerControls';
import type { Movie } from '../muno/types';

const movie = (id: string, vj: string, genre = 'Action'): Movie => ({ id, title: id, vj, genre, duration: '', description: '', posterUrl: '' });
const movies = [movie('junior', 'Vj Junior'), movie('jingo', 'Vj Jingo'), movie('jovan', 'Vj Jovan'), movie('sport', 'Vj Hd', 'Sport')];

describe('Exact catalog membership', () => {
  it('Vj Jovan contains only Jovan, never Junior', () => expect(filterCatalog(movies, 'Vj Jovan', 'veejay').map(m => m.id)).toEqual(['jovan']));
  it('Vj Jingo contains only Jingo, never Junior', () => expect(filterCatalog(movies, 'Vj Jingo', 'veejay').map(m => m.id)).toEqual(['jingo']));
  it('Vj Junior contains only Junior', () => expect(filterCatalog(movies, 'Vj Junior', 'veejay').map(m => m.id)).toEqual(['junior']));
  it('Sport contains sports only even with fewer than twelve matches', () => expect(filterCatalog(movies, 'Sport', 'genre').map(m => m.id)).toEqual(['sport']));
  it('an unavailable category stays empty rather than showing unrelated films', () => expect(filterCatalog(movies, 'Animation', 'genre')).toEqual([]));
  it('Drama also includes Local Drama titles', () => {
    const list = [movie('local', 'Vj Emmy', 'Local Drama'), movie('drama', 'Vj Emmy', 'Drama'), movie('action', 'Vj Emmy', 'Action')];
    expect(filterCatalog(list, 'Drama', 'genre').map(m => m.id)).toEqual(['local', 'drama']);
  });
});
describe('Ten-second player controls', () => {
  it('rewinds ten seconds', () => expect(seekTime(25, -10, 100)).toBe(15));
  it('forwards ten seconds', () => expect(seekTime(25, 10, 100)).toBe(35));
  it('never seeks before zero', () => expect(seekTime(5, -10, 100)).toBe(0));
  it('never seeks past the end', () => expect(seekTime(95, 10, 100)).toBe(100));
});