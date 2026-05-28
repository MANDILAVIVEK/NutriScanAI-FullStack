import cv2
import numpy as np
import requests
import os
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")


def preprocess_image_bytes(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Could not decode image bytes")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    gray = cv2.medianBlur(gray, 3)

    gray = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        2,
    )

    success, encoded_img = cv2.imencode(".png", gray)

    if not success:
        raise ValueError("Could not encode processed image")

    return encoded_img.tobytes()


def extract_text(image_bytes):
    if not OCR_SPACE_API_KEY:
        return "OCR_SPACE_API_KEY missing"

    url = "https://api.ocr.space/parse/image"

    try:
        processed_bytes = preprocess_image_bytes(image_bytes)

        response = requests.post(
            url,
            files={
                "file": ("nutrition.png", processed_bytes, "image/png")
            },
            data={
                "apikey": OCR_SPACE_API_KEY,
                "language": "eng",
                "OCREngine": "2",
                "scale": "true",
                "detectOrientation": "true",
                "isTable": "true",
            },
            timeout=60,
        )

        response.raise_for_status()
        result = response.json()

        print("DEBUG OCR RESPONSE:", result)

        if result.get("IsErroredOnProcessing"):
            return str(result.get("ErrorMessage"))

        parsed_results = result.get("ParsedResults", [])

        if not parsed_results:
            return "No text found"

        text = parsed_results[0].get("ParsedText", "")

        if not text.strip():
            return "No text found"

        return text

    except Exception as e:
        return f"OCR failed: {str(e)}"