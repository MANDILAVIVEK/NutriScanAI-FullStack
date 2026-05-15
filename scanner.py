try:

    from pyzbar.pyzbar import decode
    import cv2

    SCANNER_AVAILABLE = True

except Exception as e:

    print("Scanner unavailable:", e)

    SCANNER_AVAILABLE = False


def scan_barcode():

    # If scanner unavailable (like Streamlit Cloud)
    if not SCANNER_AVAILABLE:

        return None

    cap = cv2.VideoCapture(0)

    barcode_data = None

    while True:

        success, frame = cap.read()

        if not success:

            break

        # Decode barcode
        for barcode in decode(frame):

            barcode_data = barcode.data.decode("utf-8")

            pts = barcode.polygon

            if len(pts) == 4:

                pts = [(pt.x, pt.y) for pt in pts]

                for i in range(4):

                    cv2.line(
                        frame,
                        pts[i],
                        pts[(i + 1) % 4],
                        (0, 255, 0),
                        2
                    )

            cv2.putText(
                frame,
                barcode_data,
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

        cv2.imshow(
            "NutriScanAI Barcode Scanner",
            frame
        )

        # Stop after barcode found
        if barcode_data:

            break

        # Press Q to quit
        if cv2.waitKey(1) & 0xFF == ord("q"):

            break

    cap.release()

    cv2.destroyAllWindows()

    return barcode_data