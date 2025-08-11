// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "apexcalc-6gzzy",
  "appId": "1:694489422990:web:70ca3924cf811efbc57ddf",
  "storageBucket": "apexcalc-6gzzy.firebasestorage.app",
  "apiKey": "AIzaSyBT2gk26ZwIFgbEBMq7IjXqg6fPdsS3zjs",
  "authDomain": "apexcalc-6gzzy.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "694489422990"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
