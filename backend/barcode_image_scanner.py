import cv2

def scan_barcode_from_image(image_path):
    img = cv2.imread(image_path)

    detector = cv2.barcode.BarcodeDetector()

    ok, decoded_info, decoded_type, points = detector.detectAndDecode(img)

    if ok and decoded_info:
        return decoded_info[0]

    return None