import { describe, expect, it } from 'vitest';
import { searchCatalog, mergeSearchResults } from '../muno/services/catalogSearch';
import type { Movie } from '../muno/types';

const movie = (id: string, title: string, vj: string): Movie => ({ id, title, vj, genre: 'Action', duration: '', description: '', posterUrl: '' });
const movies = [movie('1', 'The Florist', 'Vj Emmy'), movie('2', 'Alien', 'Vj Junior'), movie('3', 'Alien 2', 'Vj Jovan')];
describe('Movie search', () => {
  it('finds movie titles without case sensitivity', () => expect(searchCatalog(movies, 'FLORIST').map(m => m.id)).toEqual(['1']));
  it('Vj Junior searches never include Jovan', () => expect(searchCatalog(movies, 'Vj Junior').map(m => m.id)).toEqual(['2']));
  it('Vj Jovan searches never include Junior', () => expect(searchCatalog(movies, 'Vj Jovan').map(m => m.id)).toEqual(['3']));
  it('merges matching server results without duplicate IDs', () => expect(mergeSearchResults(movies, [movies[0] as Movie]).map(m => m.id)).toEqual(['1', '2', '3']));
});