import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const API = "http://127.0.0.1:8000";

function App() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [ocr, setOcr] = useState<any>(null);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeProduct = async () => {
    if (!barcode) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/product/${barcode}`
      );

      const data = await res.json();

      setProduct(data);

    } catch {
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode(
        "reader"
      );

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 150,
          },
        },
        async (decodedText) => {
          setBarcode(decodedText);

          await scanner.stop();

          const res = await fetch(
            `${API}/product/${decodedText}`
          );

          const data = await res.json();

          setProduct(data);
        },
        () => {}
      );

    } catch {
      alert("Camera failed");
    }
  };

  const uploadBarcodeImage = async (
    e: any
  ) => {
    const file = e.target.files[0];

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const res = await fetch(
      `${API}/scan-barcode-image`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await res.json();

    if (
      data.status ===
      "success"
    ) {
      setBarcode(
        data.barcode
      );

      const p = await fetch(
        `${API}/product/${data.barcode}`
      );

      setProduct(
        await p.json()
      );
    }
  };

  const uploadOCR = async (
    e: any
  ) => {
    const file = e.target.files[0];

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const res = await fetch(
      `${API}/ocr`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await res.json();

    setOcr(data);
  };

  const explainIngredients =
    async () => {
      if (
        !product?.product
          ?.ingredients
      )
        return;

      const res =
        await fetch(
          `${API}/explain-ingredients`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                ingredients:
                  product
                    .product
                    .ingredients,
              }
            ),
          }
        );

      const data =
        await res.json();

      setAiResult(
        data.result
      );
    };

  return (
    <div className="min-h-screen p-10 bg-gray-100">

      <h1 className="text-5xl font-bold text-green-700 mb-8">
        🥗 NutriScanAI
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-bold text-2xl mb-4">
          📦 Barcode Product Scanner
        </h2>

        <input
          value={barcode}
          onChange={(e) =>
            setBarcode(
              e.target.value
            )
          }
          placeholder="Enter barcode"
          className="border p-3 rounded w-full"
        />

        <button
          onClick={
            analyzeProduct
          }
          className="bg-green-600 text-white p-3 rounded mt-4"
        >
          {loading
            ? "Loading..."
            : "Analyze"}
        </button>

        <button
          onClick={
            startScanner
          }
          className="bg-blue-600 text-white p-3 rounded mt-4 ml-3"
        >
          📷 Camera Scan
        </button>

        <div
          id="reader"
          className="mt-5"
        ></div>

        <div className="mt-5">

          <h3>
            Upload barcode image
          </h3>

          <input
            type="file"
            accept="image/*"
            onChange={
              uploadBarcodeImage
            }
          />

        </div>

      </div>

      {product && (

      <div className="bg-white p-6 rounded-xl shadow mt-6">

        <h2 className="font-bold text-2xl">
          Product Summary
        </h2>

        <p>
          Product:
          {
            product
            ?.product
            ?.name
          }
        </p>

        <p>
          Brand:
          {
            product
            ?.product
            ?.brand
          }
        </p>

        <h3 className="font-bold mt-4">
          Ingredients
        </h3>

        <p>
          {
            product
            ?.product
            ?.ingredients
          }
        </p>

        <button
          onClick={
            explainIngredients
          }
          className="bg-purple-600 text-white p-3 rounded mt-5"
        >
          🤖 Explain Ingredients with AI
        </button>

        {aiResult && (

          <div className="bg-purple-50 p-5 rounded mt-4">

            <pre>
              {aiResult}
            </pre>

          </div>

        )}

      </div>

      )}

      <div className="bg-white p-6 rounded-xl shadow mt-6">

        <h2 className="font-bold text-2xl">
          🧠 OCR Nutrition Extraction
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={
            uploadOCR
          }
        />

      </div>

      {ocr && (

      <div className="bg-white p-6 rounded-xl shadow mt-6">

        <h2 className="font-bold">
          OCR Results
        </h2>

        <pre>
          {JSON.stringify(
            ocr.nutrition,
            null,
            2
          )}
        </pre>

      </div>

      )}

    </div>
  );
}

export default App;