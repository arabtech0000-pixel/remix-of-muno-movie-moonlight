import type { Movie } from '../types';

const words = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function searchCatalog(movies: Movie[], query: string): Movie[] {
  const terms = words(query).split(' ').filter(Boolean);
  if (!terms.length) return [];
  return movies.filter(movie => {
    const title = words(movie.title);
    const vj = words(movie.vj);
    if (terms[0] === 'vj' || terms[0] === 'veejay') {
      return vj.replace(/^vj\s+/, '') === terms.slice(1).join(' ');
    }
    return terms.every(term => `${title} ${vj}`.split(' ').some(word => word.includes(term)));
  });
}

export function mergeSearchResults(local: Movie[], remote: Movie[]): Movie[] {
  const results = new Map(local.map(movie => [movie.id, movie]));
  remote.forEach(movie => results.set(movie.id, { ...results.get(movie.id), ...movie }));
  return [...results.values()];
}