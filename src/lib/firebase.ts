import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAolivM-M9ayhv8fOouLHdQBdaRZKjSA6w",
  authDomain: "barhuddle-7a6b4.firebaseapp.com",
  projectId: "barhuddle-7a6b4",
  storageBucket: "barhuddle-7a6b4.firebasestorage.app",
  messagingSenderId: "561550923046",
  appId: "1:561550923046:web:543ea4485235ea5d425de7",
  measurementId: "G-X1FJ83S64R"
};

// Initialize Firebase (singleton pattern for Next.js SSR / Fast Refresh)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, auth, googleProvider };
