from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from product_api import fetch_product_data
from analyzer import analyze_nutrition
from ingredient_analyzer import analyze_ingredients
from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values
from barcode_image_scanner import scan_barcode_from_image
from ai_ingredient_explainer import explain_ingredients

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "NutriScanAI Backend Running"}


@app.get("/product/{barcode}")
def get_product(barcode: str):
    product = fetch_product_data(barcode)

    if not product:
        return {"status": "error", "message": "Product not found"}

    nutriments = product["nutriments"]

    sugar = nutriments.get("sugars_100g")
    protein = nutriments.get("proteins_100g")
    carbs = nutriments.get("carbohydrates_100g")
    salt = nutriments.get("salt_100g")
    fat = nutriments.get("fat_100g", 0)

    ingredients = product.get("ingredients", "Ingredients not available")

    ingredient_result = analyze_ingredients(ingredients)
    allergy_result = detect_allergies(ingredients)
    category_result = get_product_category(sugar, protein, carbs, fat)
    diet_result = get_diet_suitability(sugar, protein, fat)

    if None in [sugar, protein, carbs, salt]:
        return {
            "status": "partial",
            "product": product,
            "ingredient_analysis": ingredient_result,
            "allergy_detection": allergy_result,
            "product_category": category_result,
            "diet_suitability": diet_result,
            "message": "Nutrition data missing. Upload nutrition label image.",
        }

    analysis = analyze_nutrition(sugar, protein, carbs, salt, fat)

    return {
        "status": "success",
        "product": product,
        "analysis": analysis,
        "ingredient_analysis": ingredient_result,
        "allergy_detection": allergy_result,
        "product_category": category_result,
        "diet_suitability": diet_result,
    }


@app.post("/ocr")
async def ocr_nutrition(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        text = extract_text(image_bytes)
        nutrition = extract_nutrition_values(text)

        def clean_to_float(v):
            try:
                return float(v) if v not in [None, "Not Found"] else 0.0
            except Exception:
                return 0.0

        sugar = clean_to_float(nutrition.get("sugar"))
        protein = clean_to_float(nutrition.get("protein"))
        carbs = clean_to_float(nutrition.get("carbs"))
        fat = clean_to_float(nutrition.get("fat"))
        saturated_fat = clean_to_float(nutrition.get("saturated_fat"))
        sodium = clean_to_float(nutrition.get("sodium"))

        salt = (sodium / 1000.0) * 2.5

        if all(v == 0 for v in [sugar, protein, carbs, fat, sodium]):
            return {
                "status": "debug",
                "message": "Nutrition values could not be extracted properly from the image.",
                "ocr_text": text,
                "nutrition": nutrition,
            }

        analysis = analyze_nutrition(
            sugar,
            protein,
            carbs,
            salt,
            fat,
        )

        category_result = get_product_category(
            sugar,
            protein,
            carbs,
            fat,
        )

        diet_result = get_diet_suitability(
            sugar,
            protein,
            fat,
        )

        return {
            "status": "success",
            "ocr_text": text,
            "nutrition": {
                "sugar": sugar,
                "protein": protein,
                "carbs": carbs,
                "fat": fat,
                "saturated_fat": saturated_fat,
                "sodium": sodium,
                "salt": round(salt, 2),
            },
            "analysis": analysis,
            "product_category": category_result,
            "diet_suitability": diet_result,
            "allergy_detection": [
                "⚠ OCR data blocks do not contain ingredient texts required for allergen tracing."
            ],
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.post("/scan-barcode-image")
async def scan_barcode_image(file: UploadFile = File(...)):
    file_path = f"barcode_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        barcode = scan_barcode_from_image(file_path)

        if barcode:
            return {
                "status": "success",
                "barcode": barcode,
            }

        return {
            "status": "error",
            "message": "Barcode not detected",
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


class CorrectedNutrition(BaseModel):
    sugar: float
    protein: float
    carbs: float
    salt: float
    fat: float


@app.post("/analyze-corrected")
def analyze_corrected(data: CorrectedNutrition):
    analysis = analyze_nutrition(
        data.sugar,
        data.protein,
        data.carbs,
        data.salt,
        data.fat,
    )

    return {
        "status": "success",
        "analysis": analysis,
    }


def detect_allergies(ingredients):
    allergy_keywords = [
        "milk",
        "soy",
        "peanut",
        "nuts",
        "gluten",
        "wheat",
        "almond",
        "cashew",
        "egg",
    ]

    found = []
    ingredients_lower = ingredients.lower()

    for item in allergy_keywords:
        if item in ingredients_lower:
            found.append(item)

    if found:
        return [f"⚠ Contains: {', '.join(found)}"]

    return ["✅ No common allergens detected"]


def get_product_category(sugar, protein, carbs, fat):
    categories = []

    try:
        sugar = float(sugar) if sugar is not None else 0
        protein = float(protein) if protein is not None else 0
        carbs = float(carbs) if carbs is not None else 0
        fat = float(fat) if fat is not None else 0
    except Exception:
        return ["Category unavailable"]

    if protein > 10:
        categories.append("💪 Gym Friendly")
    else:
        categories.append("⚠ Low Protein Product")

    if sugar > 15:
        categories.append("🍭 High Sugar Snack")
    else:
        categories.append("✅ Low Sugar Product")

    if fat < 5:
        categories.append("🥗 Low Fat Product")
    elif fat > 20:
        categories.append("⚠ High Fat Product")

    if carbs > 60:
        categories.append("⚠ High Carb Product")

    return categories


def get_diet_suitability(sugar, protein, fat):
    suitability = []

    try:
        sugar = float(sugar) if sugar is not None else 0
        protein = float(protein) if protein is not None else 0
        fat = float(fat) if fat is not None else 0
    except Exception:
        return ["Diet suitability unavailable"]

    if sugar < 5 and fat < 10:
        suitability.append("✅ Suitable for Weight Loss Diet")
    else:
        suitability.append("⚠ Not ideal for Weight Loss")

    if protein > 10:
        suitability.append("💪 Good for Muscle Building")
    else:
        suitability.append("⚠ Low protein for fitness goals")

    if sugar > 15:
        suitability.append("⚠ Not ideal for diabetic-friendly diet")
    else:
        suitability.append("✅ Sugar level acceptable")

    return suitability


class IngredientRequest(BaseModel):
    ingredients: str


@app.post("/explain-ingredients")
def explain(data: IngredientRequest):
    try:
        result = explain_ingredients(data.ingredients)

        return {
            "status": "success",
            "result": result,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }