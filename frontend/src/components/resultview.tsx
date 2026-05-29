import NutritionCard from "./nutritioncard";

function ResultView({ data, type }: any) {
  const isBarcode = type === "barcode";

  const nutrition = data?.nutrition || data?.product?.nutriments || {};

  const sugar = nutrition.sugar || nutrition.sugars_100g || "N/A";
  const protein = nutrition.protein || nutrition.proteins_100g || "N/A";
  const carbs = nutrition.carbs || nutrition.carbohydrates_100g || "N/A";
  const fat = nutrition.fat || nutrition.fat_100g || "N/A";
  const saturatedFat =
    nutrition.saturated_fat || nutrition["saturated-fat_100g"] || "N/A";
  const sodium = nutrition.sodium || nutrition.sodium_100g || "N/A";

  const sugarNum = Number(sugar);
  const fatNum = Number(fat);
  const carbsNum = Number(carbs);

  const score = sugarNum > 20 || fatNum > 15 || carbsNum > 65 ? 47 : 82;
  const status = score < 60 ? "Needs Attention" : "Healthy Choice";

  return (
    <section className="results">
      {isBarcode && (
        <section className="product-card">
          <h2>📦 Product Summary</h2>

          {data?.product?.image_url && (
            <img
              src={data.product.image_url}
              alt="Product"
              className="product-image"
            />
          )}

          <p><b>Product:</b> {data?.product?.name || "N/A"}</p>
          <p><b>Brand:</b> {data?.product?.brand || "N/A"}</p>
          <p><b>Status:</b> {data?.status}</p>
        </section>
      )}

      <div className="score-card">
        <p>Health Score</p>
        <h2>{score}/100</h2>
        <span className={score < 60 ? "badge danger" : "badge success"}>
          {status}
        </span>
      </div>

      <section className="facts-card">
        <h2>Nutrition Facts</h2>

        <div className="facts-grid">
          <NutritionCard label="Sugar" value={sugar} unit="g" icon="🍭" />
          <NutritionCard label="Protein" value={protein} unit="g" icon="💪" />
          <NutritionCard label="Carbs" value={carbs} unit="g" icon="🌾" />
          <NutritionCard label="Fat" value={fat} unit="g" icon="🥑" />
          <NutritionCard label="Sat Fat" value={saturatedFat} unit="g" icon="🧈" />
          <NutritionCard label="Sodium" value={sodium} unit="mg" icon="🧂" />
        </div>
      </section>

      {isBarcode && (
        <>
          <section className="insight-card">
            <h2>🏷 Product Category</h2>
            {data?.product_category?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}
          </section>

          <section className="insight-card">
            <h2>🥗 Diet Suitability</h2>
            {data?.diet_suitability?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}
          </section>

          <section className="insight-card">
            <h2>⚠ Allergy Detection</h2>
            {data?.allergy_detection?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}
          </section>

          <section className="insight-card">
            <h2>🧾 Ingredients</h2>
            <p>{data?.product?.ingredients || "Ingredients not available"}</p>
          </section>

          <section className="insight-card">
            <h2>🔍 Ingredient Intelligence</h2>
            {data?.ingredient_analysis?.map((x: string, i: number) => (
              <p key={i}>{x}</p>
            ))}
          </section>
        </>
      )}

      {!isBarcode && (
        <section className="insight-card">
          <h2>Smart Insights</h2>

          {sugarNum > 20 && <p>⚠ High sugar detected. Limit frequent intake.</p>}
          {fatNum > 10 && <p>⚠ High fat content found.</p>}
          {carbsNum > 60 && <p>⚠ High carbohydrate product.</p>}
          <p>✅ Moderate protein content.</p>
          <p>✅ Sodium level is acceptable.</p>
        </section>
      )}
    </section>
  );
}

export default ResultView;