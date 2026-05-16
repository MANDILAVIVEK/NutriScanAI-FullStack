import streamlit as st
import pandas as pd
import platform

from product_api import fetch_product_data
from analyzer import analyze_nutrition
from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values
from ingredient_analyzer import analyze_ingredients
from barcode_image_scanner import scan_barcode_from_image

if platform.system() == "Windows":
    from scanner import scan_barcode
else:
    scan_barcode = None


st.set_page_config(
    page_title="NutriScanAI",
    page_icon="🥗",
    layout="centered"
)

st.title("🥗 NutriScanAI")
st.write("AI-powered nutrition analysis using Barcode + OCR")

# -------------------------------
# BARCODE SECTION
# -------------------------------

st.subheader("📦 Barcode Product Scanner")

barcode = ""

if scan_barcode is not None:
    if st.button("📷 Start Barcode Scanner"):
        scanned_barcode = scan_barcode()

        if scanned_barcode:
            barcode = scanned_barcode
            st.success(f"✅ Scanned Barcode: {barcode}")
else:
    st.info("📷 Camera barcode scanning is available only on local Windows. Use manual input or barcode image upload.")

barcode = st.text_input("Enter Barcode", value=barcode)

# -------------------------------
# BARCODE IMAGE UPLOAD
# -------------------------------

st.subheader("🖼 Upload Barcode Image")

barcode_image = st.file_uploader(
    "Upload barcode image",
    type=["jpg", "jpeg", "png"],
    key="barcode_image"
)

if barcode_image is not None:

    with open("uploaded_barcode.jpg", "wb") as f:
        f.write(barcode_image.getbuffer())

    detected_barcode = scan_barcode_from_image("uploaded_barcode.jpg")

    if detected_barcode:
        st.success(f"✅ Barcode detected: {detected_barcode}")
        barcode = detected_barcode
    else:
        st.error("❌ Could not detect barcode. Try a clearer barcode image.")

# -------------------------------
# PRODUCT API FETCH
# -------------------------------

if barcode:

    product_data = fetch_product_data(barcode)

    if product_data:

        product_name = product_data["name"]
        brand = product_data["brand"]
        ingredients = product_data["ingredients"]
        nutriments = product_data["nutriments"]
        image_url = product_data["image_url"]

        sugar = nutriments.get("sugars_100g")
        protein = nutriments.get("proteins_100g")
        carbs = nutriments.get("carbohydrates_100g")
        salt = nutriments.get("salt_100g")
        fat = nutriments.get("fat_100g")

        st.subheader("📦 Product Information")

        if image_url:
            st.image(image_url, width=250)

        st.write("**Product Name:**", product_name)
        st.write("**Brand:**", brand)

        st.subheader("🧾 Ingredients")

        if ingredients and ingredients != "Ingredients not available":
            st.write(ingredients)
        else:
            st.warning("⚠ Ingredients not available")

        st.subheader("🔍 Ingredient Intelligence")

        ingredient_analysis = analyze_ingredients(ingredients)

        for item in ingredient_analysis:
            st.write(item)

        st.subheader("🥗 Nutrition Data")

        nutrition_df = pd.DataFrame({
            "Nutrient": ["Sugar", "Protein", "Carbs", "Fat", "Salt"],
            "Value": [
                sugar if sugar is not None else 0,
                protein if protein is not None else 0,
                carbs if carbs is not None else 0,
                fat if fat is not None else 0,
                salt if salt is not None else 0
            ]
        })

        st.dataframe(nutrition_df, use_container_width=True)

        st.subheader("📊 Nutrition Chart")
        st.bar_chart(nutrition_df, x="Nutrient", y="Value")

        if None in [sugar, protein, carbs, salt]:

            st.warning("⚠ Nutrition information is missing for this product.")
            st.info("📸 Please upload the product nutrition label image below for OCR analysis.")

        else:

            result = analyze_nutrition(sugar, protein, carbs, salt)

            st.subheader("🚦 Health Score")

            score = result["score"]
            status = result["status"]
            color = result["color"]

            st.metric("Health Score", f"{score}/100")
            st.progress(score / 100)

            if color == "green":
                st.success(f"🟢 {status}")
            elif color == "orange":
                st.warning(f"🟡 {status}")
            else:
                st.error(f"🔴 {status}")

            st.subheader("🤖 AI Recommendations")

            for tip in result["advice"]:
                st.write(tip)

            st.subheader("🏷 Product Category")

            if protein > 10:
                st.success("💪 Gym Friendly")
            else:
                st.warning("⚠ Low Protein Product")

            if sugar > 15:
                st.warning("🍭 High Sugar Snack")
            else:
                st.success("✅ Low Sugar Product")

            if fat is not None and fat < 5:
                st.success("🥗 Low Fat Product")

            st.subheader("🥗 Diet Suitability")

            if sugar < 5 and fat < 10:
                st.success("✅ Suitable for Weight Loss Diet")
            else:
                st.warning("⚠ Not ideal for Weight Loss")

            if protein > 10:
                st.success("💪 Good for Muscle Building")
            else:
                st.warning("⚠ Low protein for fitness goals")

            st.subheader("⚠ Allergy Detection")

            allergy_keywords = ["milk", "soy", "peanut", "nuts", "gluten", "wheat"]
            found_allergies = []

            ingredients_lower = ingredients.lower()

            for item in allergy_keywords:
                if item in ingredients_lower:
                    found_allergies.append(item)

            if found_allergies:
                st.error("Contains: " + ", ".join(found_allergies))
            else:
                st.success("✅ No common allergens detected")

    else:
        st.error("❌ Product not found")

# -------------------------------
# OCR SECTION
# -------------------------------

st.subheader("🧠 OCR Nutrition Extraction")

uploaded_file = st.file_uploader(
    "Upload Nutrition Label Image",
    type=["jpg", "jpeg", "png"],
    key="nutrition_label"
)

if uploaded_file is not None:

    with open("uploaded_label.jpg", "wb") as f:
        f.write(uploaded_file.getbuffer())

    st.success("✅ Image uploaded successfully")

    text = extract_text("uploaded_label.jpg")

    st.subheader("📄 OCR Extracted Text")
    st.text(text)

    nutrition = extract_nutrition_values(text)

    st.subheader("🧪 Extracted Nutrition Values")
    st.write(nutrition)

    missing_values = [
        key for key, value in nutrition.items()
        if value == "Not Found"
    ]

    if missing_values:
        st.warning("⚠ OCR could not read some nutrition values clearly.")
        st.info("📸 Please upload a clearer cropped image of only the nutrition table.")

    st.subheader("✍️ Correct / Fill Nutrition Values")

    protein_input = st.text_input(
        "Protein (g)",
        value="" if nutrition.get("protein") == "Not Found" else nutrition.get("protein", "")
    )

    carbs_input = st.text_input(
        "Carbohydrates (g)",
        value="" if nutrition.get("carbs") == "Not Found" else nutrition.get("carbs", "")
    )

    sugar_input = st.text_input(
        "Sugar (g)",
        value="" if nutrition.get("sugar") == "Not Found" else nutrition.get("sugar", "")
    )

    fat_input = st.text_input(
        "Fat (g)",
        value="" if nutrition.get("fat") == "Not Found" else nutrition.get("fat", "")
    )

    sodium_input = st.text_input(
        "Sodium (mg)",
        value="" if nutrition.get("sodium") == "Not Found" else nutrition.get("sodium", "")
    )

    if st.button("✅ Analyze Corrected Values"):

        try:
            sugar = float(sugar_input)
            protein = float(protein_input)
            carbs = float(carbs_input)
            fat = float(fat_input)
            sodium = float(sodium_input)

            salt = sodium / 1000

            corrected_df = pd.DataFrame({
                "Nutrient": ["Protein", "Carbs", "Sugar", "Fat"],
                "Value": [protein, carbs, sugar, fat]
            })

            st.subheader("📊 Corrected Nutrition Chart")
            st.bar_chart(corrected_df, x="Nutrient", y="Value")

            result = analyze_nutrition(sugar, protein, carbs, salt)

            st.subheader("🚦 Corrected Health Score")

            score = result["score"]
            status = result["status"]
            color = result["color"]

            st.metric("Health Score", f"{score}/100")
            st.progress(score / 100)

            if color == "green":
                st.success(f"🟢 {status}")
            elif color == "orange":
                st.warning(f"🟡 {status}")
            else:
                st.error(f"🔴 {status}")

            st.subheader("🤖 AI Recommendations")

            for tip in result["advice"]:
                st.write(tip)

        except:
            st.error("Please enter valid numeric values.")

st.markdown("---")
st.caption("Made with Streamlit ❤️")