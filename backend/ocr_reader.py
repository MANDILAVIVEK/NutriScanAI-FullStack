import os
import cv2
import uuid
import requests
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")


def preprocess_image(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC,
    )

    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    gray = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )[1]

    processed_path = f"processed_{uuid.uuid4().hex}.png"

    cv2.imwrite(processed_path, gray)

    return processed_path


def extract_text(image_path):

    if not OCR_SPACE_API_KEY:
        return "OCR_SPACE_API_KEY missing"

    processed_image = preprocess_image(image_path)

    url = "https://api.ocr.space/parse/image"

    try:

        with open(processed_image, "rb") as image_file:

            response = requests.post(
                url,
                files={"filename": image_file},
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

        result = response.json()

        if os.path.exists(processed_image):
            os.remove(processed_image)

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

        if os.path.exists(processed_image):
            os.remove(processed_image)

        return f"OCR failed: {str(e)}"