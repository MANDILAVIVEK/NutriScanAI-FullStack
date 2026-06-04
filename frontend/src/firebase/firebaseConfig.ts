// src/firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3RjEisiZ75kPFW5qt4eLfH7Qy44ZsXGk",
  authDomain: "nutriscan-ai-ad049.firebaseapp.com",
  projectId: "nutriscan-ai-ad049",
  storageBucket: "nutriscan-ai-ad049.firebasestorage.app",
  messagingSenderId: "631709296577",
  appId: "1:631709296577:web:e39fbfc4e53fb73780b140",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;