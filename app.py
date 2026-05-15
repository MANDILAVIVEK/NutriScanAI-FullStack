import streamlit as st
import pandas as pd

from product_api import fetch_product_data
from analyzer import analyze_nutrition
from scanner import scan_barcode
from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values

st.set_page_config(
    page_title="NutriScanAI",
    page_icon="🥗",
    layout="centered"
)

st.title("🥗 NutriScanAI")
st.write("AI-powered nutrition analysis using Barcode + OCR")

# -----------------------------------
# BARCODE PRODUCT SCANNER
# -----------------------------------

st.subheader("📦 Barcode Product Scanner")

barcode = ""

if st.button("📷 Start Barcode Scanner"):
    scanned_barcode = scan_barcode()

    if scanned_barcode:
        barcode = scanned_barcode
        st.success(f"✅ Scanned Barcode: {barcode}")

barcode = st.text_input("Enter Barcode", value=barcode)

# -----------------------------------
# FETCH PRODUCT DATA USING product_api.py
# -----------------------------------

if barcode:

    try:
        product_data = fetch_product_data(barcode)

        if product_data:

            product_name = product_data["name"]
            brand = product_data["brand"]
            ingredients = product_data["ingredients"]
            nutriments = product_data["nutriments"]

            sugar = nutriments.get("sugars_100g")
            protein = nutriments.get("proteins_100g")
            carbs = nutriments.get("carbohydrates_100g")
            salt = nutriments.get("salt_100g")
            fat = nutriments.get("fat_100g")

            st.subheader("📦 Product Information")
            st.write("**Product Name:**", product_name)
            st.write("**Brand:**", brand)

            st.subheader("🧾 Ingredients")

            if ingredients != "Ingredients not available":
                st.write(ingredients)
            else:
                st.warning("⚠ Ingredients not available")

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

                if color == "green":
                    st.success(f"🟢 {status}")
                elif color == "orange":
                    st.warning(f"🟡 {status}")
                else:
                    st.error(f"🔴 {status}")

                st.subheader("🤖 AI Recommendations")

                for tip in result["advice"]:
                    st.write(tip)

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

    except Exception as e:
        st.error(f"❌ Error fetching product data: {e}")

# -----------------------------------
# OCR SECTION
# -----------------------------------

st.subheader("🧠 OCR Nutrition Extraction")

uploaded_file = st.file_uploader(
    "Upload Nutrition Label Image",
    type=["jpg", "jpeg", "png"]
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

    try:
        chart_df = pd.DataFrame({
            "Nutrient": ["Protein", "Carbs", "Sugar", "Fat"],
            "Value": [
                float(nutrition["protein"]),
                float(nutrition["carbs"]),
                float(nutrition["sugar"]),
                float(nutrition["fat"])
            ]
        })

        st.subheader("📊 Nutrition Chart")
        st.bar_chart(chart_df, x="Nutrient", y="Value")

    except:
        st.warning("⚠ Unable to generate chart")

    try:
        sugar = float(nutrition["sugar"])
        protein = float(nutrition["protein"])
        carbs = float(nutrition["carbs"])
        sodium = float(nutrition["sodium"])

        salt = sodium / 1000

        result = analyze_nutrition(sugar, protein, carbs, salt)

        st.subheader("🚦 OCR Health Score")

        score = result["score"]
        status = result["status"]
        color = result["color"]

        st.metric("Health Score", f"{score}/100")

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
        st.warning("⚠ Unable to calculate health score")

st.markdown("---")
st.caption("Made with Streamlit ❤️")