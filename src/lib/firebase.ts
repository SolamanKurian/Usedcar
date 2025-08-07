import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXcdVMR6-XN2uj_559DyuzlLkxLa8kCGg",
  authDomain: "usedcar-d45f4.firebaseapp.com",
  projectId: "usedcar-d45f4",
  storageBucket: "usedcar-d45f4.firebasestorage.app",
  messagingSenderId: "329870473671",
  appId: "1:329870473671:web:a5276eabb7d933d88781e2"
};

// Since we have hardcoded config, Firebase is configured
const isFirebaseConfigured = true;

// Initialize Firebase
let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create dummy objects to prevent crashes
  app = null;
  auth = null;
  db = null;
}

export { app, auth, db, isFirebaseConfigured }; 