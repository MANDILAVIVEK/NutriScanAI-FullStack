import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def explain_ingredients(ingredients):

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text