import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function ScanHistory({
  openPage,
}: {
  openPage: (page: "profile") => void;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, string>>({});

const loadFavorites = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  const favMap: Record<string, string> = {};

  snap.docs.forEach((docSnap) => {
    const data: any = docSnap.data();
    if (data.barcode) {
      favMap[data.barcode] = docSnap.id;
    }
  });

  setFavoriteIds(favMap);
};

const deleteHistoryItem = async (id: string) => {
  if (!window.confirm("Delete this scan history?")) return;

  await deleteDoc(doc(db, "scan_history", id));
  setHistory((prev) => prev.filter((item) => item.id !== id));
};
 const toggleFavorite = async (item: any) => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  const barcode = item.barcode || "N/A";

  if (favoriteIds[barcode]) {
    await deleteDoc(doc(db, "favorites", favoriteIds[barcode]));

    setFavoriteIds((prev) => {
      const updated = { ...prev };
      delete updated[barcode];
      return updated;
    });

    return;
  }

  const docRef = await addDoc(collection(db, "favorites"), {
    userId: user.uid,
    email: user.email,
    barcode,
    productName:
      item.productName ||
      item.analysis?.product_name ||
      item.analysis?.product?.product_name ||
      "Unknown Product",
    healthScore:
      item.analysis?.analysis?.score ||
      item.analysis?.score ||
      item.healthScore ||
      "N/A",
    analysis: item.analysis || item,
    timestamp: new Date().toISOString(),
  });

  setFavoriteIds((prev) => ({
    ...prev,
    [barcode]: docRef.id,
  }));
};
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 2. Filter by userId to protect user privacy
        const q = query(collection(db, "scan_history"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const allHistory = snapshot.docs.map((snap) => ({
          id: snap.id,
          ...snap.data(),
        }));

        allHistory.sort((a: any, b: any) =>
          new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
        );

        setHistory(allHistory);
      } catch (error) {
        console.error("History fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

fetchHistory();
loadFavorites();

  }, []);


  if (loading) return <section className="action-card"><p>Loading history...</p></section>;

  return (
    <section className="action-card">
      <div className="back-row">
        <button className="back-btn" onClick={() => openPage("profile")}>← Profile</button>
      </div>

      <h2>📜 Scan History</h2>

      {history.length === 0 ? (
        <div className="empty-card">
          <h3>📊 No Scan History Yet</h3>
        </div>
      ) : (
history.map((item) => (
  <div key={item.id} className="future-card history-card">

   <button
  className="favorite-history-btn"
  onClick={() => toggleFavorite(item)}
>
  {favoriteIds[item.barcode || "N/A"] ? "❤️" : "🤍"}
</button>

    <button
      className="delete-history-btn"
      onClick={() => deleteHistoryItem(item.id)}
    >
      ✕
    </button>

    <h3>
      {item.productName ||
        item.analysis?.product_name ||
        item.analysis?.product?.name ||
        item.analysis?.product?.product_name ||
        "Unknown Product"}
    </h3>
            <p>📦 <strong>Barcode:</strong> {item.barcode || "N/A"}</p>
            <p>🎯 <strong>Health Score:</strong> {item.analysis?.analysis?.score || "N/A"}</p>
            <p>🕒 {item.timestamp ? new Date(item.timestamp).toLocaleString() : "No date"}</p>
          </div>
        ))
      )}
    </section>
  );
}

export default ScanHistory;