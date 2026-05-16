import re


def extract_value(patterns, text):

    for pattern in patterns:

        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(1)

    return "Not Found"


def extract_nutrition_values(text):

    nutrition = {}

    text = text.replace("|", " ")
    text = text.replace(":", " ")
    text = text.replace(",", ".")
    text = text.replace("§", "g")
    text = text.replace("etal Fat", "Total Fat")
    text = text.replace("Tetal Fat", "Total Fat")
    text = text.replace("otal Fat", "Total Fat")

    nutrition["protein"] = extract_value(
        [
            r'Protein\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Protein\s+(\d+\.?\d*)'
        ],
        text
    )

    nutrition["carbs"] = extract_value(
        [
            r'Carbohydrates?\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Carbohydrates?\s+(\d+\.?\d*)'
        ],
        text
    )

    nutrition["sugar"] = extract_value(
        [
            r'Total\s*Sugars?\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Total\s*Sugars?\s+(\d+\.?\d*)',
            r'Sugars?\s+(\d+\.?\d*)'
        ],
        text
    )

    nutrition["fat"] = extract_value(
        [
            r'Total\s*Fat\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Total\s*Fat\s+(\d+\.?\d*)',
            r'Fat\s+(\d+\.?\d*)'
        ],
        text
    )

    nutrition["saturated_fat"] = extract_value(
        [
            r'Saturated\s*Fat\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Saturated\s*Fat\s+(\d+\.?\d*)'
        ],
        text
    )

    nutrition["sodium"] = extract_value(
        [
            r'Sodium\s*\(.*?\)\s*(\d+\.?\d*)',
            r'Sodium\s+(\d+\.?\d*)',
            r'Salt\s+(\d+\.?\d*)'
        ],
        text
    )

    return nutrition