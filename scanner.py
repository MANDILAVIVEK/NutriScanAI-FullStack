import cv2

try:
    from pyzbar.pyzbar import decode

    PYZBAR_AVAILABLE = True

except:

    PYZBAR_AVAILABLE = False


def scan_barcode():

    if not PYZBAR_AVAILABLE:

        return None

    cap = cv2.VideoCapture(0)

    # Higher resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    barcode_data = None

    while True:

        success, frame = cap.read()

        if not success:
            break

        # -----------------------------------
        # IMAGE PREPROCESSING
        # -----------------------------------

        gray = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2GRAY
        )

        gray = cv2.GaussianBlur(
            gray,
            (5, 5),
            0
        )

        # -----------------------------------
        # BARCODE DETECTION
        # -----------------------------------

        detected_barcodes = decode(gray)

        for barcode in detected_barcodes:

            barcode_data = barcode.data.decode(
                "utf-8"
            )

            x, y, w, h = barcode.rect

            # Draw rectangle
            cv2.rectangle(
                frame,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                3
            )

            # Display barcode
            cv2.putText(
                frame,
                barcode_data,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

            break

        # -----------------------------------
        # UI TEXT
        # -----------------------------------

        cv2.putText(
            frame,
            "Show Barcode to Camera",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 0, 0),
            2
        )

        cv2.imshow(
            "NutriScanAI Barcode Scanner",
            frame
        )

        # Stop if barcode found
        if barcode_data:
            break

        # Press Q to quit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()

    try:
        cv2.destroyAllWindows()

    except:
        pass

    return barcode_data