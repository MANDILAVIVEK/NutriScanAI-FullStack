import re


def extract_value(patterns, text):
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(1)

    return "Not Found"


def clean_number(value):
    """
    Cleans OCR text artifacts and explicitly outputs float representations.
    Returns 0.0 if the metric is missing to avoid crashing math functions.
    """
    if value == "Not Found" or value is None:
        return 0.0

    try:
        value = str(value).strip()

        # Remove unwanted characters
        value = value.replace("g", "")
        value = value.replace("mg", "")
        value = value.replace("%", "")
        value = value.strip()

        # OCR issue example: 17438 should become 17.43
        if len(value) >= 5 and "." not in value:
            value = value[:2] + "." + value[2:4]

        # Convert to float so calculation modules can use it immediately
        return float(value) if value else 0.0

    except Exception:
        return 0.0


def extract_nutrition_values(text):
    nutrition = {}

    # Normalize OCR text
    text = text.replace("\n", " ")
    text = text.replace("|", " ")
    text = text.replace(",", ".")
    text = re.sub(r"\s+", " ", text)

    # Common OCR corrections
    text = text.replace("PROT=IN", "PROTEIN")
    text = text.replace("Proteln", "PROTEIN")
    text = text.replace("Sodlum", "SODIUM")
    text = text.replace("SODIU 4", "SODIUM")
    text = text.replace("SODIU4", "SODIUM")
    text = text.replace("¢", "g")
    text = text.replace("30¢", "30g")

    # -------------------------------
    # Extract values via Regular Expressions
    # -------------------------------
    nutrition["protein"] = extract_value(
        [
            r"PROTEIN\s*\([gG9]\)\s*(\d+\.?\d*)",
            r"PROTEIN\s+(\d+\.\d+)",
            r"Protein\s+(\d+\.\d+)",
        ],
        text,
    )

    nutrition["carbs"] = extract_value(
        [
            r"CARBOHYDRATE\s*\([gG9]\)\s*(\d+\.?\d*)",
            r"CARBOHYDRATES\s+(\d+\.\d+)",
            r"CARBOHYDRATE\s+(\d+\.\d+)",
            r"Carbohydrates\s+(\d+\.\d+)",
        ],
        text,
    )

    nutrition["sugar"] = extract_value(
        [
            r"TOTAL\s*SUGARS\s*\([gG9]\)\s*(\d+\.?\d*)",
            r"TOTAL\s*SUGARS\s+(\d+\.?\d*)",
            r"Total\s*Sugars\s+(\d+\.?\d*)",
        ],
        text,
    )

    nutrition["fat"] = extract_value(
        [
            r"TOTAL\s*FAT\s*\([gG9]\)\s*(\d+\.?\d*)",
            r"TOTAL\s*FAT\s+(\d+\.?\d*)",
            r"Total\s*Fat\s+(\d+\.?\d*)",
        ],
        text,
    )

    nutrition["saturated_fat"] = extract_value(
        [
            r"SATURATED\s*FAT\s*\([gG9]\)\s*(\d+\.?\d*)",
            r"SATURATED\s*FAT.*?(\d+\.\d+)",
            r"SATURATED\s*FAT.*?(\d{4,5})",
            r"Saturated\s*Fat.*?(\d+\.\d+)",
        ],
        text,
    )

    nutrition["sodium"] = extract_value(
        [
            r"SODIUM\s*\(mg\)\s*(\d+\.?\d*)",
            r"SODIUM\s+mg\s*(\d+\.?\d*)",
            r"SODIUM\s+(\d+\.?\d*)",
            r"Sodium\s+(\d+\.?\d*)",
        ],
        text,
    )

    # Clean all extracted values into pure mathematical numbers
    for key in nutrition:
        nutrition[key] = clean_number(nutrition[key])

    return nutrition