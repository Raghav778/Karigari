import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpW1zamt3P_7m1zXcdQqeIfiJcKRDXZvs",
  authDomain: "karigarh-948a7.firebaseapp.com",
  projectId: "karigarh-948a7",
  storageBucket: "karigarh-948a7.firebasestorage.app",
  messagingSenderId: "429573525438",
  appId: "1:429573525438:web:0aa031ff80dc1ab28733ef"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Project ID:", firebaseConfig.projectId);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

console.log("Connected to project:", firebaseConfig.projectId);