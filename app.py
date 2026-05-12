import streamlit as st
import requests
from analyzer import analyze_nutrition

st.set_page_config(page_title="NutriScanAI", page_icon="🥗")

st.title("🥗 NutriScanAI")

barcode = st.text_input("Enter Barcode")

if barcode:

    st.success(f"Scanned Barcode: {barcode}")

    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"

    headers = {
        "User-Agent": "NutriScanAI/1.0"
    }

    response = requests.get(url, headers=headers)

    data = response.json()

    if data["status"] == 1:

        product = data["product"]

        product_name = product.get("product_name", "N/A")
        brand = product.get("brands", "N/A")

        nutriments = product.get("nutriments", {})

        sugar = nutriments.get("sugars_100g")
        protein = nutriments.get("proteins_100g")
        carbs = nutriments.get("carbohydrates_100g")
        salt = nutriments.get("salt_100g")

        st.subheader("📦 Product Information")

        st.write("**Product Name:**", product_name)
        st.write("**Brand:**", brand)

        st.subheader("🥗 Nutrition Data")

        st.write("**Sugar:**", sugar if sugar is not None else "Data Missing")
        st.write("**Protein:**", protein if protein is not None else "Data Missing")
        st.write("**Carbohydrates:**", carbs if carbs is not None else "Data Missing")
        st.write("**Salt:**", salt if salt is not None else "Data Missing")

        result = analyze_nutrition(sugar, protein, carbs, salt)

        st.subheader("🧠 Health Analysis")

        st.info(result)

        if None in [sugar, protein, carbs, salt]:
            st.warning("Nutrition data incomplete")

    else:
        st.error("Product not found")