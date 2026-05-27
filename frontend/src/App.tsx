import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

const API = "https://nutriscanai-fullstack.onrender.com";

function App() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [ocr, setOcr] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const analyzeProduct = async (code?: string) => {
    const finalCode = code || barcode;

    if (!finalCode) {
      alert("Enter barcode");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/product/${finalCode}`);
      const data = await res.json();
      setProduct(data);
    } catch {
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  const startCameraScanner = async () => {
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 180 } },
        async (decodedText) => {
          setBarcode(decodedText);

          await scanner.stop();
          await scanner.clear();

          analyzeProduct(decodedText);
        },
        () => {}
      );
    } catch {
      alert("Camera failed");
    }
  };

  const uploadBarcodeImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/scan-barcode-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setBarcode(data.barcode);
        analyzeProduct(data.barcode);
      } else {
        alert("Barcode not detected");
      }
    } catch {
      alert("Image upload failed");
    }
  };

  const uploadOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/ocr`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setOcr(data);
    } catch {
      alert("OCR upload failed");
    }
  };

  const n = product?.product?.nutriments || {};
  const analysis = product?.analysis;

  return (
    <div className="app">
      <nav className="navbar">
        <h1>🥗 NutriScanAI</h1>

        <div className="nav-links">
          <a href="#barcode">Barcode</a>
          <a href="#ocr">Nutrition OCR</a>
          <a href="#features">Features</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h2>AI Nutrition Intelligence Platform</h2>

          <p>
            Scan products, analyze ingredients, detect hidden sugars, and get
            AI-powered nutrition recommendations instantly.
          </p>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900"
            alt="Healthy Food"
          />
        </div>
      </section>

      <section id="barcode" className="scanner-card">
        <div className="scanner-left">
          <h2>📦 Barcode Product Scanner</h2>

          <input
            type="text"
            placeholder="Enter Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />

          <button onClick={() => analyzeProduct()}>
            {loading ? "Analyzing..." : "🔍 Analyze Product"}
          </button>

          <h3>📷 Live Camera Scanner</h3>

          <button className="blue" onClick={startCameraScanner}>
            Start Camera Scanner
          </button>

          <div id="reader"></div>

          <h3>🖼 Upload Barcode Image</h3>

          <input
            type="file"
            accept="image/*"
            onChange={uploadBarcodeImage}
          />
        </div>

        <div className="scanner-right">
          <h2>📋 Product Summary</h2>

          {!product && (
            <p>Enter or scan a barcode to view product details.</p>
          )}

          {product && (
            <>
              <img
                className="summary-img"
                src={
                  product?.product?.image_url ||
                  "https://via.placeholder.com/250x250?text=No+Image"
                }
                alt="Product"
              />

              <div className="summary-info">
                <p>
                  <b>Product:</b> {product?.product?.name || "N/A"}
                </p>

                <p>
                  <b>Brand:</b> {product?.product?.brand || "N/A"}
                </p>

                <p>
                  <b>Status:</b> {product?.status}
                </p>
              </div>
            </>
          )}
        </div>

        {product && (
          <div className="details-below-upload">
            {analysis && (
              <>
                <h3>🚦 Health Score</h3>

                <div className="health-score">
                  <h1>{analysis.score}/100</h1>
                  <p>{analysis.status}</p>
                </div>
              </>
            )}

            <h3>🥗 Nutrition Data</h3>

            <div className="nutrition-grid">
              <Box title="Sugar" value={n.sugars_100g} unit="g" />
              <Box title="Protein" value={n.proteins_100g} unit="g" />
              <Box title="Carbs" value={n.carbohydrates_100g} unit="g" />
              <Box title="Fat" value={n.fat_100g} unit="g" />
              <Box title="Salt" value={n.salt_100g} unit="g" />
            </div>

            <h3>🏷 Product Category</h3>

            {product?.product_category?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}

            <h3>🥗 Diet Suitability</h3>

            {product?.diet_suitability?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}

            <h3>⚠ Allergy Detection</h3>

            {product?.allergy_detection?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}

            <h3>🧾 Ingredients</h3>

            <p>
              {product?.product?.ingredients ||
                "Ingredients not available"}
            </p>

            <h3>🔍 Ingredient Intelligence</h3>

            {product?.ingredient_analysis?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}

            <h3>🤖 AI Recommendations</h3>

            {analysis?.advice?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}
          </div>
        )}
      </section>

      <section id="ocr" className="card">
        <h2>🧠 OCR Nutrition Extraction</h2>

        <input type="file" accept="image/*" onChange={uploadOCR} />

        <p>Upload only the nutrition table for better OCR accuracy.</p>

        {ocr && (
          <div className="result">
            <h3>🧪 Extracted Nutrition Values</h3>

            <div className="nutrition-grid">
              <Box title="Protein" value={ocr.nutrition?.protein} unit="g" />

              <Box title="Carbs" value={ocr.nutrition?.carbs} unit="g" />

              <Box title="Sugar" value={ocr.nutrition?.sugar} unit="g" />

              <Box title="Fat" value={ocr.nutrition?.fat} unit="g" />

              <Box
                title="Saturated Fat"
                value={ocr.nutrition?.saturated_fat}
                unit="g"
              />

              <Box title="Sodium" value={ocr.nutrition?.sodium} unit="mg" />
            </div>

            <div className="analysis-box">
              <h3>🧠 Nutrition Analyzer</h3>

              {Number(ocr.nutrition?.sugar) > 20 && (
                <p>⚠ High sugar detected</p>
              )}

              {Number(ocr.nutrition?.fat) > 10 && (
                <p>⚠ High fat content</p>
              )}

              {Number(ocr.nutrition?.carbs) > 60 && (
                <p>⚠ High carbohydrate product</p>
              )}

              {Number(ocr.nutrition?.protein) >= 5 ? (
                <p>✅ Moderate protein content</p>
              ) : (
                <p>⚠ Low protein content</p>
              )}
            </div>
          </div>
        )}
      </section>

      <section id="features" className="features">
        <h2>🚀 Upcoming Features</h2>

        <div className="grid">
          <Box title="⌚ Health App Sync" value="Samsung Health integration" />

          <Box title="🧠 AI Personalization" value="Personalized insights" />

          <Box title="📊 Scan History" value="Track scanned products" />

          <Box title="💬 Feedback System" value="Improve recommendations" />
        </div>
      </section>

      <footer>🥗 NutriScanAI | React + TypeScript + FastAPI</footer>
    </div>
  );
}

function Box({ title, value, unit = "" }: any) {
  return (
    <div className="box">
      <h4>{title}</h4>

      <p>
        {value || "N/A"}
        {value ? unit : ""}
      </p>
    </div>
  );
}

export default App;