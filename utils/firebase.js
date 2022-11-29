// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  query,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutWithFirebase,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWBwzdSUZlC0tA57fHgRvQAfVEmaKo77c",
  authDomain: "react-hi-music-16284.firebaseapp.com",
  projectId: "react-hi-music-16284",
  storageBucket: "react-hi-music-16284.appspot.com",
  messagingSenderId: "742008530642",
  appId: "1:742008530642:web:b8fbc8e6ef4f57a71cef0b",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export {
  db,
  firebaseApp,
  auth,
  doc,
  query,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOutWithFirebase,
  updateProfile,
  onAuthStateChanged,
  arrayUnion,
  arrayRemove,
};
