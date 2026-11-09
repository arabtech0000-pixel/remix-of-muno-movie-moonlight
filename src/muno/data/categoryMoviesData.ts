// @ts-nocheck -- imported app code; strict typing not yet applied
import { Movie } from '../types';
import { filterCatalog } from '../services/catalogFilters';
import { getLiveMovies } from '../services/api';

const ALIASES: Record<string, string> = { 'kungu fu': 'kung fu', 'sci fi': 'sci fi', 'love story': 'romance', 'family': 'local drama' };

// Curated high quality cinematic posters fallback
const POSTERS = {
  masterplan: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  loveOfLife: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  hope: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  matchbox: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=600&q=80',
};

// Create a placeholder movie with mountain placeholder
export function makePlaceholderMovie(id: string, vj = 'Vj Junior'): Movie {
  return {
    id: `ph-${id}`,
    title: 'Upcoming Release',
    vj,
    genre: 'MunoWatch',
    duration: '01h 45m',
    description: 'Upcoming translated blockbuster streaming exclusively on MunoWatch.',
    posterUrl: '',
    isLocked: false,
  };
}

/**
 * Retrieves movies for any Category or Veejay from the real server catalog (ALL_MOVIES_FOR_SEARCH).
 * Ensures all category screens display real server movies with authentic BunnyCDN posters and streams.
 */
export function getCategoryGridMovies(categoryName: string, type: 'genre' | 'veejay'): Movie[] {
  return filterCatalog(getLiveMovies(), categoryName, type);
}
