from pyzbar.pyzbar import decode
from PIL import Image

def scan_barcode_from_image(image_path):

    image = Image.open(image_path)

    barcodes = decode(image)

    if barcodes:
        return barcodes[0].data.decode("utf-8")

    return None