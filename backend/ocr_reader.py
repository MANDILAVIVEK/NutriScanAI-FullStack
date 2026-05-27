import cv2
import pytesseract
from PIL import Image
import platform
import os
import uuid

if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )
else:
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"


def extract_text(image_path):
    image = cv2.imread(image_path)

    if image is None:
        return "Image not found"

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

    text = pytesseract.image_to_string(Image.open(processed_path))

    if os.path.exists(processed_path):
        os.remove(processed_path)

    return text