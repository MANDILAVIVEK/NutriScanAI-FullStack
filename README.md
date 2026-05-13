# NutriScanAI 🥗

NutriScanAI is an AI-powered nutrition analysis application that scans product barcodes and provides health insights using nutrition data.

---

## Features

-  Barcode scanning
-  Open Food Facts API integration
-  Nutrition analysis
-  Health recommendations
-  Missing nutrition data detection
-  Streamlit web application
-  GitHub integration

---

##  Tech Stack

- Python
- Streamlit
- OpenCV
- pyzbar
- Requests

---

## Project Structure

```text
NutriScanAI/
│
├── app.py
├── api_fetch.py
├── analyzer.py
├── scanner.py
├── requirements.txt
├── README.md
└── assets/
```

---

## ▶ Run the Project

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Streamlit app:

```bash
streamlit run app.py
```

---

## Current Workflow

```text
Barcode
   ↓
API Fetch
   ↓
Nutrition Extraction
   ↓
Health Analysis
```

---

## 🔮 Future Improvements

-  Webcam barcode scanning
-  OCR nutrition label extraction
-  Nutrition charts
-  Health score meter
-  AI recommendation system
-  Cloud deployment

---

## 📌 GitHub Repository

https://github.com/MANDILAVIVEK/NutriScanAI
