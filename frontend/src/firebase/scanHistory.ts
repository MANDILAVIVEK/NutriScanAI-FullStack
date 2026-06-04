import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveScanHistory = async (
  userId: string,
  barcode: string,
  productName: string,
  analysis: any
) => {
  await addDoc(collection(db, "scan_history"), {
    userId,
    barcode,
    productName,
    analysis,
    timestamp: new Date().toISOString(),
  });
};