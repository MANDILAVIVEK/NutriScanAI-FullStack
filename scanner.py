import platform

try:
    from pyzbar.pyzbar import decode
    import cv2

    PYZBAR_AVAILABLE = True

except:
    PYZBAR_AVAILABLE = False


def scan_barcode():

    # Disable scanner on Linux cloud
    if platform.system() != "Windows":

        return None

    if not PYZBAR_AVAILABLE:

        return None

    cap = cv2.VideoCapture(0)

    barcode_data = None

    while True:

        success, frame = cap.read()

        if not success:
            break

        for barcode in decode(frame):

            barcode_data = barcode.data.decode("utf-8")

            break

        if barcode_data:
            break

    cap.release()

    try:
        cv2.destroyAllWindows()

    except:
        pass

    return barcode_data