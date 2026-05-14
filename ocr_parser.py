import re

def extract_value(pattern, text):

    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        return match.group(1)

    return "Not Found"


def extract_nutrition_values(text):

    nutrition = {}

    # Clean OCR mistakes
    text = text.replace("=", "E")

    # -----------------------------------
    # IMPROVED PATTERNS
    # -----------------------------------

    nutrition["protein"] = extract_value(
        r'PROTEIN\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    nutrition["carbs"] = extract_value(
        r'CARBOHYDRATE\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    nutrition["sugar"] = extract_value(
        r'TOTAL SUGARS\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    nutrition["sodium"] = extract_value(
        r'SODIUM\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    nutrition["fat"] = extract_value(
        r'TOTAL FAT\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    nutrition["saturated_fat"] = extract_value(
        r'SATURATED FAT\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    return nutrition