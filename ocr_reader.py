import cv2
import pytesseract
from PIL import Image

# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Tesseract\tesseract.exe"

def extract_text(image_path):

    # Read image using OpenCV
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize image for better OCR
    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # Noise removal
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Thresholding
    gray = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    # Save processed image temporarily
    processed_path = "processed_image.png"

    cv2.imwrite(processed_path, gray)

    # OCR extraction
    text = pytesseract.image_to_string(
        Image.open(processed_path)
    )

    return text