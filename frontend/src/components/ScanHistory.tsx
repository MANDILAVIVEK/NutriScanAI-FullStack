import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
function ScanHistory({
  openPage,
}: {
  openPage: (page: "profile") => void;
}) {
{
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteHistoryItem = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this scan history?"
    );

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "scan_history", id));

    setHistory((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
        setHistory([]);
        setLoading(false);
        return;
        }
        const snapshot = await getDocs(collection(db, "scan_history"));

        const userHistory = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item: any) => item.userId === user.uid)
          .sort(
            (a: any, b: any) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          );

        setHistory(userHistory);
      } catch (error) {
        console.error("History fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
  <section className="action-card">

    <div className="back-row">
      <button
        className="back-btn"
        onClick={() => openPage("profile")}
      >
        ← Profile
      </button>
    </div>

    <h2>📊 Scan History</h2>

      {loading ? (
        <p>Loading history...</p>
      ) : !auth.currentUser ? (
  <div className="empty-card">
    <h3>🔒 Login Required</h3>
    <p>
      Please login with Google or Email to view your scan history.
    </p>
  </div>
) : history.length === 0 ? (
  <div className="empty-card">
    <h3>📊 No Scan History Yet</h3>
    <p>
      Scan your first food product to start building your history.
    </p>
  </div>
): (
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
                "Unknown Product"}
            </h3>

            <p>📦 <strong>Barcode:</strong> {item.barcode}</p>

            <p>
              🎯 <strong>Health Score:</strong>{" "}
              {item.analysis?.analysis?.score ||
                item.analysis?.score ||
                "N/A"}
            </p>

            <p>
              🚦 <strong>Status:</strong>{" "}
              {item.analysis?.analysis?.color ||
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
}
export default ScanHistory;