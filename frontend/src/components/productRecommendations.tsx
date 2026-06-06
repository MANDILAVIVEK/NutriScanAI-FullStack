import { useState } from "react";

interface Recommendation {
  category: string;
  recommendation: string;
  reason: string;
}

const ProductRecommendations = () => {
  const [recommendations] = useState<Recommendation[]>([
    {
      category: "Low Sugar",
      recommendation: "Unsweetened Greek Yogurt",
      reason: "Lower sugar and higher protein than flavored yogurt.",
    },
    {
      category: "Healthy Snacks",
      recommendation: "Roasted Chickpeas",
      reason: "High protein and fiber with less saturated fat.",
    },
    {
      category: "Breakfast",
      recommendation: "Oats",
      reason: "Rich in fiber and supports heart health.",
    },
    {
      category: "Drinks",
      recommendation: "Coconut Water",
      reason: "Natural hydration with less added sugar.",
    },
  ]);

  return (
    <div className="container">
      <h1>🧠 Product Recommendations</h1>
      <p>
        Discover healthier alternatives based on nutrition analysis.
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {recommendations.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h3>{item.recommendation}</h3>

            <p>
              <strong>Category:</strong> {item.category}
            </p>

            <p>
              <strong>Why?</strong> {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;