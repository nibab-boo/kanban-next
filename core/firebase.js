// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_P_ID + ".firebaseapp.com",
  projectId: process.env.FIREBASE_P_ID,
  storageBucket: process.env.FIREBASE_P_ID + ".appspot.com",
  messagingSenderId: process.env.FIREBASE_MSG,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
// check if app is already initialized
const app = !getApps().length ?initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export { app, db }