// firebase_auth.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCddRimod_MQNv9XBWc_X_-giO7CW-Ax14",
  authDomain: "it314-blogme.firebaseapp.com",
  databaseURL: "https://it314-blogme-default-rtdb.firebaseio.com",
  projectId: "it314-blogme",
  storageBucket: "it314-blogme.appspot.com",
  messagingSenderId: "321257975238",
  appId: "1:321257975238:web:cef191d335b06a4cc6d6c7",
  measurementId: "G-KCBNHRHELC"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth, googleProvider };
