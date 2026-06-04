import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function Dashboard({
  openPage,
}: {
  openPage: (page: "profile") => void;
}) {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(collection(db, "scan_history"));

      const userScans = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => item.userId === user.uid)
        .sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        );

      setScans(userScans);
      setLoading(false);
    };

    fetchScans();
  }, []);

  const total = scans.length;
  const healthy = scans.filter((s) =>
    JSON.stringify(s).toLowerCase().includes("green")
  ).length;
  const moderate = scans.filter((s) =>
    JSON.stringify(s).toLowerCase().includes("yellow")
  ).length;
  const unhealthy = scans.filter((s) =>
    JSON.stringify(s).toLowerCase().includes("red")
  ).length;

  const lastScan = scans[0];

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

    <h2>🏠 Dashboard</h2>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : !auth.currentUser ? (
        <p>Please login to view your dashboard.</p>
      ) : (
        <>
          <h3>👋 Welcome {auth.currentUser.displayName || "User"}</h3>

          <div className="future-grid">
            <div className="future-card">
              <h3>📊 Total Scans</h3>
              <p>{total}</p>
            </div>

            <div className="future-card">
              <h3>🟢 Healthy</h3>
              <p>{healthy}</p>
            </div>

            <div className="future-card">
              <h3>🟡 Moderate</h3>
              <p>{moderate}</p>
            </div>

            <div className="future-card">
              <h3>🔴 Unhealthy</h3>
              <p>{unhealthy}</p>
            </div>
          </div>

          {lastScan && (
            <div className="future-card" style={{ marginTop: "18px" }}>
              <h3>🕒 Last Scan</h3>
              <p>{lastScan.productName || "Unknown Product"}</p>
              <p>Barcode: {lastScan.barcode}</p>
              <p>
                Score:{" "}
                {lastScan.analysis?.analysis?.score ||
                  lastScan.analysis?.score ||
                  "N/A"}
              </p>
              <p>{new Date(lastScan.timestamp).toLocaleString()}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Dashboard;