import streamlit as st
import requests
import pandas as pd
import platform

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

st.write(
    "AI-powered nutrition analysis using Barcode + OCR"
)

# -----------------------------------
# BARCODE VARIABLE
# -----------------------------------

barcode = ""

# -----------------------------------
# BARCODE SCANNER
# -----------------------------------

if platform.system() == "Windows":

    if st.button("📷 Scan Barcode"):

        scanned_barcode = scan_barcode()

        if scanned_barcode:

            barcode = scanned_barcode

            st.success(
                f"Detected Barcode: {barcode}"
            )

# -----------------------------------
# MANUAL BARCODE INPUT
# -----------------------------------

barcode = st.text_input("Enter Barcode")

# -----------------------------------
# FETCH PRODUCT DATA
# -----------------------------------

if barcode:

    url = (
        f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    )

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

        # Product details

        product_name = product.get(
            "product_name",
            "N/A"
        )

        brand = product.get(
            "brands",
            "N/A"
        )

        # Nutrition values

        nutriments = product.get(
            "nutriments",
            {}
        )

        sugar = nutriments.get("sugars_100g")

        protein = nutriments.get("proteins_100g")

        carbs = nutriments.get(
            "carbohydrates_100g"
        )

        salt = nutriments.get("salt_100g")

        # -----------------------------------
        # PRODUCT INFO
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
        # NUTRITION DATA
        # -----------------------------------

        st.subheader("🥗 Nutrition Data")

        st.write(
            "**Sugar:**",
            sugar if sugar is not None
            else "Data Missing"
        )

        st.write(
            "**Protein:**",
            protein if protein is not None
            else "Data Missing"
        )

        st.write(
            "**Carbohydrates:**",
            carbs if carbs is not None
            else "Data Missing"
        )

        st.write(
            "**Salt:**",
            salt if salt is not None
            else "Data Missing"
        )

        # -----------------------------------
        # HEALTH ANALYSIS
        # -----------------------------------

        if None not in [
            sugar,
            protein,
            carbs,
            salt
        ]:

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

            # -----------------------------------
            # GRADE SYSTEM
            # -----------------------------------

            if score >= 90:

                grade = "A"

            elif score >= 75:

                grade = "B"

            elif score >= 60:

                grade = "C"

            elif score >= 40:

                grade = "D"

            else:

                grade = "E"

            st.write(f"🏆 Grade: {grade}")

            # -----------------------------------
            # STATUS COLOR
            # -----------------------------------

            if color == "green":

                st.success(f"🟢 {status}")

            elif color == "orange":

                st.warning(f"🟡 {status}")

            else:

                st.error(f"🔴 {status}")

        else:

            st.warning(
                "⚠ Some nutrition data is missing"
            )

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

# -----------------------------------
# OCR PROCESSING
# -----------------------------------

if uploaded_file is not None:

    # Save uploaded image

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
    # PARSE NUTRITION
    # -----------------------------------

    nutrition = extract_nutrition_values(
        text
    )

    st.subheader(
        "🧪 Extracted Nutrition Values"
    )

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

                float(
                    nutrition["protein"]
                ),

                float(
                    nutrition["carbs"]
                ),

                float(
                    nutrition["sugar"]
                ),

                float(
                    nutrition["fat"]
                )

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

        st.subheader(
            "🚦 OCR Health Score"
        )

        score = result["score"]

        status = result["status"]

        color = result["color"]

        st.metric(
            label="Health Score",
            value=f"{score}/100"
        )

        # -----------------------------------
        # GRADE
        # -----------------------------------

        if score >= 90:

            grade = "A"

        elif score >= 75:

            grade = "B"

        elif score >= 60:

            grade = "C"

        elif score >= 40:

            grade = "D"

        else:

            grade = "E"

        st.write(f"🏆 Grade: {grade}")

        # -----------------------------------
        # AI RECOMMENDATIONS
        # -----------------------------------

        st.subheader(
            "🤖 AI Recommendations"
        )

        for tip in result["advice"]:

            st.write(tip)

        # -----------------------------------
        # HEALTH STATUS
        # -----------------------------------

        if color == "green":

            st.success(f"🟢 {status}")

        elif color == "orange":

            st.warning(f"🟡 {status}")

        else:

            st.error(f"🔴 {status}")

    except:

        st.warning(
            "⚠ Unable to calculate health score"
        )