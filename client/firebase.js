import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDBRGMce36b39aJhOPQcZKd1qc85crPhkY",
  authDomain: "finalproject-fdf98.firebaseapp.com",
  projectId: "finalproject-fdf98",
  storageBucket: "finalproject-fdf98.firebasestorage.app",
  messagingSenderId: "211641199237",
  appId: "1:211641199237:web:47ddcc5e557058fcfb57ec"
};

// Initialize Firebase app
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} 
catch (error) {
  // If Firebase Auth is already initialized, use getAuth instead
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(firebaseApp);
  } 
  else {
    throw error;
  }
}

export { auth };
