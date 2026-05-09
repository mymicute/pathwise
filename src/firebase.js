import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ REPLACE WITH YOUR FIREBASE CONFIG FROM CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyA00xbKWi8AZZTAADr0oShWXQOjEPMc2AE",
  authDomain: "pathwise-1b8d5.firebaseapp.com",
  projectId: "pathwise-1b8d5",
  storageBucket: "pathwise-1b8d5.firebasestorage.app",
  messagingSenderId: "274028120906",
  appId: "1:274028120906:web:dcf484fe1461ec26c38fb3",
  measurementId: "G-49SV62ED4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Customize Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});