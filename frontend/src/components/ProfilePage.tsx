import ProfileSetup from "./ProfileSetup";
import { auth } from "../firebase/firebaseConfig";
import { logout } from "../firebase/auth";

function ProfilePage({
  openPage,
  openSettings,
}: {
  openPage: (page: "dashboard" | "history") => void;
  openSettings: () => void;
}) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <>
      <section className="profile-card">
        <div className="profile-top">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="profile-img" />
          ) : (
            <div className="profile-avatar-large">👤</div>
          )}

          <div>
            <h2>{user?.displayName || "Guest User"}</h2>
            <p>{user?.email || "Guest Mode"}</p>
          </div>
        </div>
      </section>

      {!user ? (
        <section className="action-card">
          <h2>🔒 Login Required</h2>
          <p className="small-text">
            Login to access Dashboard, Scan History, Health Profile and
            personalized recommendations.
          </p>

          <button onClick={() => window.location.reload()}>
            Login Now
          </button>
        </section>
      ) : (
        <>
          <section className="profile-actions">
            <button onClick={() => openPage("dashboard")}>
              📊 Dashboard
            </button>

            <button onClick={() => openPage("history")}>
              📜 Scan History
            </button>

            <button onClick={openSettings}>
              ⚙️ Settings
            </button>

            <button className="danger-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </section>

          <ProfileSetup />
        </>
      )}
    </>
  );
}

export default ProfilePage;