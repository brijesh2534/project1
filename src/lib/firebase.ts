import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Changed from firestore
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // PASTE YOUR CONFIG KEYS HERE
  apiKey: "AIzaSyB3p4kmDP6ecynKJCVuPX0YX00KryzZWKE",
  authDomain: "brijesh-portfolio-39675.firebaseapp.com",
  databaseURL: "https://brijesh-portfolio-39675-default-rtdb.firebaseio.com", // Important for Realtime DB
  projectId: "brijesh-portfolio-39675",
  storageBucket: "brijesh-portfolio-39675.firebasestorage.app",
  messagingSenderId: "232367195672",
  appId: "1:232367195672:web:095cb7efbe585737aba56d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Exporting Realtime Database instance
export const storage = getStorage(app);
