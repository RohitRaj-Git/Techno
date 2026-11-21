import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env?.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env?.VITE_FIREBASE_PROJECT_ID;

const isConfigured = Boolean(apiKey && projectId && apiKey !== "your_api_key_here");

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("[CareLoop] Firebase Firestore connected!");
} else {
  // Graceful local store fallback
  console.log("[CareLoop] Running with LocalStore (Firebase credentials optional)");
}

export { app, auth, db, isConfigured };
