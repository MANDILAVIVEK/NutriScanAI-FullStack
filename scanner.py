import cv2
from pyzbar.pyzbar import decode
import streamlit as st

def scan_barcode():

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    if not cap.isOpened():
        st.error("❌ Unable to access camera")
        return None

    barcode_data = None

    stframe = st.empty()

    while True:

        success, frame = cap.read()

        if not success:
            st.error("❌ Failed to read camera")
            break

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

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        stframe.image(frame, channels="RGB")

        if barcode_data:
            break

    cap.release()

    return barcode_data