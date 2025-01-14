import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBAKrUFmzC0ALcO09_ieNYglbI-D9sUg2c",
  authDomain: "courses-c4841.firebaseapp.com",
  projectId: "courses-c4841",
  storageBucket: "courses-c4841.firebasestorage.app",
  messagingSenderId: "996397019168",
  appId: "1:996397019168:web:c74690bbe64bf276528c45",
  measurementId: "G-ZC4WFJPBXK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };