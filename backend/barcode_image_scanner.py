import cv2

def scan_barcode_from_image(image_path):
    img = cv2.imread(image_path)

    if img is None:
        return None

    detector = cv2.barcode.BarcodeDetector()

    try:
        result = detector.detectAndDecode(img)

        # OpenCV versions return different outputs
        if len(result) == 3:
            decoded_info, decoded_type, points = result
        elif len(result) == 4:
            ok, decoded_info, decoded_type, points = result
        else:
            return None

        # Handle multiple barcodes
        if isinstance(decoded_info, (list, tuple)):
            if len(decoded_info) > 0:
                return decoded_info[0]

        return decoded_info

    except Exception as e:
        print("Barcode Error:", e)
        return None