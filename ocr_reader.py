import cv2
import pytesseract
from PIL import Image
import platform
import os

# -----------------------------------
# TESSERACT PATH
# -----------------------------------

if platform.system() == "Windows":

    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

else:

    pytesseract.pytesseract.tesseract_cmd = (
        "/usr/bin/tesseract"
    )


def extract_text(image_path):

    # Read image
    image = cv2.imread(image_path)

    if image is None:
        return "Image not found"

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize image
    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # Remove noise
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Threshold
    gray = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    # Save temporary image
    processed_path = "processed_image.png"

    cv2.imwrite(processed_path, gray)

    # OCR
    text = pytesseract.image_to_string(
        Image.open(processed_path)
    )

    return text