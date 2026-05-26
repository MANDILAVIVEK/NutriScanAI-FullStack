import logging
import requests

logger = logging.getLogger(__name__)

API_TIMEOUT = 10
USER_AGENT = "NutriScanAI/1.0 (github.com/MANDILAVIVEK/NutriScanAI)"


def fetch_product_data(barcode: str) -> dict | None:
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    headers = {"User-Agent": USER_AGENT}

    try:
        response = requests.get(url, headers=headers, timeout=API_TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        logger.error("Open Food Facts request timed out for barcode %s", barcode)
        return None
    except requests.exceptions.RequestException as e:
        logger.error("Open Food Facts request failed: %s", e)
        return None
    except ValueError as e:
        logger.error("Failed to parse Open Food Facts JSON: %s", e)
        return None

    if data.get("status") != 1:
        logger.info("Product not found in database: %s", barcode)
        return None

    product = data.get("product", {})

    return {
        "name": product.get("product_name", "Unknown"),
        "brand": product.get("brands", "Unknown"),
        # FIX: return raw ingredients field (could be list or string)
        # main.py converts it via ingredients_to_str()
        "ingredients": product.get("ingredients_text") or product.get("ingredients", ""),
        "nutriments": product.get("nutriments", {}),
        "image_url": product.get("image_url"),
    }
