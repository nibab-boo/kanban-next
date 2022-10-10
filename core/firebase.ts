// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, deleteApp, FirebaseOptions, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_P_ID + ".firebaseapp.com",
  projectId: "kanban-next",
  storageBucket: process.env.FIREBASE_P_ID + ".appspot.com",
  messagingSenderId: process.env.FIREBASE_MSG,
  appId: process.env.FIREBASE_APP_ID
};


const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db: any = getFirestore(app);

export { app, db, firebaseConfig }
