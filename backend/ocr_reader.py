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
        raise ValueError("Could not decode image")

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # STRONG resize reduction
    height, width = gray.shape

    max_width = 1200

    if width > max_width:
        ratio = max_width / width
        new_width = int(width * ratio)
        new_height = int(height * ratio)

        gray = cv2.resize(
            gray,
            (new_width, new_height),
            interpolation=cv2.INTER_AREA
        )

    # Noise reduction
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # OCR thresholding
    gray = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        2,
    )

    # VERY HIGH compression
    success, encoded_img = cv2.imencode(
        ".jpg",
        gray,
        [int(cv2.IMWRITE_JPEG_QUALITY), 40]
    )

    if not success:
        raise ValueError("Encoding failed")

    compressed_bytes = encoded_img.tobytes()

    print("DEBUG IMAGE SIZE KB:", len(compressed_bytes) / 1024)

    return compressed_bytes


def extract_text(image_bytes):
    if not OCR_SPACE_API_KEY:
        return "OCR_SPACE_API_KEY missing"

    url = "https://api.ocr.space/parse/image"

    try:
        processed_bytes = preprocess_image_bytes(image_bytes)

        response = requests.post(
            url,
            files={
                "file": (
                    "nutrition.jpg",
                    processed_bytes,
                    "image/jpeg"
                )
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

        print("OCR RESPONSE:", result)

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