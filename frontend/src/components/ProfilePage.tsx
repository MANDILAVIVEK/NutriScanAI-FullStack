import ProfileSetup from "./ProfileSetup";
import { auth } from "../firebase/firebaseConfig";
import { logout } from "../firebase/auth";

function ProfilePage({
  openPage,
}: {
  openPage: (
    page: "barcode" | "ocr" | "profile" | "history" | "favorites"
  ) => void;
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
            <img
              src={user.photoURL || "/avatar.png"}
              alt="Profile"
              className="profile-img"
              onError={(e) => {
                e.currentTarget.src = "/avatar.png";
              }}
            />
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
            Login to access Profile, Scan History, Favorites and personalized
            recommendations.
          </p>

          <button onClick={() => window.location.reload()}>Login Now</button>
        </section>
      ) : (
        <>
          <section className="profile-actions">
            <button className="account-header-btn">👤 My Account</button>

            <button onClick={() => openPage("history")}>
              <span>📜 Scan History</span>
              <b>›</b>
            </button>

            <button onClick={() => openPage("favorites")}>
              <span>❤️ Favorites</span>
              <b>›</b>
            </button>

            <button className="danger-btn" onClick={handleLogout}>
              <span>🚪 Logout</span>
              <b>›</b>
            </button>
          </section>

          <ProfileSetup />
        </>
      )}
    </>
  );
}

export default ProfilePage;