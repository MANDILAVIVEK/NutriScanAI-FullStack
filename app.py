import streamlit as st
import requests

from analyzer import analyze_nutrition
from scanner import scan_barcode
from ocr_reader import extract_text
from ocr_parser import extract_nutrition_values

# -----------------------------------
# PAGE CONFIG
# -----------------------------------

st.set_page_config(
    page_title="NutriScanAI",
    page_icon="🥗"
)

st.title("🥗 NutriScanAI")

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

barcode = st.text_input(
    "Enter Barcode",
    value=barcode
)

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

        # Product info
        product_name = product.get("product_name", "N/A")
        brand = product.get("brands", "N/A")

        # Nutrition info
        nutriments = product.get("nutriments", {})

        sugar = nutriments.get("sugars_100g")
        protein = nutriments.get("proteins_100g")
        carbs = nutriments.get("carbohydrates_100g")
        salt = nutriments.get("salt_100g")

        # -----------------------------------
        # PRODUCT DISPLAY
        # -----------------------------------

        st.subheader("📦 Product Information")

        st.write("**Product Name:**", product_name)
        st.write("**Brand:**", brand)

        # -----------------------------------
        # NUTRITION DISPLAY
        # -----------------------------------

        st.subheader("🥗 Nutrition Data")

        st.write("**Sugar:**", sugar if sugar is not None else "Data Missing")
        st.write("**Protein:**", protein if protein is not None else "Data Missing")
        st.write("**Carbohydrates:**", carbs if carbs is not None else "Data Missing")
        st.write("**Salt:**", salt if salt is not None else "Data Missing")

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

            st.subheader("🧠 Health Analysis")

            st.info(result)

        else:

            st.warning("⚠ Some nutrition data is missing")

    else:
        st.error("❌ Product not found")

# -----------------------------------
# OCR SECTION (ALWAYS AVAILABLE)
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
    # OCR TEXT EXTRACTION
    # -----------------------------------

    text = extract_text("uploaded_label.jpg")

    st.subheader("📄 OCR Extracted Text")

    st.text(text)

    # -----------------------------------
    # OCR NUTRITION PARSING
    # -----------------------------------

    nutrition = extract_nutrition_values(text)

    st.subheader("🧪 Extracted Nutrition Values")

    st.write(nutrition)