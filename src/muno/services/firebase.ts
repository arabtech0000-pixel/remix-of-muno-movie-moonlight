/**
 * Firebase Web Configuration & Initialization
 * Project: munomoviess
 * Features: Google Auth, Email/Password Auth, Realtime Database
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User 
} from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAmx1I4mG4OQ1IzurqrFD-E56-OJv7ug5k",
  authDomain: "munomoviess.firebaseapp.com",
  databaseURL: "https://munomoviess-default-rtdb.firebaseio.com",
  projectId: "munomoviess",
  storageBucket: "munomoviess.firebasestorage.app",
  messagingSenderId: "86379072218",
  appId: "1:86379072218:web:e1481fb579c5a7dc98b3e3",
  measurementId: "G-9N7M22YQW0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Save user profile in Realtime Database
    void saveProfile(user).catch(() => {});
    return user;
  } catch (error) {
    console.error("Google Auth error:", error);
    throw error;
  }
}

async function saveProfile(user: User, name?: string) {
  const existing = await get(ref(db, `users/${user.uid}`));
  const prev = existing.exists() ? existing.val() : {};
  await set(ref(db, `users/${user.uid}`), {
    ...prev,
    uid: user.uid,
    displayName: name || prev.displayName || user.displayName || 'Member',
    email: user.email,
    photoURL: prev.photoURL || user.photoURL || '',
    lastLogin: Date.now(),
  });
}

export async function readProfile(uid: string) {
  try {
    const snap = await get(ref(db, `users/${uid}`));
    return snap.exists() ? snap.val() : null;
  } catch { return null; }
}

export async function updateProfileData(displayName: string, photoURL: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const prev = (await readProfile(user.uid)) || {};
  await set(ref(db, `users/${user.uid}`), { ...prev, displayName, photoURL });
}

// Email/password: no email verification step, users go straight in.
export async function registerWithEmail(email: string, password: string, name: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  void saveProfile(user, name).catch(() => {});
  return user;
}

export async function loginWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  void saveProfile(user).catch(() => {});
  return user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}

// Realtime Database Watchlist / Saved Helpers
export async function saveMovieToDatabase(userId: string, movie: any) {
  try {
    await set(ref(db, `users/${userId}/watchlist/${movie.id}`), {
      ...movie,
      savedAt: Date.now()
    });
  } catch (error) {
    console.error("Database save error:", error);
  }
}

export async function removeMovieFromDatabase(userId: string, movieId: string) {
  try {
    await remove(ref(db, `users/${userId}/watchlist/${movieId}`));
  } catch (error) {
    console.error("Database remove error:", error);
  }
}
