import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GENAI_API_KEY")
)


def extract_text(image_path):
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            {
                "role": "user",
                "parts": [
                    {
                        "text": """
Extract all readable text from this food nutrition label image.
Keep nutrition values exactly as shown.
Return only extracted text.
"""
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_bytes
                        }
                    }
                ]
            }
        ]
    )

    return response.text