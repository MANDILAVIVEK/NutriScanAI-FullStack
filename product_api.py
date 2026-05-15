import requests

def fetch_product_data(barcode):

    url = (
        f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    )

    headers = {
        "User-Agent": "NutriScanAI/1.0"
    }

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        data = response.json()

        if data.get("status") != 1:
            return None

        product = data.get("product", {})

        return {

            "name": product.get(
                "product_name",
                "Unknown"
            ),

            "brand": product.get(
                "brands",
                "Unknown"
            ),

            "ingredients": product.get(
                "ingredients_text",
                "Ingredients not available"
            ),

            "nutriments": product.get(
                "nutriments",
                {}
            )
        }

    except:

        return None