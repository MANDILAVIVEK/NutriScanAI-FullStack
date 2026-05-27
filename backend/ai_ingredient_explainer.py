import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


def explain_ingredients(ingredients):

    api_key = os.getenv("GENAI_API_KEY")

    if not api_key:
        return "GENAI_API_KEY missing"

    client = genai.Client(api_key=api_key)

    if not ingredients:
        return "Ingredients unavailable"

    prompt = f"""
    Explain these ingredients in simple language:

    {ingredients}

    Format:

    Summary:
    Hidden sugars:
    Health concerns:
    Allergy risks:
    Recommendation:
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"AI service unavailable: {str(e)}"