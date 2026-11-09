# Munomovies

@connector:github:"GitHub API" 

What I want you to do is to-- That's a movie streaming application, but it has some errors with fetching movies and the video player, plus the search, searching for movies. Basically, about the movie API, it has a problem. So I want the movie information to be fetched very well from the server or the API, and also the player to work, and also the app to not be laggy, and all servers should appear and everything should be appropriate as it must be.

I want to do, do I want to do, take a call to, uh, we need the source code and find out some errors. So first of all, at the hero section, movies, instead of showing the real names of the movies, they are showing what? They are showing movie numbers. So I want you to first fix that. And also... The video player isn't working. I don't know where the problem is coming from, but the movie, the video player isn't working. And also, if you go onto the search, it's not communicating well with the API, yeah? I don't know where the problem is coming from, so I want you to take a thorough checkup to every section. Yeah, and also some movie, if you go into their lists and so on, some movies do not display. If you search for a movie and it comes, the poster doesn't come. So, I want the app to have full control over the API server. So that if anything happens in the app, the app automatically talks with the API key, so that they can provide everything.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://munomovies.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/778fd744-0beb-47e9-b275-158894442f19).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Android app (APK)
1. Publish the site and connect the project to GitHub.
2. On GitHub open Actions → "Build Android APK" → Run workflow (it also runs on pushes to any branch).
3. When it finishes, download the "MunoMovies-android-apk" artifact, unzip, and install app-debug.apk on your phone (allow "install unknown apps").

The APK is an installable test build, not a Play Store release. It opens https://muno-movie-moonlight.lovable.app in a native Android window and needs internet. Publish the site first; the APK does not contain an offline copy. A successful GitHub Actions run is required before an APK artifact is available.
