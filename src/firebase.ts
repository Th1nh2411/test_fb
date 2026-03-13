// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────
// Firebase config values come from .env (Vite exposes them via
// import.meta.env).  Copy .env.example → .env and fill in yours.
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
