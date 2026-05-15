import re

def extract_value(pattern, text):
    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        return match.group(1)

    return "Not Found"


def extract_nutrition_values(text):

    nutrition = {}

    # Clean common OCR mistakes
    text = text.replace("=", "E")
    text = text.replace("|", " ")
    text = text.replace(":", " ")
    text = text.replace("’", "")
    text = text.replace("‘", "")
    text = text.replace(",", ".")

    # Protein
    nutrition["protein"] = extract_value(
        r'PROTEIN\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    # Carbohydrates
    nutrition["carbs"] = extract_value(
        r'CARBOHYDRATE\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    # Total Sugars
    nutrition["sugar"] = extract_value(
        r'TOTAL\s*SUGARS\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    # Sodium
    nutrition["sodium"] = extract_value(
        r'SODIUM\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    # Total Fat
    nutrition["fat"] = extract_value(
        r'TOTAL\s*FAT\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    # Saturated Fat
    nutrition["saturated_fat"] = extract_value(
        r'SATURATED\s*FAT\s*\(.*?\)\s*(\d+\.?\d*)',
        text
    )

    return nutrition