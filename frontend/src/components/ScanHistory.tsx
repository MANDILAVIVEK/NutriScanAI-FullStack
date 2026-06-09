import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function ScanHistory({
  openPage,
}: {
  openPage: (page: "profile") => void;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteHistoryItem = async (id: string) => {
    const confirmDelete = window.confirm("Delete this scan history?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "scan_history", id));
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snapshot = await getDocs(collection(db, "scan_history"));

        const allHistory = snapshot.docs.map((snap) => ({
          id: snap.id,
          ...snap.data(),
        }));

        const sortedHistory = allHistory.sort(
          (a: any, b: any) =>
            new Date(b.timestamp || 0).getTime() -
            new Date(a.timestamp || 0).getTime()
        );

        setHistory(sortedHistory);
      } catch (error: any) {
        console.error("History fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <section className="action-card">
        <p>Loading history...</p>
      </section>
    );
  }

  return (
    <section className="action-card">
      <div className="back-row">
        <button className="back-btn" onClick={() => openPage("profile")}>
          ← Profile
        </button>
      </div>

      <h2>📜 Scan History</h2>

      {history.length === 0 ? (
        <div className="empty-card">
          <h3>📊 No Scan History Yet</h3>
          <p>No documents fetched from Firestore.</p>
        </div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="future-card history-card">
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

            <p>
              📦 <strong>Barcode:</strong> {item.barcode || "N/A"}
            </p>

            <p>
              🎯 <strong>Health Score:</strong>{" "}
              {item.analysis?.analysis?.score ||
                item.analysis?.score ||
                item.healthScore ||
                "N/A"}
            </p>

            <p>
              🚦 <strong>Status:</strong>{" "}
              {item.analysis?.analysis?.status ||
                item.analysis?.status ||
                item.analysis?.analysis?.color ||
                item.analysis?.color ||
                "Unknown"}
            </p>

            <p>
              🕒{" "}
              {item.timestamp
                ? new Date(item.timestamp).toLocaleString()
                : "No date"}
            </p>
          </div>
        ))
      )}
    </section>
  );
}

export default ScanHistory;