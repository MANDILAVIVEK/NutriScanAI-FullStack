import requests
from analyzer import analyze_nutrition

# Barcode Number
barcode = "737628064502"

# Open Food Facts API URL
url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"

# Headers
headers = {
    "User-Agent": "NutriScanAI/1.0"
}

# API Request
response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)

try:
    # Convert response to JSON
    data = response.json()

    # Check if product exists
    if data["status"] == 1:

        product = data["product"]

        print("\n--- Product Information ---")

        # Product Details
        print("Product Name:", product.get("product_name", "N/A"))
        print("Brand:", product.get("brands", "N/A"))

        # Nutrition Data
        nutriments = product.get("nutriments", {})

        sugar = nutriments.get("sugars_100g")
        protein = nutriments.get("proteins_100g")
        carbs = nutriments.get("carbohydrates_100g")
        salt = nutriments.get("salt_100g")

        print("\n--- Nutrition Data ---")

        print("Sugar:", sugar if sugar is not None else "Data Missing")
        print("Protein:", protein if protein is not None else "Data Missing")
        print("Carbohydrates:", carbs if carbs is not None else "Data Missing")
        print("Salt:", salt if salt is not None else "Data Missing")

        # Check if any nutrition data is missing
        if None in [sugar, protein, carbs, salt]:

            print("\n⚠ Nutrition data incomplete")
            print("Future solution: OCR nutrition label scanning")

        else:

            print("\n✅ Nutrition data available")

            # Analyze nutrition
            result = analyze_nutrition(sugar, protein, carbs, salt)

            print("\nHealth Analysis:", result)

    else:
        print("❌ Product not found")

except Exception as e:
    print("Error:", e)