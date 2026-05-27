import os
import requests
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")


def extract_text(image_path):
    if not OCR_SPACE_API_KEY:
        return "OCR_SPACE_API_KEY missing"

    url = "https://api.ocr.space/parse/image"

    try:
        with open(image_path, "rb") as image_file:
            response = requests.post(
                url,
                files={"filename": image_file},
                data={
                    "apikey": OCR_SPACE_API_KEY,
                    "language": "eng",
                    "isOverlayRequired": "false",
                    "OCREngine": "2",
                    "scale": "true",
                    "detectOrientation": "true",
                },
                timeout=60,
            )

        result = response.json()

        if result.get("IsErroredOnProcessing"):
            return result.get("ErrorMessage", ["OCR failed"])[0]

        parsed_results = result.get("ParsedResults")

        if not parsed_results:
            return "No text found"

        return parsed_results[0].get("ParsedText", "")

    except Exception as e:
        return f"OCR failed: {str(e)}"