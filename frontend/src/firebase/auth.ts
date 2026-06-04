// src/firebase/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebaseConfig";
import { saveUserProfile } from "./firestore";

const provider = new GoogleAuthProvider();

export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, provider);

  await saveUserProfile(result.user);

  return result;
};

export const logout = () => signOut(auth);