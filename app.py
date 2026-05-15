import streamlit as st
import requests
import pandas as pd

from analyzer import analyze_nutrition
from scanner import scan_barcode
from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values

# -----------------------------------
# PAGE CONFIG
# -----------------------------------

st.set_page_config(
    page_title="NutriScanAI",
    page_icon="🥗",
    layout="centered"
)

# -----------------------------------
# TITLE
# -----------------------------------

st.title("🥗 NutriScanAI")
st.write("AI-powered nutrition analysis using Barcode + OCR")

# -----------------------------------
# BARCODE PRODUCT SCANNER
# -----------------------------------

st.subheader("📦 Barcode Product Scanner")

barcode = ""

# -----------------------------------
# CAMERA BARCODE SCANNER
# -----------------------------------

if st.button("📷 Start Barcode Scanner"):

    scanned_barcode = scan_barcode()

    if scanned_barcode:

        barcode = scanned_barcode

        st.success(
            f"✅ Scanned Barcode: {barcode}"
        )

# -----------------------------------
# MANUAL BARCODE INPUT
# -----------------------------------

barcode = st.text_input(
    "Enter Barcode"
)

# -----------------------------------
# FETCH PRODUCT DATA
# -----------------------------------

if barcode:

    try:

        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"

        headers = {
            "User-Agent": "NutriScanAI/1.0"
        }

        response = requests.get(
            url,
            headers=headers
        )

        data = response.json()

        # -----------------------------------
        # PRODUCT FOUND
        # -----------------------------------

        if data["status"] == 1:

            product = data["product"]

            # -----------------------------------
            # PRODUCT DETAILS
            # -----------------------------------

            product_name = product.get(
                "product_name",
                "N/A"
            )

            brand = product.get(
                "brands",
                "N/A"
            )

            ingredients = product.get(
                "ingredients_text",
                "N/A"
            )

            nutriments = product.get(
                "nutriments",
                {}
            )

            sugar = nutriments.get(
                "sugars_100g"
            )

            protein = nutriments.get(
                "proteins_100g"
            )

            carbs = nutriments.get(
                "carbohydrates_100g"
            )

            salt = nutriments.get(
                "salt_100g"
            )

            fat = nutriments.get(
                "fat_100g"
            )

            # -----------------------------------
            # PRODUCT INFORMATION
            # -----------------------------------

            st.subheader("📦 Product Information")

            st.write(
                "**Product Name:**",
                product_name
            )

            st.write(
                "**Brand:**",
                brand
            )

            # -----------------------------------
            # INGREDIENTS
            # -----------------------------------

            st.subheader("🧾 Ingredients")

            if ingredients != "N/A":

                st.write(ingredients)

            else:

                st.warning(
                    "⚠ Ingredients not available"
                )

            # -----------------------------------
            # NUTRITION TABLE
            # -----------------------------------

            st.subheader("🥗 Nutrition Data")

            nutrition_df = pd.DataFrame({

                "Nutrient": [
                    "Sugar",
                    "Protein",
                    "Carbs",
                    "Fat",
                    "Salt"
                ],

                "Value": [

                    sugar if sugar is not None else 0,

                    protein if protein is not None else 0,

                    carbs if carbs is not None else 0,

                    fat if fat is not None else 0,

                    salt if salt is not None else 0
                ]
            })

            st.dataframe(
                nutrition_df,
                use_container_width=True
            )

            # -----------------------------------
            # NUTRITION CHART
            # -----------------------------------

            st.subheader("📊 Nutrition Chart")

            st.bar_chart(
                nutrition_df,
                x="Nutrient",
                y="Value"
            )

            # -----------------------------------
            # CHECK IF DATA EXISTS
            # -----------------------------------

            if None in [sugar, protein, carbs, salt]:

                st.warning(
                    "⚠ Nutrition information is missing for this product."
                )

                st.info(
                    "📸 Please upload the product nutrition label image below for OCR analysis."
                )

            else:

                # -----------------------------------
                # HEALTH ANALYSIS
                # -----------------------------------

                result = analyze_nutrition(
                    sugar,
                    protein,
                    carbs,
                    salt
                )

                st.subheader("🚦 Health Score")

                score = result["score"]
                status = result["status"]
                color = result["color"]

                st.metric(
                    label="Health Score",
                    value=f"{score}/100"
                )

                if color == "green":

                    st.success(
                        f"🟢 {status}"
                    )

                elif color == "orange":

                    st.warning(
                        f"🟡 {status}"
                    )

                else:

                    st.error(
                        f"🔴 {status}"
                    )

                # -----------------------------------
                # AI RECOMMENDATIONS
                # -----------------------------------

                st.subheader("🤖 AI Recommendations")

                for tip in result["advice"]:

                    st.write(tip)

                # -----------------------------------
                # DIET SUITABILITY
                # -----------------------------------

                st.subheader("🥗 Diet Suitability")

                if sugar < 5 and fat < 10:

                    st.success(
                        "✅ Suitable for Weight Loss Diet"
                    )

                else:

                    st.warning(
                        "⚠ Not ideal for Weight Loss"
                    )

                if protein > 10:

                    st.success(
                        "💪 Good for Muscle Building"
                    )

                else:

                    st.warning(
                        "⚠ Low protein for fitness goals"
                    )

                # -----------------------------------
                # ALLERGY DETECTION
                # -----------------------------------

                st.subheader("⚠ Allergy Detection")

                allergy_keywords = [

                    "milk",
                    "soy",
                    "peanut",
                    "nuts",
                    "gluten",
                    "wheat"
                ]

                found_allergies = []

                ingredients_lower = ingredients.lower()

                for item in allergy_keywords:

                    if item in ingredients_lower:

                        found_allergies.append(item)

                if found_allergies:

                    st.error(
                        "Contains: " +
                        ", ".join(found_allergies)
                    )

                else:

                    st.success(
                        "✅ No common allergens detected"
                    )

        else:

            st.error(
                "❌ Product not found"
            )

    except:

        st.error(
            "❌ Error fetching product data"
        )

# -----------------------------------
# OCR SECTION
# -----------------------------------

st.subheader("🧠 OCR Nutrition Extraction")

uploaded_file = st.file_uploader(
    "Upload Nutrition Label Image",
    type=["jpg", "jpeg", "png"]
)

# -----------------------------------
# OCR PROCESSING
# -----------------------------------

if uploaded_file is not None:

    with open(
        "uploaded_label.jpg",
        "wb"
    ) as f:

        f.write(
            uploaded_file.getbuffer()
        )

    st.success(
        "✅ Image uploaded successfully"
    )

    # -----------------------------------
    # OCR TEXT EXTRACTION
    # -----------------------------------

    text = extract_text(
        "uploaded_label.jpg"
    )

    st.subheader("📄 OCR Extracted Text")

    st.text(text)

    # -----------------------------------
    # PARSE NUTRITION VALUES
    # -----------------------------------

    nutrition = extract_nutrition_values(text)

    st.subheader("🧪 Extracted Nutrition Values")

    st.write(nutrition)

    # -----------------------------------
    # CHART
    # -----------------------------------

    try:

        chart_df = pd.DataFrame({

            "Nutrient": [
                "Protein",
                "Carbs",
                "Sugar",
                "Fat"
            ],

            "Value": [

                float(nutrition["protein"]),
                float(nutrition["carbs"]),
                float(nutrition["sugar"]),
                float(nutrition["fat"])
            ]
        })

        st.subheader("📊 Nutrition Chart")

        st.bar_chart(
            chart_df,
            x="Nutrient",
            y="Value"
        )

    except:

        st.warning(
            "⚠ Unable to generate chart"
        )

    # -----------------------------------
    # OCR HEALTH ANALYSIS
    # -----------------------------------

    try:

        sugar = float(
            nutrition["sugar"]
        )

        protein = float(
            nutrition["protein"]
        )

        carbs = float(
            nutrition["carbs"]
        )

        sodium = float(
            nutrition["sodium"]
        )

        salt = sodium / 1000

        result = analyze_nutrition(
            sugar,
            protein,
            carbs,
            salt
        )

        st.subheader("🚦 OCR Health Score")

        score = result["score"]
        status = result["status"]
        color = result["color"]

        st.metric(
            label="Health Score",
            value=f"{score}/100"
        )

        if color == "green":

            st.success(
                f"🟢 {status}"
            )

        elif color == "orange":

            st.warning(
                f"🟡 {status}"
            )

        else:

            st.error(
                f"🔴 {status}"
            )

        # -----------------------------------
        # AI RECOMMENDATIONS
        # -----------------------------------

        st.subheader("🤖 AI Recommendations")

        for tip in result["advice"]:

            st.write(tip)

    except:

        st.warning(
            "⚠ Unable to calculate health score"
        )

# -----------------------------------
# FOOTER
# -----------------------------------

st.markdown("---")
st.caption("Made with Streamlit ❤️")