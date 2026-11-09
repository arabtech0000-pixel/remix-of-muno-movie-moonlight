export interface Movie {
  id: string;
  title: string;
  secondaryLabel?: string; // e.g. "Junior" or "Vj Ice P"
  vj: string;
  genre: string;
  year?: string;
  duration: string;
  fileSize?: string;
  rating?: string;
  narration?: string; // e.g. "English to Luganda"
  description: string;
  posterUrl: string | undefined | null;
  heroBannerUrl?: string;
  isLocked?: boolean;
  progressPercent?: number; // for continue watching
  episodesCount?: number | string;
  uploadedTimeAgo?: string;
  endpoint?: string;    // MunoWatch API endpoint
  punctuality?: string;
  videoUrl?: string;
  seriesCode?: string;
  isSeries?: boolean;
  category_id?: string;
  // TMDB Metadata fields (Source B)
  tmdbId?: number | string;
  originalTitle?: string;
  releaseDate?: string;
  voteAverage?: number;
  genresList?: string[];
  runtimeMinutes?: number;
  metadataResolved?: boolean;
}

export interface MovieCategory {
  id: string;
  title: string;
  punctuality: string;
  endpoint: string;
  movies: Movie[];
}

export interface Veejay {
  id: string;
  name: string;
  avatarColor?: string;
  movieCount?: number;
  endpoint?: string;
}

export interface Genre {
  id: string;
  name: string;
  endpoint?: string;
}

export type ActiveTab = 'home' | 'categories' | 'saved' | 'menu';
export type ViewScreen =
  | 'home'
  | 'detail'
  | 'categories'
  | 'saved'
  | 'menu'
  | 'search'
  | 'login'
  | 'notifications'
  | 'new_uploads'
  | 'shows'
  | 'recently_watched'
  | 'downloads'
  | 'settings'
  | 'account'
  | 'support'
  | 'category_view'
  | 'admin_dashboard'
  | 'avatar_picker';


