from ocr_reader import extract_text

image_path = r"C:\Users\ruthv\Downloads\WhatsApp Image 2026-05-14 at 22.03.44.jpeg"

text = extract_text(image_path)

print(text)