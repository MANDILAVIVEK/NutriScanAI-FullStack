import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

export const addFavorite = async (
  userId: string,
  barcode: string,
  productName: string,
  healthScore: number
) => {
  await addDoc(collection(db, "favorites"), {
    userId,
    barcode,
    productName,
    healthScore,
    timestamp: new Date().toISOString(),
  });
};

export const getFavorites = async (userId: string) => {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const removeFavorite = async (id: string) => {
  await deleteDoc(doc(db, "favorites", id));
};