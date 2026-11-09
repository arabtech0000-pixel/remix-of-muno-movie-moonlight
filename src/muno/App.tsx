// @ts-nocheck -- imported app code; strict typing not yet applied
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Movie, ActiveTab, ViewScreen } from './types';
import { getCategoryGridMovies } from './data/categoryMoviesData';
import { getLiveMovies } from './services/api';
import { BottomNav } from './components/common/BottomNav';
import { FeaturedHero } from './components/home/FeaturedHero';
import { PosterRow } from './components/home/PosterRow';
import { ContinueWatchingRow } from './components/home/ContinueWatchingRow';
import { MovieDetailScreen } from './components/screens/MovieDetailScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { NewUploadsScreen } from './components/screens/NewUploadsScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { ShowsScreen } from './components/screens/ShowsScreen';
import { RecentlyWatchedScreen } from './components/screens/RecentlyWatchedScreen';
import { DownloadsScreen } from './components/screens/DownloadsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { SupportScreen } from './components/screens/SupportScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AvatarPickerScreen } from './components/screens/AvatarPickerScreen';
import { PhoneSimulator } from './components/phone/PhoneSimulator';
import { VideoPlayerModal } from './components/common/VideoPlayerModal';
import { Toast } from './components/common/Toast';
import { fetchDashboardData } from './services/api';
import { openBrowserPlayerLandscape } from './services/playerPresentation';
import { MovieDownloadDialog } from './components/common/MovieDownloadDialog';
import { supabase } from '@/integrations/supabase/client';
import { isSeriesMovie, nextSeriesEpisode } from './services/seriesEpisodes';
import { loadMemberProfile, saveMemberProfile } from './services/profiles';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('Member');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<ViewScreen>('login');
  React.useEffect(() => {
    let disposed = false;
    let receivedSession = false;
    const applySession = (session) => {
      if (disposed) return;
      receivedSession = true;
      setSessionUserId(session?.user.id || null);
      setIsAuthenticated(Boolean(session));
      setUserEmail(session?.user.email || '');
      setUserName('Member'); setUserAvatar('');
      setActiveScreen(screen => session ? (screen === 'login' ? 'home' : screen) : 'login');
    };
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => applySession(session));
    void supabase.auth.getSession().then(({ data }) => { if (!receivedSession) applySession(data.session); });
    return () => { disposed = true; listener.subscription.unsubscribe(); };
  }, []);
  React.useEffect(() => {
    let disposed = false;
    setIsAdmin(false);
    if (sessionUserId) {
      void supabase.rpc('has_role', { _user_id: sessionUserId, _role: 'admin' }).then(({ data, error }) => {
        if (!disposed) setIsAdmin(!error && data === true);
      });
    }
    return () => { disposed = true; };
  }, [sessionUserId]);
  React.useEffect(() => {
    let disposed = false;
    if (sessionUserId) {
      void loadMemberProfile(sessionUserId).then(profile => {
        if (disposed) return;
        setUserName(profile.display_name);
        setUserAvatar(profile.avatar_url);
      }).catch(() => { if (!disposed) setToastMessage('Profile could not be loaded.'); });
    }
    return () => { disposed = true; };
  }, [sessionUserId]);
  const signOut = () => { void supabase.auth.signOut(); setIsAuthenticated(false); setIsAdmin(false); setActiveScreen('login'); };
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [kungfuMovies, setKungfuMovies] = useState<Movie[]>([]);
  const [animationMovies, setAnimationMovies] = useState<Movie[]>([]);
  const [vjJuniorMovies, setVjJuniorMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [downloadedMovies, setDownloadedMovies] = useState<Movie[]>([]);
  const [downloadMovie, setDownloadMovie] = useState<Movie | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [playingEpisodes, setPlayingEpisodes] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restorePlayerPresentation = useRef<(() => void) | null>(null);
  React.useEffect(() => () => { restorePlayerPresentation.current?.(); }, []);

  const handleUpdateProfile = async (name: string, avatar: string) => {
    if (!sessionUserId) return;
    try {
      await saveMemberProfile(sessionUserId, name, avatar);
      setUserName(name); setUserAvatar(avatar);
    } catch { showToast('Profile could not be saved.'); }
  };


  // Selected Category & Movies for CategoryDetailScreen
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Action');
  const [selectedCategoryType, setSelectedCategoryType] = useState<'genre' | 'veejay'>('genre');
  const [selectedCategoryMovies, setSelectedCategoryMovies] = useState<Movie[]>([]);
  const [categoryReturnScreen, setCategoryReturnScreen] = useState<ViewScreen>('categories');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  React.useEffect(() => {
    fetchDashboardData().then((data) => {
      if (data) {
        if (data.heroMovies?.length) setHeroMovies(data.heroMovies);
        if (data.latestMovies?.length) setLatestMovies(data.latestMovies);
        if (data.actionMovies?.length) setActionMovies(data.actionMovies);
        if (data.horrorMovies?.length) setHorrorMovies(data.horrorMovies);
        if (data.seriesMovies?.length) setSeriesMovies(data.seriesMovies);
        setKungfuMovies(data.scifiMovies);
        if (data.animationMovies?.length) setAnimationMovies(data.animationMovies);
        if (data.vjJuniorMovies?.length) setVjJuniorMovies(data.vjJuniorMovies);
        setRomanceMovies(data.romanceMovies);
        setDramaMovies(data.dramaMovies);

      }
    });
  }, []);

  // Scroll container and smooth vertical mouse drag scrolling for desktop
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingY = useRef(false);
  const dragYInfo = useRef({ startY: 0, scrollTop: 0, hasMoved: false });

  const handleScrollMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select, video')) return;

    if (!scrollContainerRef.current) return;
    isDraggingY.current = true;
    dragYInfo.current = {
      startY: e.clientY,
      scrollTop: scrollContainerRef.current.scrollTop,
      hasMoved: false,
    };
  };

  const handleScrollMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingY.current || !scrollContainerRef.current) return;
    const dy = e.clientY - dragYInfo.current.startY;
    if (Math.abs(dy) > 4) {
      dragYInfo.current.hasMoved = true;
    }
    scrollContainerRef.current.scrollTop = dragYInfo.current.scrollTop - dy;
  };

  const handleScrollMouseUp = () => {
    isDraggingY.current = false;
  };

  const handleTabChange = (tab: ActiveTab) => {
    setCurrentTab(tab);
    if (tab === 'home') setActiveScreen('home');
    if (tab === 'categories') setActiveScreen('categories');
    if (tab === 'saved') setActiveScreen('saved');
    if (tab === 'menu') setActiveScreen('menu');
  };

  const handleMovieClick = (movie: Movie) => {
    if (dragYInfo.current.hasMoved) {
      dragYInfo.current.hasMoved = false;
      return;
    }
    setSelectedMovie(movie);
    setActiveScreen('detail');
  };

  const handleWatchNow = (movie: Movie, episodes: Movie[] = []) => {
    if (dragYInfo.current.hasMoved) {
      dragYInfo.current.hasMoved = false;
      return;
    }
    restorePlayerPresentation.current?.();
    restorePlayerPresentation.current = openBrowserPlayerLandscape();
    setPlayingEpisodes(episodes);
    setPlayingMovie(movie);
  };

  const handleToggleSave = (movie: Movie) => {
    setSavedMovies((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleRemoveSaved = (movieId: string) => {
    setSavedMovies((prev) => prev.filter((m) => m.id !== movieId));
    showToast('Removed from MyList');
  };

  const handleDownloadMovie = (movie: Movie) => setDownloadMovie(movie);
  const handleDeleteDownload = (movieId: string) => {
    setDownloadedMovies((prev) => prev.filter((m) => m.id !== movieId));
    showToast('Removed from download history');
  };

  const handleSelectCategory = (
    name: string,
    type: 'genre' | 'veejay' = 'genre',
    returnTo: ViewScreen = 'categories'
  ) => {
    setSelectedCategoryName(name);
    setSelectedCategoryType(type);
    setCategoryReturnScreen(returnTo);
    const movies = getCategoryGridMovies(name, type);
    setSelectedCategoryMovies(movies);
    setActiveScreen('category_view');
  };

  const handleProgressUpdate = (movieId: string, progressPercent: number) => {
    setContinueWatchingMovies((prev) => {
      return prev.map((m) =>
        m.id === movieId ? { ...m, progressPercent } : m
      );
    });
  };

  return (
    <PhoneSimulator>
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleScrollMouseDown}
        onMouseMove={handleScrollMouseMove}
        onMouseUp={handleScrollMouseUp}
        onMouseLeave={handleScrollMouseUp}
        className="flex-1 overflow-y-auto scroll-container min-h-0 relative bg-[#05051F]"
      >
        {/* 1. HOME SCREEN */}
        {activeScreen === 'home' && (
          <div className="flex flex-col pb-24">
            <FeaturedHero
              movies={heroMovies}
              onHomeClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setCurrentTab('home');
                setActiveScreen('home');
              }}
              onSearchClick={() => {
                setSearchQuery('');
                setActiveScreen('search');
              }}
              onCastClick={() => showToast('Searching for Chromecast & AirPlay devices...')}
              onNotificationsClick={() => setActiveScreen('new_uploads')}
              onWatchNowClick={handleWatchNow}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Latest on MunoMovies"
              movies={latestMovies}
              onArrowClick={() => handleSelectCategory('Latest on MunoMovies', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <ContinueWatchingRow
              movies={continueWatchingMovies}
              onArrowClick={() => setActiveScreen('recently_watched')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="You may also like"
              movies={[...romanceMovies, ...dramaMovies].slice(0, 20)}
              onArrowClick={() => handleSelectCategory('You May Also Like', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Action"
              movies={actionMovies}
              onArrowClick={() => handleSelectCategory('Action', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Horror"
              movies={horrorMovies}
              onArrowClick={() => handleSelectCategory('Horror', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Series"
              movies={seriesMovies}
              onArrowClick={() => handleSelectCategory('Series', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Sci Fi"
              movies={kungfuMovies}
              onArrowClick={() => handleSelectCategory('Sci Fi', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Romance"
              movies={romanceMovies}
              onArrowClick={() => handleSelectCategory('Romance', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />

            <PosterRow
              title="Drama"
              movies={dramaMovies}
              onArrowClick={() => handleSelectCategory('Drama', 'genre', 'home')}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}

        {/* 2. MOVIE DETAIL SCREEN */}
        {activeScreen === 'detail' && (
          <MovieDetailScreen
            movie={selectedMovie}
            onBack={() => setActiveScreen('home')}
            isSaved={savedMovies.some((m) => m.id === selectedMovie.id)}
            onToggleSave={handleToggleSave}
            onMovieClick={handleMovieClick}
            onPlayMovie={handleWatchNow}
            onDownloadMovie={handleDownloadMovie}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Open an episode and use Cast in the player.')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
            onShowToast={showToast}
            relatedMovies={latestMovies.filter(m => m.id !== selectedMovie.id)}
            catalog={getLiveMovies()}
            onSelectCategory={(name) => handleSelectCategory(name, 'genre', 'detail')}
          />
        )}

        {/* 3. CATEGORIES SCREEN (Genre & Veejay Tabs) */}
        {activeScreen === 'categories' && (
          <CategoriesScreen
            onBack={() => {
              setActiveScreen('home');
              setCurrentTab('home');
            }}
            onSelectCategory={(name, type) => handleSelectCategory(name, type, 'categories')}
            catalog={getLiveMovies()}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Open a movie and tap the cast button in the player to send it to your TV.')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 4. CATEGORY DETAIL SCREEN */}
        {activeScreen === 'category_view' && (
          <CategoryDetailScreen
            categoryTitle={selectedCategoryName}
            categoryType={selectedCategoryType}
            movies={selectedCategoryMovies}
            onBack={() => setActiveScreen(categoryReturnScreen || 'categories')}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Open a movie and tap the cast button in the player to send it to your TV.')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 5. SAVED SCREEN */}
        {activeScreen === 'saved' && (
          <SavedScreen
            savedMovies={savedMovies}
            onBack={() => {
              setActiveScreen('home');
              setCurrentTab('home');
            }}
            onMovieClick={handleMovieClick}
            onRemoveMovie={handleRemoveSaved}
            onExploreClick={() => {
              setActiveScreen('home');
              setCurrentTab('home');
            }}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Open a movie and tap the cast button in the player to send it to your TV.')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 6. APP MENU SCREEN */}
        {activeScreen === 'menu' && (
          <MenuScreen
            onClose={() => {
              setActiveScreen('home');
              setCurrentTab('home');
            }}
            onNavigate={(screen) => setActiveScreen(screen)}
            onLogout={signOut}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            isAdmin={isAdmin}
          />
        )}

        {/* 7. TV SHOWS SCREEN */}
        {activeScreen === 'shows' && (
          <ShowsScreen
            onBack={() => setActiveScreen('home')}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Cast device connected')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 8. YOU RECENTLY WATCHED SCREEN */}
        {activeScreen === 'recently_watched' && (
          <RecentlyWatchedScreen
            onBack={() => setActiveScreen('home')}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Cast device connected')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 9. MY DOWNLOADS SCREEN */}
        {activeScreen === 'downloads' && (
          <DownloadsScreen
            downloadedMovies={downloadedMovies}
            onDeleteDownload={handleDeleteDownload}
            onPlayMovie={handleDownloadMovie}
            onExploreClick={() => {
              setActiveScreen('home');
              setCurrentTab('home');
            }}
            onBack={() => setActiveScreen('home')}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Cast device connected')}
            onNotificationsClick={() => setActiveScreen('new_uploads')}
          />
        )}

        {/* 10. MY ACCOUNT SCREEN */}
        {activeScreen === 'account' && (
          <AccountScreen
            onBack={() => setActiveScreen('menu')}
            onLogout={signOut}
            onShowToast={showToast}
            isAdmin={isAdmin}
            onOpenAdmin={() => setActiveScreen('admin_dashboard')}
            userName={userName}
            userEmail={userEmail}
            onUpdateProfile={handleUpdateProfile}
            userAvatar={userAvatar}
            onOpenAvatarPicker={() => setActiveScreen('avatar_picker')}
          />
        )}

        {/* 10B. FULL-PAGE AVATAR PICKER SCREEN */}
        {activeScreen === 'avatar_picker' && (
          <AvatarPickerScreen
            onBack={() => setActiveScreen('account')}
            currentAvatar={userAvatar}
            onSaveAvatar={(avatarUrl) => {
              void handleUpdateProfile(userName, avatarUrl);
            }}
            onShowToast={showToast}
          />
        )}

        {/* 11. SETTINGS SCREEN */}
        {activeScreen === 'settings' && (
          <SettingsScreen
            onBack={() => setActiveScreen('home')}
            onLogout={signOut}
          />
        )}

        {/* 12. NEW UPLOADS SCREEN */}
        {(activeScreen === 'notifications' || activeScreen === 'new_uploads') && (
          <NewUploadsScreen
            onBack={() => setActiveScreen('home')}
            onMovieClick={handleMovieClick}
            onSearchClick={() => setActiveScreen('search')}
            onCastClick={() => showToast('Cast device connected')}
            onNotificationsClick={() => {}}
          />
        )}

        {/* 13. SEARCH SCREEN */}
        {activeScreen === 'search' && (
          <SearchScreen
            initialQuery={searchQuery}
            onBack={() => setActiveScreen('home')}
            onMovieClick={handleMovieClick}
            onCastClick={() => showToast('Cast device connected')}
          />
        )}

        {/* 14. LOGIN / SIGN UP SCREEN */}
        {activeScreen === 'login' && (
          <LoginScreen
            onBack={isAuthenticated ? () => setActiveScreen('home') : undefined}
            isFirstLaunch={!isAuthenticated}
            onLoginSuccess={() => { /* Cloud session listener owns authentication. */ }}
            onShowToast={showToast}
          />
        )}

        {/* 15. ADMIN DASHBOARD SCREEN */}
        {activeScreen === 'admin_dashboard' && isAuthenticated && (
          <AdminDashboardScreen
            onBack={() => setActiveScreen('account')}
            onLogout={signOut}
            onShowToast={showToast}
            movies={getLiveMovies()}
          />
        )}
      </div>

      <MovieDownloadDialog movie={downloadMovie} onClose={() => setDownloadMovie(null)} onRequested={(movie) => {
        setDownloadedMovies(previous => [movie, ...previous.filter(item => item.id !== movie.id)]);
        showToast('Download requested. Check your browser downloads.');
      }} />

      {/* Floating In-App Toast */}
      <Toast message={toastMessage} />

      {/* Support Action Sheet Modal */}
      {isSupportModalOpen && (
        <SupportScreen
          onBack={() => setIsSupportModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Video Streaming Player Modal */}
      {playingMovie && (
        <VideoPlayerModal
          movie={playingMovie}
          recommendations={isSeriesMovie(playingMovie) ? playingEpisodes : latestMovies}
          nextMovie={isSeriesMovie(playingMovie) ? nextSeriesEpisode(playingMovie, playingEpisodes) : undefined}
          onPlayNext={setPlayingMovie}
          onClose={() => {
            restorePlayerPresentation.current?.();
            restorePlayerPresentation.current = null;
            setPlayingMovie(null);
          }}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {/* Fixed Bottom Navigation Bar */}
      {activeScreen !== 'login' && !playingMovie && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          savedCount={savedMovies.length}
        />
      )}
    </PhoneSimulator>
  );
}
