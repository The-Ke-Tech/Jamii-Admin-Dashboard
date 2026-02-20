// src/firebase/firebase.ts
// No changes needed; it's complete.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";    

const firebaseConfig = {
  apiKey: "AIzaSyB3KPcInb3CSv3_w9WhiT85Ebfi0OJG2L8",
  authDomain: "tujenge-jamii.firebaseapp.com",
  projectId: "tujenge-jamii",
  storageBucket: "tujenge-jamii.firebasestorage.app",
  messagingSenderId: "192234768453",
  appId: "1:192234768453:web:c86b395bd95b03ad607b2c",
  measurementId: "G-820F4YY589"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);          
export const db = getFirestore(app);       
export const storage = getStorage(app);    