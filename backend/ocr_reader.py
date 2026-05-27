import os
import base64
import mimetypes
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()


def extract_text(image_path):
    api_key = os.getenv("GENAI_API_KEY")

    if not api_key:
        return "GENAI_API_KEY missing"

    client = genai.Client(api_key=api_key)

    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        mime_type = "image/jpeg"

    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = """
    Extract all readable text from this food nutrition label image.
    Keep nutrition values exactly as shown.
    Return only extracted text.
    """

    last_error = ""

    for _ in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=[
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_base64,
                        }
                    },
                    prompt,
                ],
            )
            return response.text

        except Exception as e:
            last_error = str(e)
            time.sleep(2)

    return f"OCR temporarily unavailable: {last_error}"