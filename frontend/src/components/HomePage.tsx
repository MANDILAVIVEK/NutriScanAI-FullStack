function HomePage({
  openPage,
}: {
  openPage: (page: "barcode" | "ocr" | "profile") => void;
}) {
  return (
    <section className="home-page">
      <section className="home-hero-card">
        <div className="home-badge">🥗 AI Food Intelligence</div>

        <h1>NutriScanAI</h1>
        <h2>Scan Smarter. Eat Healthier.</h2>

        <p>
          Analyze food barcodes, nutrition labels, ingredients, allergens and
          health scores using AI-powered food intelligence.
        </p>

        <div className="home-actions">
          <button onClick={() => openPage("barcode")}>📦 Scan Barcode</button>
          <button onClick={() => openPage("ocr")}>🧠 OCR Nutrition</button>
        </div>
      </section>

      <section className="home-section">
        <h2>✨ Main Features</h2>

        <div className="home-grid">
          <div className="home-card">
            <span>📦</span>
            <h3>Barcode Scanner</h3>
            <p>Scan food product barcodes and fetch nutrition details.</p>
          </div>

          <div className="home-card">
            <span>🧠</span>
            <h3>OCR Nutrition Reader</h3>
            <p>Upload nutrition labels and extract food values using OCR.</p>
          </div>

          <div className="home-card">
            <span>📊</span>
            <h3>Health Score</h3>
            <p>Understand food quality with simple AI-based scoring.</p>
          </div>

          <div className="home-card">
            <span>⚠️</span>
            <h3>Allergen Detection</h3>
            <p>Identify possible allergens like soy, milk, nuts and gluten.</p>
          </div>

          <div className="home-card">
            <span>📜</span>
            <h3>Scan History</h3>
            <p>Save and view your previously scanned food products.</p>
          </div>

          <div className="home-card">
            <span>❤️</span>
            <h3>Favorites</h3>
            <p>Save products you want to check again later.</p>
          </div>
        </div>
      </section>

      <section className="home-preview">
        <div>
          <h2>📱 Smart Product Summary</h2>
          <p>
            Get a clean result with health score, nutrition warnings, ingredient
            insights and dietary suggestions.
          </p>
        </div>

        <div className="mock-phone">
          <div className="mock-header">NutriScanAI</div>
          <div className="mock-score">87/100</div>
          <p>✅ Low Sugar</p>
          <p>✅ Good Protein</p>
          <p>⚠️ Contains Soy</p>
          <button>View Analysis</button>
        </div>
      </section>

      <section className="home-section">
        <h2>⚙️ How It Works</h2>

        <div className="home-grid three">
          <div className="home-card">
            <span>📸</span>
            <h3>1. Scan</h3>
            <p>Scan barcode or upload a nutrition label image.</p>
          </div>

          <div className="home-card">
            <span>🧠</span>
            <h3>2. Analyze</h3>
            <p>AI checks nutrition, ingredients, allergens and health score.</p>
          </div>

          <div className="home-card">
            <span>✅</span>
            <h3>3. Decide</h3>
            <p>Use insights to make better food choices.</p>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div>
          <h3>AI</h3>
          <p>Powered</p>
        </div>
        <div>
          <h3>OCR</h3>
          <p>Label Reader</p>
        </div>
        <div>
          <h3>100%</h3>
          <p>Web Based</p>
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to analyze your food?</h2>
        <p>Start with barcode scanning or OCR nutrition label reading.</p>

        <div className="home-actions">
          <button onClick={() => openPage("barcode")}>📦 Start Scanning</button>
          <button onClick={() => openPage("profile")}>👤 View Profile</button>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 NutriScanAI</p>
        <p>Built by Mandila Vivek Reddy</p>
      </footer>
    </section>
  );
}

export default HomePage;