import type { Movie } from '../types';

const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ');
const aliases: Record<string, string> = { 'kungu fu': 'kung fu', 'sci fi': 'sci fi', 'love story': 'romance', sports: 'sport' };
const vjName = (value: string) => normalize(value).replace(/^vj\s*/, '');

/** Never pad a category with unrelated records. */
export function filterCatalog(movies: Movie[], name: string, type: 'genre' | 'veejay'): Movie[] {
  const key = aliases[normalize(name)] || normalize(name);
  if (type === 'veejay') return movies.filter(movie => vjName(movie.vj) === vjName(name));
  if (key.startsWith('latest') || key.includes('may also like')) return movies;
  if (key === 'series') return movies.filter(movie => movie.isSeries || normalize(movie.genre) === 'series');
  // "Drama" covers the server's "Local Drama" category too.
  const keys = key === 'drama' ? ['drama', 'local drama'] : [key];
  return movies.filter(movie => movie.genre.split('/').some(genre => keys.includes(aliases[normalize(genre)] || normalize(genre))));
}