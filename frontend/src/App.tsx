import { useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function App() {
  const [barcode, setBarcode] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [cameraRunning, setCameraRunning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [ocrResult, setOcrResult] = useState<any>(null)
  const [ocrLoading, setOcrLoading] = useState(false)

  const [manualProtein, setManualProtein] = useState("")
  const [manualCarbs, setManualCarbs] = useState("")
  const [manualSugar, setManualSugar] = useState("")
  const [manualFat, setManualFat] = useState("")
  const [manualSodium, setManualSodium] = useState("")
  const [correctedAnalysis, setCorrectedAnalysis] = useState<any>(null)

  const analyzeProduct = async (code?: string) => {
    const finalBarcode = code || barcode

    if (!finalBarcode) {
      alert("Please enter or scan a barcode")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/product/${finalBarcode}`
      )

      const data = await response.json()
      setResult(data)
    } catch {
      alert("Backend connection failed")
    }

    setLoading(false)
  }

  const startCameraScanner = async () => {
    try {
      if (cameraRunning) return

      const scanner = new Html5Qrcode("barcode-reader")
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 280,
            height: 140,
          },
        },
        async (decodedText) => {
          setBarcode(decodedText)
          await analyzeProduct(decodedText)

          await scanner.stop()
          await scanner.clear()

          scannerRef.current = null
          setCameraRunning(false)
        },
        () => {}
      )

      setCameraRunning(true)
    } catch {
      alert("Camera failed. Allow camera permission and use localhost/HTTPS.")
    }
  }

  const stopCameraScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
        scannerRef.current = null
      }

      setCameraRunning(false)
    } catch {
      setCameraRunning(false)
    }
  }

  const scanBarcodeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/scan-barcode-image",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      if (data.status === "success") {
        setBarcode(data.barcode)
        await analyzeProduct(data.barcode)
      } else {
        alert("Barcode not detected. Try a clearer image.")
      }
    } catch {
      alert("Barcode upload failed")
    }
  }

  const uploadNutritionImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setOcrLoading(true)
    setOcrResult(null)
    setCorrectedAnalysis(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/ocr", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setOcrResult(data)

      const n = data.nutrition || {}

      setManualProtein(n.protein !== "Not Found" ? n.protein || "" : "")
      setManualCarbs(n.carbs !== "Not Found" ? n.carbs || "" : "")
      setManualSugar(n.sugar !== "Not Found" ? n.sugar || "" : "")
      setManualFat(n.fat !== "Not Found" ? n.fat || "" : "")
      setManualSodium(n.sodium !== "Not Found" ? n.sodium || "" : "")
    } catch {
      alert("OCR upload failed")
    }

    setOcrLoading(false)
  }

  const analyzeCorrectedValues = async () => {
    const sugar = Number(manualSugar)
    const protein = Number(manualProtein)
    const carbs = Number(manualCarbs)
    const fat = Number(manualFat)
    const sodium = Number(manualSodium)

    if (
      isNaN(sugar) ||
      isNaN(protein) ||
      isNaN(carbs) ||
      isNaN(fat) ||
      isNaN(sodium)
    ) {
      alert("Please enter valid numeric values")
      return
    }

    const salt = sodium / 1000

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-corrected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sugar,
          protein,
          carbs,
          salt,
          fat,
        }),
      })

      const data = await response.json()
      setCorrectedAnalysis(data.analysis)
    } catch {
      alert("Corrected analysis failed")
    }
  }

  const product = result?.product
  const analysis = result?.analysis
  const ingredientAnalysis = result?.ingredient_analysis
  const productCategory = result?.product_category
  const dietSuitability = result?.diet_suitability
  const allergyDetection = result?.allergy_detection

  const missingOcrValues =
    ocrResult?.nutrition &&
    Object.values(ocrResult.nutrition).some((value) => value === "Not Found")

  const ocrChartData = [
    {
      nutrient: "Protein",
      value: Number(manualProtein),
    },
    {
      nutrient: "Carbs",
      value: Number(manualCarbs),
    },
    {
      nutrient: "Sugar",
      value: Number(manualSugar),
    },
    {
      nutrient: "Fat",
      value: Number(manualFat),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white text-gray-800">
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-green-700">🥗 NutriScanAI</h1>

        <div className="hidden md:flex gap-6 font-medium">
          <a href="#barcode">Barcode</a>
          <a href="#ocr">Nutrition OCR</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="px-8 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            AI Nutrition Intelligence Platform
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Scan barcodes, analyze ingredients, detect hidden sugars, and get
            AI-powered health recommendations instantly.
          </p>

          <div className="flex gap-4">
            <a
              href="#barcode"
              className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-green-700"
            >
              📦 Analyze Product
            </a>

            <a
              href="#ocr"
              className="border border-green-600 text-green-700 px-6 py-3 rounded-2xl hover:bg-green-50"
            >
              🧠 Nutrition OCR
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
            alt="Healthy food"
            className="rounded-2xl h-[350px] w-full object-cover"
          />
        </div>
      </section>

      <section id="barcode" className="px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 border">
          <h2 className="text-3xl font-bold mb-6">
            📦 Barcode Product Scanner
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="font-semibold block mb-2">Enter Barcode</label>

              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Example: 8901719131219"
                className="w-full p-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={() => analyzeProduct()}
                className="mt-4 bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700 w-full font-semibold"
              >
                {loading ? "Analyzing..." : "🔍 Analyze Product"}
              </button>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">
                  📷 Live Camera Scanner
                </h3>

                {!cameraRunning ? (
                  <button
                    onClick={startCameraScanner}
                    className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 w-full"
                  >
                    Start Camera Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopCameraScanner}
                    className="bg-red-600 text-white px-5 py-3 rounded-2xl hover:bg-red-700 w-full"
                  >
                    Stop Camera Scanner
                  </button>
                )}

                <div
                  id="barcode-reader"
                  className="mt-4 rounded-2xl overflow-hidden border"
                ></div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">
                  🖼 Upload Barcode Image
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  onChange={scanBarcodeImage}
                  className="w-full border p-3 rounded-xl"
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-700">
                Product Summary
              </h3>

              {!result && (
                <p className="text-gray-500">
                  Enter, scan, or upload a barcode to view product details.
                </p>
              )}

              {result?.status === "error" && (
                <p className="text-red-600 font-semibold">
                  ❌ Product not found
                </p>
              )}

              {product && (
                <div className="space-y-3 text-sm">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt="Product"
                      className="w-40 rounded-xl mb-4"
                    />
                  )}

                  <p>
                    <strong>Product:</strong> {product.name}
                  </p>

                  <p>
                    <strong>Brand:</strong> {product.brand}
                  </p>

                  <p>
                    <strong>Status:</strong> {result.status}
                  </p>

                  {analysis && (
                    <>
                      <p>
                        <strong>Health Score:</strong> {analysis.score}/100
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-500 h-4 rounded-full"
                          style={{ width: `${analysis.score}%` }}
                        ></div>
                      </div>
                    </>
                  )}

                  {result?.message && (
                    <p className="text-yellow-700 font-medium">
                      ⚠ {result.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {product && (
        <section className="px-8 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold mb-6">🥗 Nutrition Data</h2>

            <div className="grid md:grid-cols-5 gap-4">
              <InfoCard
                title="Sugar"
                value={product.nutriments?.sugars_100g ?? "N/A"}
                unit="g"
              />
              <InfoCard
                title="Protein"
                value={product.nutriments?.proteins_100g ?? "N/A"}
                unit="g"
              />
              <InfoCard
                title="Carbs"
                value={product.nutriments?.carbohydrates_100g ?? "N/A"}
                unit="g"
              />
              <InfoCard
                title="Fat"
                value={product.nutriments?.fat_100g ?? "N/A"}
                unit="g"
              />
              <InfoCard
                title="Salt"
                value={product.nutriments?.salt_100g ?? "N/A"}
                unit="g"
              />
            </div>
          </div>
        </section>
      )}

      {productCategory && (
        <DisplaySection title="🏷 Product Category" items={productCategory} color="blue" />
      )}

      {dietSuitability && (
        <DisplaySection title="🥗 Diet Suitability" items={dietSuitability} color="green" />
      )}

      {allergyDetection && (
        <DisplaySection title="⚠ Allergy Detection" items={allergyDetection} color="red" />
      )}

      {product && (
        <section className="px-8 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold mb-4">🧾 Ingredients</h2>

            <p className="text-gray-700 mb-6">{product.ingredients}</p>

            <h3 className="text-2xl font-bold mb-4">
              🔍 Ingredient Intelligence
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {ingredientAnalysis?.map((item: string, index: number) => (
                <div
                  key={index}
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {analysis && (
        <section className="px-8 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold mb-6">🤖 AI Recommendations</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {analysis.advice?.map((tip: string, index: number) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-2xl p-4"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="ocr" className="px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 border">
          <h2 className="text-3xl font-bold mb-6">
            🧠 OCR Nutrition Extraction
          </h2>

          <div className="border-2 border-dashed border-green-300 rounded-3xl p-10 text-center bg-green-50">
            <p className="text-lg font-semibold mb-4">
              Upload Nutrition Label Image
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={uploadNutritionImage}
              className="border p-3 rounded-xl bg-white"
            />

            <p className="text-sm text-gray-500 mt-3">
              Upload only the nutrition table for better OCR accuracy.
            </p>

            {ocrLoading && (
              <div className="mt-8">
                <div className="w-16 h-16 border-4 border-green-300 border-t-green-700 rounded-full animate-spin mx-auto"></div>

                <p className="mt-4 text-green-700 font-bold text-lg">
                  Analyzing Nutrition Label...
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Extracting nutrition values using OCR
                </p>
              </div>
            )}
          </div>

          {ocrResult && !ocrLoading && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-5">
                🧪 Extracted Nutrition Values
              </h3>

              <div className="grid md:grid-cols-3 gap-5">
                <OcrCard title="Protein" value={ocrResult.nutrition?.protein} unit="g" color="green" />
                <OcrCard title="Carbs" value={ocrResult.nutrition?.carbs} unit="g" color="blue" />
                <OcrCard title="Sugar" value={ocrResult.nutrition?.sugar} unit="g" color="yellow" />
                <OcrCard title="Fat" value={ocrResult.nutrition?.fat} unit="g" color="red" />
                <OcrCard title="Saturated Fat" value={ocrResult.nutrition?.saturated_fat} unit="g" color="purple" />
                <OcrCard title="Sodium" value={ocrResult.nutrition?.sodium} unit="mg" color="orange" />
              </div>

              {missingOcrValues && (
                <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-2xl p-5">
                  <p className="font-bold text-yellow-800">
                    ⚠ OCR could not read some nutrition values clearly.
                  </p>
                  <p className="text-yellow-700 mt-2">
                    Please correct or fill the missing values below.
                  </p>
                </div>
              )}

              <div className="mt-8 bg-white rounded-3xl border p-6">
                <h3 className="text-2xl font-bold mb-5">
                  ✍️ Correct / Fill Nutrition Values
                </h3>

                <div className="grid md:grid-cols-5 gap-4">
                  <ManualInput label="Protein (g)" value={manualProtein} setValue={setManualProtein} placeholder="10.77" />
                  <ManualInput label="Carbs (g)" value={manualCarbs} setValue={setManualCarbs} placeholder="44.51" />
                  <ManualInput label="Sugar (g)" value={manualSugar} setValue={setManualSugar} placeholder="2.79" />
                  <ManualInput label="Fat (g)" value={manualFat} setValue={setManualFat} placeholder="39.94" />
                  <ManualInput label="Sodium (mg)" value={manualSodium} setValue={setManualSodium} placeholder="324.5" />
                </div>

                <button
                  onClick={analyzeCorrectedValues}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 font-semibold"
                >
                  ✅ Analyze Corrected Values
                </button>
              </div>

              {correctedAnalysis && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-3xl p-6">
                  <h3 className="text-2xl font-bold mb-4">
                    🚦 Corrected Health Score
                  </h3>

                  <p className="text-4xl font-extrabold text-green-700">
                    {correctedAnalysis.score}/100
                  </p>

                  <p className="mt-2 font-bold">
                    {correctedAnalysis.status}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${correctedAnalysis.score}%` }}
                    ></div>
                  </div>

                  <div className="mt-8 bg-white rounded-3xl border p-6">
                    <h3 className="text-2xl font-bold mb-5">
                      📊 OCR Nutrition Chart
                    </h3>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ocrChartData}>
                          <XAxis dataKey="nutrient" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#16a34a"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-6 mb-4">
                    🤖 AI Recommendations
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {correctedAnalysis.advice?.map((tip: string, index: number) => (
                      <div
                        key={index}
                        className="bg-white border border-green-200 rounded-2xl p-4"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4">
                  📄 OCR Extracted Text
                </h3>

                <div className="bg-gray-100 rounded-2xl p-5 max-h-[400px] overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {ocrResult.ocr_text}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="px-8 py-12">
        <h2 className="text-4xl font-bold text-center mb-12">
          🚀 Upcoming Features
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <Feature icon="⌚" title="Health App Sync" text="Samsung Health and fitness integration" />
          <Feature icon="🧠" title="AI Personalization" text="Personalized nutrition insights" />
          <Feature icon="📊" title="Scan History" text="Track all scanned products" />
          <Feature icon="💬" title="Feedback System" text="Improve recommendations using feedback" />
        </div>
      </section>

      <footer id="contact" className="bg-green-700 text-white px-8 py-10 mt-10">
        <h3 className="text-2xl font-bold mb-2">🥗 NutriScanAI</h3>

        <p className="text-green-100">
          Built with React + TypeScript + FastAPI + Python AI
        </p>
      </footer>
    </div>
  )
}

function InfoCard({ title, value, unit }: any) {
  return (
    <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-3xl font-extrabold text-green-700">
        {value}
        {value !== "N/A" ? unit : ""}
      </p>
    </div>
  )
}

function OcrCard({ title, value, unit, color }: any) {
  const cardClass =
    color === "blue"
      ? "bg-blue-50 border-blue-200 text-blue-700"
      : color === "yellow"
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : color === "red"
      ? "bg-red-50 border-red-200 text-red-700"
      : color === "purple"
      ? "bg-purple-50 border-purple-200 text-purple-700"
      : color === "orange"
      ? "bg-orange-50 border-orange-200 text-orange-700"
      : "bg-green-50 border-green-200 text-green-700"

  const displayValue =
    !value || value === "Not Found" ? "N/A" : `${value}${unit}`

  return (
    <div className={`${cardClass} border rounded-2xl p-5`}>
      <h4 className="font-bold text-lg text-gray-800">{title}</h4>
      <p className="text-3xl font-extrabold">{displayValue}</p>
    </div>
  )
}

function ManualInput({ label, value, setValue, placeholder }: any) {
  return (
    <div>
      <label className="font-semibold block mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border p-3 rounded-xl"
      />
    </div>
  )
}

function DisplaySection({ title, items, color }: any) {
  const colorClass =
    color === "red"
      ? "bg-red-50 border-red-200"
      : color === "blue"
      ? "bg-blue-50 border-blue-200"
      : "bg-green-50 border-green-200"

  return (
    <section className="px-8 py-8">
      <div className="bg-white rounded-3xl shadow-lg p-8 border">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item: string, index: number) => (
            <div
              key={index}
              className={`${colorClass} border rounded-2xl p-4`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, text }: any) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 text-center border">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  )
}

export default App