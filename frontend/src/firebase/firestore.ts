import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveUserProfile = async (user: any) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastLogin: new Date().toISOString(),
    },
    { merge: true }
  );
};