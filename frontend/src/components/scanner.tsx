import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  uploadImageForOCR,
  getProductByBarcode,
  scanBarcodeImage,
} from "../api/client";
import ResultView from "./resultview";

type PageType = "barcode" | "ocr";
type ThemeType = "light" | "dark" | "system";

function Scanner() {
  const [page, setPage] = useState<PageType>("barcode");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const [theme, setTheme] = useState<ThemeType>(
    (localStorage.getItem("theme") as ThemeType) || "system"
  );

  const [barcode, setBarcode] = useState("");
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<"barcode" | "ocr" | null>(null);

  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const stopCameraScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {}

    setCameraOn(false);
  };

  const openPage = async (nextPage: PageType) => {
    if (cameraOn) await stopCameraScanner();

    setPage(nextPage);
    setShowFeatures(false);
    setMenuOpen(false);
  };

  const analyzeBarcode = async (code?: string) => {
    const finalCode = code || barcode;

    if (!finalCode.trim()) {
      alert("Enter barcode");
      return;
    }

    try {
      setLoading(true);
      const result = await getProductByBarcode(finalCode.trim());

      setData(result);
      setType("barcode");
      setPage("barcode");
      setShowFeatures(false);
    } catch {
      alert("Product not found or backend failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadBarcodeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const scanResult = await scanBarcodeImage(file);

      if (scanResult.status === "success" && scanResult.barcode) {
        setBarcode(scanResult.barcode);
        await analyzeBarcode(scanResult.barcode);
      } else {
        alert("Barcode not detected");
      }
    } catch {
      alert("Barcode image scan failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const startCameraScanner = async () => {
    try {
      setCameraOn(true);

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 160 } },
        async (decodedText) => {
          setBarcode(decodedText);
          await stopCameraScanner();
          await analyzeBarcode(decodedText);
        },
        () => {}
      );
    } catch {
      alert("Camera scanner failed");
      setCameraOn(false);
    }
  };

  const uploadOCRImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadImageForOCR(file);

      setData(result);
      setType("ocr");
      setPage("ocr");
      setShowFeatures(false);
    } catch {
      alert("OCR failed. Check backend.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <main className="page">
      <section className="phone-shell">
        <header className="app-header">
          <div className="brand">
            <div className="logo">🥗</div>

            <div>
              <h2>NutriScanAI</h2>
              <p>Smart food intelligence</p>
            </div>
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        {menuOpen && (
          <div className="drawer-overlay" onClick={() => setMenuOpen(false)}>
            <aside className="drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-head">
                <h2>Menu</h2>
                <button onClick={() => setMenuOpen(false)}>✕</button>
              </div>

              <button onClick={() => openPage("barcode")}>📦 Barcode Scanner</button>
              <button onClick={() => openPage("ocr")}>🧠 OCR Scanner</button>

              <button
                onClick={() => {
                  setShowFeatures(true);
                  setMenuOpen(false);
                }}
              >
                🚀 Future Features
              </button>

              <div className="theme-section">
                <h3>🎨 Theme</h3>

                <button onClick={() => setTheme("light")}>☀️ Light</button>
                <button onClick={() => setTheme("dark")}>🌙 Dark</button>
                <button onClick={() => setTheme("system")}>💻 System</button>
              </div>
            </aside>
          </div>
        )}

        <section className="mini-hero">
          <h1>Scan Smarter. Eat Healthier.</h1>
          <p>Barcode scanning + OCR nutrition insights in one app.</p>
        </section>

        <div className="tabs">
          <button
            className={page === "barcode" ? "tab active" : "tab"}
            onClick={() => openPage("barcode")}
          >
            📦 Barcode
          </button>

          <button
            className={page === "ocr" ? "tab active" : "tab"}
            onClick={() => openPage("ocr")}
          >
            🧠 OCR
          </button>
        </div>

        {showFeatures && (
          <section className="future-features">
            <h2>🚀 Future Features</h2>

            <div className="future-grid">
              <Feature icon="⌚" title="Health App Sync" text="Samsung Health and Google Fit integration." />
              <Feature icon="📊" title="Scan History" text="Track previously scanned food products." />
              <Feature icon="🧠" title="AI Meal Advice" text="Personalized recommendations based on goals." />
              <Feature icon="🔔" title="Sugar Alerts" text="Warn users when products have high sugar." />
              <Feature icon="🥗" title="Diet Plans" text="Suggest diet-friendly alternatives." />
              <Feature icon="⚠️" title="Allergy Alerts" text="Detect allergens like soy, nuts, gluten, and dairy." />
              <Feature icon="📱" title="Mobile App" text="Android app version with instant food scanning." />
              <Feature icon="🛒" title="Smart Shopping" text="Compare products and pick healthier options." />
            </div>
          </section>
        )}

        {!showFeatures && page === "barcode" && (
          <section className="action-card">
            <h2>📦 Barcode Product Scanner</h2>

            <input
              type="text"
              placeholder="Enter barcode number"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />

            <button onClick={() => analyzeBarcode()}>
              {loading ? "Analyzing..." : "🔍 Analyze Product"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {!cameraOn ? (
              <button className="camera-btn" onClick={startCameraScanner}>
                📷 Start Camera Scanner
              </button>
            ) : (
              <button className="danger-btn" onClick={stopCameraScanner}>
                🛑 Stop Camera
              </button>
            )}

            <div id="reader"></div>

            <div className="divider">
              <span>OR</span>
            </div>

            <label className="upload-button secondary">
              🖼 Upload Barcode Image
              <input type="file" accept="image/*" onChange={uploadBarcodeImage} hidden />
            </label>
          </section>
        )}

        {!showFeatures && page === "ocr" && (
          <section className="action-card">
            <h2>🧠 OCR Nutrition Scanner</h2>

            <p className="small-text">
              Upload only the nutrition table for better accuracy.
            </p>

            <label className="upload-button">
              📸 {loading ? "Scanning..." : "Scan Nutrition Label"}
              <input type="file" accept="image/*" onChange={uploadOCRImage} hidden />
            </label>
          </section>
        )}

        {!showFeatures &&
          (data ? (
            <ResultView data={data} type={type} />
          ) : (
            <section className="empty-card">
              <div className="empty-icon">📦</div>
              <h2>Ready to scan</h2>
              <p>Use barcode or OCR scanner to analyze your food product.</p>
            </section>
          ))}
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: any) {
  return (
    <div className="future-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default Scanner;