ingredient_info = {
    "palm oil": "Highly processed fat commonly used in packaged foods.",
    "corn syrup": "Hidden sugar linked with high calorie intake.",
    "glucose syrup": "Fast absorbing sugar that may spike blood sugar levels.",
    "fructose": "A form of sugar that can increase calorie intake.",
    "dextrose": "Simple sugar commonly used in processed foods.",
    "maltose": "Hidden sugar often found in packaged snacks.",
    "preservative": "Used to extend shelf life in processed foods.",
    "artificial flavour": "Synthetic flavor additive used in packaged products.",
    "artificial flavor": "Synthetic flavor additive used in packaged products.",
    "colour": "Added food coloring may indicate processing.",
    "color": "Added food coloring may indicate processing.",
    "msg": "Flavor enhancer commonly used in processed foods."
}


def analyze_ingredients(ingredients_text):

    results = []

    if not ingredients_text or ingredients_text == "Ingredients not available":
        return ["⚠ Ingredients data not available"]

    ingredients_lower = ingredients_text.lower()

    for ingredient, description in ingredient_info.items():

        if ingredient in ingredients_lower:

            results.append(
                f"⚠ {ingredient.title()}: {description}"
            )

    hidden_sugars = [
        "maltose",
        "dextrose",
        "corn syrup",
        "glucose syrup",
        "fructose"
    ]

    for sugar in hidden_sugars:

        if sugar in ingredients_lower:

            results.append(
                f"🍬 Hidden Sugar Detected: {sugar.title()}"
            )

    if not results:
        results.append("✅ No major ingredient concerns detected")

    return results