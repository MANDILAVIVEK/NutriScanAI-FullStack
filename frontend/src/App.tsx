import { useEffect, useState } from "react";
import Scanner from "./components/scanner";
import Auth from "./components/Auth";
import { auth } from "./firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  if (user || guestMode) {
    return <Scanner />;
  }

  return <Auth onGuest={() => setGuestMode(true)} />;
}

export default App;