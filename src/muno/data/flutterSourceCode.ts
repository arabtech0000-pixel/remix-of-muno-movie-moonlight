export interface FlutterFile {
  path: string;
  name: string;
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    description: 'Flutter project dependencies & asset definitions',
    content: `name: munowatch_app
description: "MunoWatch-Inspired Movie Streaming App UI in Flutter"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    description: 'Application entry point & root configuration',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set immersive dark status bar style for Android phones
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF07072C),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const MunoWatchApp());
}
`
  },
  {
    path: 'lib/app.dart',
    name: 'app.dart',
    description: 'MaterialApp setup with MunoWatch dark theme',
    content: `import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/main_shell.dart';

class MunoWatchApp extends StatelessWidget {
  const MunoWatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MunoWatch',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainShell(),
    );
  }
}
`
  },
  {
    path: 'lib/theme/app_colors.dart',
    name: 'app_colors.dart',
    description: 'Centralized MunoWatch dark navy and green color palette',
    content: `import 'package:flutter/material.dart';

class AppColors {
  // Primary dark navy background from MunoWatch screenshot
  static const Color primaryBackground = Color(0xFF05051F);
  
  // Slightly lighter secondary navy for cards and sheets
  static const Color secondaryBackground = Color(0xFF08082D);
  
  // Bottom navigation background
  static const Color bottomNavBackground = Color(0xFF07072C);
  
  // Card and dialog background
  static const Color cardBackground = Color(0xFF111128);
  
  // Iconic vibrant MunoWatch green accent
  static const Color accentGreen = Color(0xFF00D522);
  
  // Text colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFD0D0D8);
  static const Color textMuted = Color(0xFF9292A5);
  
  // Badges & borders
  static const Color lockBadgeBg = Color(0x66000000);
  static const Color borderSubtle = Color(0xFF1B1B3A);
}
`
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    description: 'Material 3 Dark Theme configured for cinematic streaming',
    content: `import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.primaryBackground,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accentGreen,
        secondary: AppColors.accentGreen,
        surface: AppColors.secondaryBackground,
        surfaceTint: Colors.transparent,
      ),
      fontFamily: 'sans-serif',
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/models/movie_model.dart',
    name: 'movie_model.dart',
    description: 'Movie and media data model',
    content: `class Movie {
  final String id;
  final String title;
  final String? secondaryLabel;
  final String vj;
  final String genre;
  final String duration;
  final String? fileSize;
  final String? rating;
  final String narration;
  final String description;
  final String posterUrl;
  final String? heroBannerUrl;
  final bool isLocked;
  final double? progressPercent;

  const Movie({
    required this.id,
    required this.title,
    this.secondaryLabel,
    required this.vj,
    required this.genre,
    required this.duration,
    this.fileSize,
    this.rating,
    this.narration = 'English to Luganda',
    required this.description,
    required this.posterUrl,
    this.heroBannerUrl,
    this.isLocked = true,
    this.progressPercent,
  });
}
`
  },
  {
    path: 'lib/data/sample_movies.dart',
    name: 'sample_movies.dart',
    description: 'Sample data directly matching the MunoWatch screenshots',
    content: `import '../models/movie_model.dart';

class SampleMovies {
  static const Movie featuredMovie = Movie(
    id: 'under-water',
    title: 'Under Water',
    secondaryLabel: 'Junior',
    vj: 'Vj Junior',
    genre: 'Sci-Fi / Thriller',
    duration: '01h 35m',
    fileSize: '1.45 GB',
    rating: '16+',
    description:
        'A crew of oceanic researchers working for a deep-sea drilling company try to get to safety after a mysterious earthquake ravages their subterranean facility.',
    posterUrl: '',
    heroBannerUrl: '',
    isLocked: true,
  );

  static const List<Movie> latestOnMunowatch = [
    Movie(
      id: 'lilian',
      title: 'Lilian on Music, Loss AND HEALING',
      vj: 'Vj Emmy',
      genre: 'Documentary',
      duration: '01h 15m',
      description: 'Intimate conversation on grief, healing, and music.',
      posterUrl: '',
      isLocked: false,
    ),
    Movie(
      id: 'masterplan',
      title: 'Masterplan',
      secondaryLabel: 'Junior',
      vj: 'Vj Junior',
      genre: 'Crime / Heist',
      duration: '01h 41m',
      description: 'A master thief enlists two strangers for a Louvre heist.',
      posterUrl: '',
      isLocked: true,
    ),
    Movie(
      id: 'love-of-your-life',
      title: 'Love of Your Life',
      secondaryLabel: 'Junior',
      vj: 'Vj Junior',
      genre: 'Drama',
      duration: '01h 43m',
      description: 'Maya, a smart, wry nurse, is swept up in an immersive love.',
      posterUrl: '',
      isLocked: true,
    ),
    Movie(
      id: 'sardar',
      title: 'Sardar 4',
      secondaryLabel: 'Ice P',
      vj: 'Vj Ice P',
      genre: 'Action',
      duration: '01h 27m',
      description: 'A spy estranged from his family meets his police officer son.',
      posterUrl: '',
      isLocked: true,
    ),
  ];

  static const List<Movie> continueWatching = [
    Movie(
      id: 'nirvana',
      title: 'Love of Nirvana',
      vj: 'Vj Junior',
      genre: 'Historical',
      duration: '45m / ep',
      description: 'Xiao Wuxia endures humiliation to uncover the family truth.',
      posterUrl: '',
      progressPercent: 0.68,
      isLocked: true,
    ),
    Movie(
      id: 'fallout',
      title: 'Fallout',
      vj: 'Vj Junior',
      genre: 'Sci-Fi',
      duration: '58m / ep',
      description: 'Survivors in underground vault face the surface wasteland.',
      posterUrl: '',
      progressPercent: 0.35,
      isLocked: true,
    ),
    Movie(
      id: 'snow-eagle',
      title: 'Snow Eagle Lord',
      vj: 'Vj Emmy',
      genre: 'Fantasy',
      duration: '42m / ep',
      description: 'Legendary martial arts journey across snow peaks.',
      posterUrl: '',
      progressPercent: 0.82,
      isLocked: true,
    ),
  ];
}
`
  },
  {
    path: 'lib/screens/main_shell.dart',
    name: 'main_shell.dart',
    description: '4-tab main navigation shell holding Home, Categories, Saved, and Menu',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/bottom_navigation.dart';
import 'home_screen.dart';
import 'categories_screen.dart';
import 'saved_screen.dart';
import 'app_menu_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    CategoriesScreen(),
    SavedScreen(),
    AppMenuScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: MunoBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    description: 'MunoWatch Home screen matching reference screenshot layout',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../data/sample_movies.dart';
import '../widgets/home_header.dart';
import '../widgets/featured_movie_banner.dart';
import '../widgets/movie_section_header.dart';
import '../widgets/horizontal_movie_poster_list.dart';
import '../widgets/continue_watching_section.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      body: SafeArea(
        top: true,
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Top Header (Logo + Cast, Bell, Search)
              const HomeHeader(),
              
              // 2. Featured Cinematic Movie Banner
              const FeaturedMovieBanner(
                movie: SampleMovies.featuredMovie,
              ),

              const SizedBox(height: 18),

              // 3. Latest on Munowatch Section
              MovieSectionHeader(
                title: 'Latest on Munowatch',
                onArrowTap: () {},
              ),
              const SizedBox(height: 10),
              const HorizontalMoviePosterList(
                movies: SampleMovies.latestOnMunowatch,
              ),

              const SizedBox(height: 22),

              // 4. Continue watching Section
              MovieSectionHeader(
                title: 'Continue watching',
                onArrowTap: () {},
              ),
              const SizedBox(height: 10),
              const ContinueWatchingSection(
                movies: SampleMovies.continueWatching,
              ),

              // Bottom padding so content scrolls freely above bottom bar
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/home_header.dart',
    name: 'home_header.dart',
    description: 'Header with MN stylized logo, Chromecast, Notification bell, and Search',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      color: AppColors.primaryBackground,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Stylized MN brand logo
          Row(
            children: [
              RichText(
                text: const TextSpan(
                  children: [
                    TextSpan(
                      text: 'M',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 22,
                        letterSpacing: -1,
                      ),
                    ),
                    TextSpan(
                      text: 'W',
                      style: TextStyle(
                        color: AppColors.accentGreen,
                        fontWeight: FontWeight.w900,
                        fontSize: 22,
                        letterSpacing: -1,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Right: Action Icons (Cast, Notification, Search)
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.cast, color: Colors.white, size: 22),
                onPressed: () {},
                splashRadius: 20,
              ),
              IconButton(
                icon: const Icon(Icons.notifications_none, color: Colors.white, size: 22),
                onPressed: () {},
                splashRadius: 20,
              ),
              IconButton(
                icon: const Icon(Icons.search, color: Colors.white, size: 22),
                onPressed: () {},
                splashRadius: 20,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/featured_movie_banner.dart',
    name: 'featured_movie_banner.dart',
    description: 'Cinematic hero banner with dark gradient, green play button, and title',
    content: `import 'package:flutter/material.dart';
import '../models/movie_model.dart';
import '../theme/app_colors.dart';

class FeaturedMovieBanner extends StatelessWidget {
  final Movie movie;

  const FeaturedMovieBanner({
    super.key,
    required this.movie,
  });

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Stack(
      children: [
        // Cinematic background image
        SizedBox(
          height: screenHeight * 0.44,
          width: double.infinity,
          child: Image.network(
            movie.heroBannerUrl ?? movie.posterUrl,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              color: AppColors.secondaryBackground,
            ),
          ),
        ),

        // Dark gradient overlays matching MunoWatch reference
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppColors.primaryBackground.withOpacity(0.4),
                  Colors.transparent,
                  AppColors.primaryBackground.withOpacity(0.85),
                  AppColors.primaryBackground,
                ],
                stops: const [0.0, 0.25, 0.75, 1.0],
              ),
            ),
          ),
        ),

        // Featured Content (Title, VJ label, Description, Watch Now Button)
        Positioned(
          left: 16,
          right: 20,
          bottom: 12,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Title and secondary VJ tag
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '\${movie.title} :',
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  if (movie.secondaryLabel != null) ...[
                    const SizedBox(width: 8),
                    Text(
                      movie.secondaryLabel!,
                      style: const TextStyle(
                        color: AppColors.accentGreen,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: 6),

              // Description
              Text(
                movie.description,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                  height: 1.35,
                ),
              ),

              const SizedBox(height: 14),

              // Watch Now action row with large green play circle
              InkWell(
                onTap: () {},
                borderRadius: BorderRadius.circular(30),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Green circular play button
                    Container(
                      width: 54,
                      height: 54,
                      decoration: const BoxDecoration(
                        color: AppColors.accentGreen,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Color(0x5500D522),
                            blurRadius: 16,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.play_arrow,
                          color: Colors.white,
                          size: 32,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    const Text(
                      'Watch Now',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
`
  },
  {
    path: 'lib/widgets/movie_section_header.dart',
    name: 'movie_section_header.dart',
    description: 'Header for Latest and Continue Watching sections with right arrow',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class MovieSectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback onArrowTap;

  const MovieSectionHeader({
    super.key,
    required this.title,
    required this.onArrowTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 18,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.3,
            ),
          ),
          IconButton(
            icon: const Icon(
              Icons.arrow_forward,
              color: Colors.white,
              size: 20,
            ),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            onPressed: onArrowTap,
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/horizontal_movie_poster_list.dart',
    name: 'horizontal_movie_poster_list.dart',
    description: 'Horizontal scrollable row for portrait posters with partial peek',
    content: `import 'package:flutter/material.dart';
import '../models/movie_model.dart';
import 'movie_poster_card.dart';

class HorizontalMoviePosterList extends StatelessWidget {
  final List<Movie> movies;

  const HorizontalMoviePosterList({
    super.key,
    required this.movies,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 210,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: movies.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (context, index) {
          final movie = movies[index];
          return MoviePosterCard(
            movie: movie,
            width: 140,
            height: 210,
          );
        },
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/movie_poster_card.dart',
    name: 'movie_poster_card.dart',
    description: 'Portrait poster card with rounded corners and lock badge',
    content: `import 'package:flutter/material.dart';
import '../models/movie_model.dart';
import '../theme/app_colors.dart';

class MoviePosterCard extends StatelessWidget {
  final Movie movie;
  final double width;
  final double height;
  final VoidCallback? onTap;

  const MoviePosterCard({
    super.key,
    required this.movie,
    this.width = 140,
    this.height = 210,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: AppColors.cardBackground,
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              movie.posterUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: AppColors.secondaryBackground,
                child: Center(
                  child: Text(
                    movie.title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
              ),
            ),

            // Top-left Lock badge (from MunoWatch screenshot)
            if (movie.isLocked)
              Positioned(
                top: 6,
                left: 6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.55),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Icon(
                    Icons.lock,
                    color: Colors.white,
                    size: 14,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/continue_watching_section.dart',
    name: 'continue_watching_section.dart',
    description: 'Horizontal thumbnails with progress bar for continue watching',
    content: `import 'package:flutter/material.dart';
import '../models/movie_model.dart';
import '../theme/app_colors.dart';

class ContinueWatchingSection extends StatelessWidget {
  final List<Movie> movies;

  const ContinueWatchingSection({
    super.key,
    required this.movies,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 160,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: movies.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (context, index) {
          final movie = movies[index];
          return Container(
            width: 120,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: AppColors.cardBackground,
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  movie.posterUrl,
                  fit: BoxFit.cover,
                ),
                // Lock icon
                if (movie.isLocked)
                  Positioned(
                    top: 6,
                    left: 6,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.55),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Icon(
                        Icons.lock,
                        color: Colors.white,
                        size: 13,
                      ),
                    ),
                  ),

                // Playback progress indicator along bottom edge
                if (movie.progressPercent != null)
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: LinearProgressIndicator(
                      value: movie.progressPercent!,
                      backgroundColor: Colors.white24,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.accentGreen,
                      ),
                      minHeight: 3,
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/bottom_navigation.dart',
    name: 'bottom_navigation.dart',
    description: 'Fixed 4-destination bottom bar (Home, Categories, Saved, Menu)',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class MunoBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const MunoBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.bottomNavBackground,
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_filled, 'Home'),
              _buildNavItem(1, Icons.sort, 'Categories'),
              _buildNavItem(2, Icons.bookmark_border, 'Saved'),
              _buildNavItem(3, Icons.menu, 'Menu'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = currentIndex == index;
    final color = isSelected ? Colors.white : AppColors.textMuted;

    return InkWell(
      onTap: () => onTap(index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/categories_screen.dart',
    name: 'categories_screen.dart',
    description: 'Categories & Veejays tabs from reference screenshots',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  bool _isGenreSelected = true;

  final List<String> _genres = const [
    'Action', 'Horror', 'Series', 'Adventure', 'Love Story',
    'Comedy', 'Crime', 'Family', 'Sci FI', 'Romance',
    'Kungu Fu', 'Drama', 'Sport', 'Thriller', 'Animation'
  ];

  final List<String> _veejays = const [
    'Vj Junior', 'Vj Emmy', 'Vj Ice P', 'Vj Tom', 'Vj Ulio',
    'Vj Jingo', 'Vj Shao Khan', 'Vj Sammy', 'Vj Nelly', 'Vj Soul',
    'Vj Kevo', 'Vj Kevin', 'Vj Kriss Sweet', 'Vj Hd', 'Vj Dan De'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        leading: const Icon(Icons.arrow_back, color: Colors.white),
        title: const Text('Genres'),
        actions: const [
          Icon(Icons.cast, color: Colors.white),
          SizedBox(width: 16),
          Icon(Icons.notifications_none, color: Colors.white),
          SizedBox(width: 16),
          Icon(Icons.search, color: Colors.white),
          SizedBox(width: 16),
        ],
      ),
      body: Column(
        children: [
          // Subtabs: Genre vs Veejays
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                GestureDetector(
                  onTap: () => setState(() => _isGenreSelected = true),
                  child: Row(
                    children: [
                      Icon(
                        _isGenreSelected ? Icons.check : Icons.filter_list,
                        color: _isGenreSelected ? AppColors.accentGreen : AppColors.textMuted,
                        size: 20,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Genre',
                        style: TextStyle(
                          color: _isGenreSelected ? Colors.white : AppColors.textMuted,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => setState(() => _isGenreSelected = false),
                  child: Row(
                    children: [
                      Icon(
                        !_isGenreSelected ? Icons.check : Icons.filter_list,
                        color: !_isGenreSelected ? AppColors.accentGreen : AppColors.textMuted,
                        size: 20,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Veejays',
                        style: TextStyle(
                          color: !_isGenreSelected ? Colors.white : AppColors.textMuted,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _isGenreSelected ? _genres.length : _veejays.length,
              itemBuilder: (context, index) {
                final item = _isGenreSelected ? _genres[index] : _veejays[index];
                return ListTile(
                  leading: Icon(
                    _isGenreSelected ? Icons.water_drop : Icons.account_circle,
                    color: AppColors.accentGreen,
                  ),
                  title: Text(
                    item,
                    style: const TextStyle(color: Colors.white, fontSize: 16),
                  ),
                  onTap: () {},
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/saved_screen.dart',
    name: 'saved_screen.dart',
    description: 'Saved / Watchlist screen matching Screenshot 1',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class SavedScreen extends StatelessWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        leading: const Icon(Icons.arrow_back, color: Colors.white),
        title: const Text('Saved'),
        actions: const [
          Icon(Icons.cast, color: Colors.white),
          SizedBox(width: 16),
          Icon(Icons.notifications_none, color: Colors.white),
          SizedBox(width: 16),
          Icon(Icons.search, color: Colors.white),
          SizedBox(width: 16),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.add, color: Colors.white, size: 64),
              SizedBox(height: 16),
              Text(
                'To keep track of the movies that you want to watch, just tap watch Add Mylist icon.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/app_menu_screen.dart',
    name: 'app_menu_screen.dart',
    description: 'App Menu drawer screen matching Screenshot 4',
    content: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AppMenuScreen extends StatelessWidget {
  const AppMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final menuItems = [
      {'icon': Icons.home, 'label': 'HOME'},
      {'icon': Icons.movie_filter, 'label': 'SHOWS'},
      {'icon': Icons.bookmark_border, 'label': 'SAVED'},
      {'icon': Icons.history, 'label': 'RECENTLY WATCHED'},
      {'icon': Icons.arrow_circle_down, 'label': 'DOWNLOADS'},
      {'icon': Icons.settings, 'label': 'SETTINGS'},
      {'icon': Icons.account_circle, 'label': 'MY ACCOUNT'},
      {'icon': Icons.headset_mic, 'label': 'SUPPORT'},
      {'icon': Icons.power_settings_new, 'label': 'LOG OUT'},
    ];

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        leading: const Icon(Icons.close, color: Colors.white),
        centerTitle: true,
        title: const Text(
          'APP MENU',
          style: TextStyle(
            letterSpacing: 1.5,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        itemCount: menuItems.length,
        itemBuilder: (context, index) {
          final item = menuItems[index];
          return ListTile(
            leading: Icon(
              item['icon'] as IconData,
              color: Colors.white,
              size: 24,
            ),
            title: Text(
              item['label'] as String,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 15,
                letterSpacing: 1.1,
              ),
            ),
            onTap: () {},
          );
        },
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/category_detail_screen.dart',
    name: 'category_detail_screen.dart',
    description: '3-Column dense poster grid view for any Genre or Veejay with search',
    content: `import 'package:flutter/material.dart';
import '../models/movie_model.dart';
import '../theme/app_colors.dart';
import '../widgets/movie_poster_card.dart';
import '../data/sample_movies.dart';

class CategoryDetailScreen extends StatefulWidget {
  final String categoryTitle;
  final bool isVeejay;

  const CategoryDetailScreen({
    super.key,
    required this.categoryTitle,
    this.isVeejay = false,
  });

  @override
  State<CategoryDetailScreen> createState() => _CategoryDetailScreenState();
}

class _CategoryDetailScreenState extends State<CategoryDetailScreen> {
  bool _isSearchActive = false;
  final TextEditingController _searchController = TextEditingController();
  late List<Movie> _movies;

  @override
  void initState() {
    super.initState();
    _movies = _generateCategoryMovies(widget.categoryTitle, widget.isVeejay);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Movie> _generateCategoryMovies(String title, bool isVj) {
    final basePool = [
      ...SampleMovies.latestOnMunowatch,
      ...SampleMovies.continueWatching,
      SampleMovies.featuredMovie,
    ];

    return List.generate(15, (index) {
      final base = basePool[index % basePool.length];
      return Movie(
        id: '\${title.toLowerCase()}-$index',
        title: '\${widget.categoryTitle} Release #\${index + 1}',
        vj: isVj ? widget.categoryTitle : (index % 2 == 0 ? 'Vj Junior' : 'Vj Emmy'),
        genre: isVj ? 'Action / Drama' : widget.categoryTitle,
        duration: '01h 45m',
        fileSize: '1.45 GB',
        description: 'Exclusive Ugandan Luganda translated movie on MunoWatch.',
        posterUrl: base.posterUrl,
        isLocked: true,
      );
    });
  }

  List<Movie> get _filteredMovies {
    final q = _searchController.text.trim().toLowerCase();
    if (q.isEmpty) return _movies;
    return _movies.where((m) => m.title.toLowerCase().contains(q) || m.vj.toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final movies = _filteredMovies;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        backgroundColor: AppColors.primaryBackground,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.categoryTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.cast, color: Colors.white),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Scanning for TV screens...')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(
              _isSearchActive ? Icons.close : Icons.search,
              color: _isSearchActive ? AppColors.accentGreen : Colors.white,
            ),
            onPressed: () {
              setState(() {
                _isSearchActive = !_isSearchActive;
                if (!_isSearchActive) _searchController.clear();
              });
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          if (_isSearchActive)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: TextField(
                controller: _searchController,
                autofocus: true,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Search in \${widget.categoryTitle}...',
                  hintStyle: const TextStyle(color: AppColors.textMuted),
                  prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.secondaryBackground,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
                onChanged: (_) => setState(() {}),
              ),
            ),
          Expanded(
            child: movies.isEmpty
                ? const Center(
                    child: Text(
                      'No movies found',
                      style: TextStyle(color: AppColors.textMuted),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(10),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 2 / 3,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: movies.length,
                    itemBuilder: (context, index) {
                      final movie = movies[index];
                      return MoviePosterCard(
                        movie: movie,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Selected \${movie.title} (\${movie.vj})'),
                              duration: const Duration(seconds: 1),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
`
  }
];
