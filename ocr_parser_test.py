from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values

image_path = r"C:\Users\ruthv\Downloads\WhatsApp Image 2026-05-14 at 20.47.00.jpeg"

text = extract_text(image_path)

nutrition = extract_nutrition_values(text)

print("\nExtracted Nutrition Values:\n")

print(nutrition)