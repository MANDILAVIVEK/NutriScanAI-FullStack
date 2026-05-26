# 🥗 NutriScanAI FullStack

NutriScanAI is an AI-powered nutrition intelligence platform that analyzes packaged food products using barcode scanning, OCR nutrition label extraction, ingredient intelligence, and health scoring.

## 🚀 Features

- 📦 Barcode product lookup
- 📷 Live camera barcode scanner
- 🖼 Barcode image upload
- 🧠 OCR nutrition label extraction
- ✍️ Manual nutrition correction
- 📊 Nutrition chart visualization
- 🚦 Health score calculation
- 🤖 AI nutrition recommendations
- 🧾 Ingredient analysis
- ⚠ Allergy detection
- 🏷 Product category detection
- 🥗 Diet suitability analysis
- 🤖 Gemini AI ingredient explanation

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- html5-qrcode

### Backend
- FastAPI
- Python
- OpenCV
- Tesseract OCR
- Pyzbar
- Open Food Facts API
- Gemini AI API

## 📁 Project Structure

```text
NutriScanAI-FullStack/
│
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── product_api.py
│   ├── ocr_reader.py
│   ├── ocr_parser.py
│   ├── barcode_image_scanner.py
│   ├── ingredient_analyzer.py
│   ├── ai_ingredient_explainer.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
