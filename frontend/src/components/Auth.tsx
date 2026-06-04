import { useState } from "react";
import { login, signup, googleLogin } from "../firebase/auth";

function Auth({ onGuest }: { onGuest: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      await signup(email, password);
      alert("Account created successfully");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      await login(email, password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">🥗</div>
          <h1>NutriScan AI</h1>
          <p>Scan smarter. Eat healthier.</p>
        </div>

        <div className="auth-features">
          <span>📦 Barcode Scan</span>
          <span>🧠 OCR Nutrition</span>
          <span>⚠️ Allergy Check</span>
          <span>🤖 AI Health Score</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password min 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <button className="secondary auth-secondary" onClick={handleSignup}>
          Create Account
        </button>

        <button className="guest-btn" onClick={onGuest}>
          Continue as Guest
        </button>
      </div>
    </section>
  );
}

export default Auth;