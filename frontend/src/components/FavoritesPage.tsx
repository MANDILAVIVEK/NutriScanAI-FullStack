import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function FavoritesPage({
  openPage,
}: {
  openPage: (page: "profile" | "barcode") => void;
}) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setFavorites([]);
        return;
      }

      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setFavorites(data);
    } catch (error) {
      console.error("Favorites fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    const confirmDelete = window.confirm("Remove this favorite?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "favorites", id));
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <section className="action-card">
        <p>Loading favorites...</p>
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

      <h2>❤️ Favorite Products</h2>

      {favorites.length === 0 ? (
        <div className="empty-card">
          <h3>❤️ No Favorites Yet</h3>
          <p>Scan products and save them here for quick access.</p>

          <button onClick={() => openPage("barcode")}>
            📦 Start Scanning
          </button>
        </div>
      ) : (
        favorites.map((item) => (
          <div key={item.id} className="future-card history-card">
            <button
              className="delete-history-btn"
              onClick={() => removeFavorite(item.id)}
            >
              ✕
            </button>

            <h3>{item.productName || "Unknown Product"}</h3>

            <p>
              📦 <strong>Barcode:</strong> {item.barcode || "N/A"}
            </p>

            <p>
              🎯 <strong>Health Score:</strong>{" "}
              {item.healthScore || item.analysis?.analysis?.score || "N/A"}
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

export default FavoritesPage;