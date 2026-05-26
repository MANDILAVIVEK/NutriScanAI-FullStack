from pyzbar.pyzbar import decode
from PIL import Image, ImageEnhance, ImageFilter


def scan_barcode_from_image(image_path):
    image = Image.open(image_path)

    test_images = []

    test_images.append(image)

    gray = image.convert("L")
    test_images.append(gray)

    test_images.append(ImageEnhance.Contrast(gray).enhance(2))
    test_images.append(ImageEnhance.Sharpness(gray).enhance(2))

    w, h = gray.size
    test_images.append(gray.resize((w * 2, h * 2)))
    test_images.append(gray.resize((w * 3, h * 3)).filter(ImageFilter.SHARPEN))

    for img in test_images:
        barcodes = decode(img)

        if barcodes:
            return barcodes[0].data.decode("utf-8")

    return None