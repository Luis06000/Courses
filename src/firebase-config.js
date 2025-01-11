import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDspqkmmGAFx6PSQ9Ncfki2GuFVTr4FPY0",
  authDomain: "courses-8b8ae.firebaseapp.com",
  projectId: "courses-8b8ae",
  storageBucket: "courses-8b8ae.firebasestorage.app",
  messagingSenderId: "355474881588",
  appId: "1:355474881588:web:17f9079424c09a4bdb9e61",
  measurementId: "G-W1Z1379J6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 