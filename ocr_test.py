from ocr_reader import extract_text

image_path = r"C:\Users\ruthv\Downloads\UploadFromMobile\17084.jpg"

text = extract_text(image_path)

print(text)