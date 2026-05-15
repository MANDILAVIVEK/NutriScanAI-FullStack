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
# BARCODE SCANNER
# -----------------------------------

barcode = ""

if st.button("📷 Scan Barcode"):

    scanned_barcode = scan_barcode()

    if scanned_barcode:

        barcode = scanned_barcode

        st.success(f"Detected Barcode: {barcode}")

# -----------------------------------
# MANUAL BARCODE INPUT
# -----------------------------------

barcode = st.text_input("Enter Barcode")

# -----------------------------------
# FETCH PRODUCT DATA
# -----------------------------------

if barcode:

    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"

    headers = {
        "User-Agent": "NutriScanAI/1.0"
    }

    response = requests.get(url, headers=headers)

    data = response.json()

    # -----------------------------------
    # PRODUCT FOUND
    # -----------------------------------

    if data["status"] == 1:

        product = data["product"]

        # Product details
        product_name = product.get("product_name", "N/A")
        brand = product.get("brands", "N/A")

        # Nutrition values
        nutriments = product.get("nutriments", {})

        sugar = nutriments.get("sugars_100g")
        protein = nutriments.get("proteins_100g")
        carbs = nutriments.get("carbohydrates_100g")
        salt = nutriments.get("salt_100g")

        # -----------------------------------
        # PRODUCT INFORMATION
        # -----------------------------------

        st.subheader("📦 Product Information")

        st.write("**Product Name:**", product_name)
        st.write("**Brand:**", brand)

        # -----------------------------------
        # NUTRITION DATA
        # -----------------------------------

        st.subheader("🥗 Nutrition Data")

        st.write(
            "**Sugar:**",
            sugar if sugar is not None else "Data Missing"
        )

        st.write(
            "**Protein:**",
            protein if protein is not None else "Data Missing"
        )

        st.write(
            "**Carbohydrates:**",
            carbs if carbs is not None else "Data Missing"
        )

        st.write(
            "**Salt:**",
            salt if salt is not None else "Data Missing"
        )

        # -----------------------------------
        # HEALTH ANALYSIS
        # -----------------------------------

        if None not in [sugar, protein, carbs, salt]:

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

                st.success(f"🟢 {status}")

            elif color == "orange":

                st.warning(f"🟡 {status}")

            else:

                st.error(f"🔴 {status}")

            # -----------------------------------
            # AI RECOMMENDATIONS
            # -----------------------------------

            st.subheader("🤖 AI Recommendations")

            for tip in result["advice"]:

                st.write(tip)

        else:

            st.warning("⚠ Some nutrition data is missing")

    else:

        st.error("❌ Product not found")

# -----------------------------------
# OCR SECTION
# -----------------------------------

st.subheader("🧠 OCR Nutrition Extraction")

uploaded_file = st.file_uploader(
    "Upload Nutrition Label Image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:

    # Save uploaded image
    with open("uploaded_label.jpg", "wb") as f:

        f.write(uploaded_file.getbuffer())

    st.success("✅ Image uploaded successfully")

    # -----------------------------------
    # OCR EXTRACTION
    # -----------------------------------

    text = extract_text("uploaded_label.jpg")

    st.subheader("📄 OCR Extracted Text")

    st.text(text)

    # -----------------------------------
    # OCR PARSING
    # -----------------------------------

    nutrition = extract_nutrition_values(text)

    st.subheader("🧪 Extracted Nutrition Values")

    st.write(nutrition)

    # -----------------------------------
    # NUTRITION CHART
    # -----------------------------------

    try:

        protein_value = float(nutrition["protein"])
        carbs_value = float(nutrition["carbs"])
        sugar_value = float(nutrition["sugar"])
        fat_value = float(nutrition["fat"])

        chart_df = pd.DataFrame({

            "Nutrient": [
                "Protein",
                "Carbs",
                "Sugar",
                "Fat"
            ],

            "Value": [
                protein_value,
                carbs_value,
                sugar_value,
                fat_value
            ]
        })

        st.subheader("📊 Nutrition Chart")

        st.bar_chart(
            chart_df.set_index("Nutrient")
        )

    except Exception as e:

        st.warning(
            f"⚠ Unable to generate chart: {e}"
        )

    # -----------------------------------
    # OCR HEALTH ANALYSIS
    # -----------------------------------

    try:

        sugar = float(nutrition["sugar"])
        protein = float(nutrition["protein"])
        carbs = float(nutrition["carbs"])

        # Sodium mg -> approximate salt
        salt = float(nutrition["sodium"]) / 1000

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

            st.success(f"🟢 {status}")

        elif color == "orange":

            st.warning(f"🟡 {status}")

        else:

            st.error(f"🔴 {status}")

        # -----------------------------------
        # AI RECOMMENDATIONS
        # -----------------------------------

        st.subheader("🤖 AI Recommendations")

        for tip in result["advice"]:

            st.write(tip)

    except Exception as e:

        st.warning(
            f"⚠ Unable to calculate health score: {e}"
        )