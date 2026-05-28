import os
import cv2
import uuid
import requests
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")


def preprocess_image(image_path):
    image = cv2.imread(image_path)

    if image is None:
        raise FileNotFoundError(f"Could not open image: {image_path}")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC,
    )

    gray = cv2.medianBlur(gray, 3)

    gray = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        2,
    )

    processed_path = f"processed_{uuid.uuid4().hex}.png"
    cv2.imwrite(processed_path, gray)

    return processed_path


def extract_text(image_path):
    if not OCR_SPACE_API_KEY:
        return "OCR_SPACE_API_KEY missing from environment configurations"

    processed_image = None
    url = "https://api.ocr.space/parse/image"

    try:
        processed_image = preprocess_image(image_path)

        with open(processed_image, "rb") as image_file:
            response = requests.post(
                url,
                files={"file": image_file},
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

        if result.get("IsErroredOnProcessing"):
            return str(result.get("ErrorMessage"))

        parsed_results = result.get("ParsedResults")

        if not parsed_results:
            return "No text found"

        extracted_text = parsed_results[0].get("ParsedText", "")

        if not extracted_text.strip():
            return "No text found"

        return extracted_text

    except Exception as e:
        return f"OCR failed: {str(e)}"

    finally:
        if processed_image and os.path.exists(processed_image):
            os.remove(processed_image)