# 🥗 NutriScanAI

AI-powered Nutrition Intelligence Platform that helps users analyze packaged food products using Barcode Scanning, OCR Nutrition Extraction, and AI-driven Health Insights.

---

## 🚀 Features

### 📦 Barcode Product Scanner
- Manual barcode entry
- Live camera barcode scanning
- Upload barcode image
- Fetch product information from global databases

### 📸 OCR Nutrition Extraction
- Upload nutrition label images
- Extract:
  - Protein
  - Carbohydrates
  - Sugar
  - Fat
  - Saturated Fat
  - Sodium

### 🧠 AI Nutrition Analysis
- Health Score Generation
- Product Categorization
- Diet Suitability Analysis
- Ingredient Intelligence
- Allergy Detection
- Smart Recommendations

### 🎯 Upcoming Features
- Samsung Health Integration
- Personalized AI Insights
- Scan History
- Feedback System

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS3

### Backend
- FastAPI
- Python

### APIs
- OpenFoodFacts API
- OCR.Space OCR API

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure

```bash
NutriScanAI/
│
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── barcode_image_scanner.py
│   ├── ingredient_analyzer.py
│   ├── ocr_parser.py
│   ├── ocr_reader.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   │
│   │   ├── components/
│   │   │   ├── scanner.tsx
│   │   │   ├── resultview.tsx
│   │   │   └── nutritioncard.tsx
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   └── public/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/MANDILAVIVEK/NutriScanAI-FullStack.git
cd NutriScanAI-FullStack
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

## 🌐 Environment Variables

Create:

```bash
backend/.env
```

Example:

```env
OCR_API_KEY=YOUR_OCR_SPACE_KEY
```

---

## 📡 API Endpoints

### OCR Nutrition Extraction

```http
POST /ocr
```

Example Response:

```json
{
  "status": "success",
  "nutrition": {
    "protein": "6.9",
    "carbs": "77.3",
    "sugar": "25.5",
    "fat": "13",
    "saturated_fat": "3.4",
    "sodium": "296"
  }
}
```

---

### Barcode Product Lookup

```http
GET /product/{barcode}
```

Example Response:

```json
{
  "product_name": "Ginger Crystallized In Dark Chocolate",
  "brand": "Chocolove"
}
```

---

## 🎨 UI Highlights

- Premium Mobile-First Design
- Responsive Layout
- Barcode Scanner
- OCR Nutrition Reader
- Health Score Dashboard
- Nutrition Cards
- AI-Based Recommendations
- Ingredient Intelligence
- Diet Suitability Analysis

---

## 📈 Future Roadmap

- AI Meal Recommendations
- Personalized Nutrition Plans
- Samsung Health Integration
- Voice Assistant Support
- Multi-Language OCR
- Scan History Dashboard
- Wearable Device Integration

---

## 💡 Inspiration

Many consumers struggle to understand the nutritional impact of packaged foods. Nutrition labels are often difficult to interpret, hidden sugars go unnoticed, and healthier choices become harder to make.

NutriScanAI was built to simplify nutrition awareness using Barcode Scanning, OCR, and AI-powered analysis to provide instant, understandable food insights.

---

## 👨‍💻 Author

### M Vivek Reddy

Data Science Graduate | AI & Analytics Enthusiast

🔗 LinkedIn  
https://www.linkedin.com/in/vivek-reddy-mandila

🔗 GitHub  
https://github.com/MANDILAVIVEK

---

## ⭐ Support

If you found this project useful, please consider giving it a star on GitHub.

Star ⭐ the repository and share your feedback.
