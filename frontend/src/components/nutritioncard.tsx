type Props = {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
};

function NutritionCard({ label, value, unit = "", icon = "🥗" }: Props) {
  const finalValue =
    value && value !== "Not Found" ? `${value}${unit}` : "N/A";

  return (
    <div className="nutrition-card">
      <span className="nutrition-icon">{icon}</span>
      <p>{label}</p>
      <h3>{finalValue}</h3>
    </div>
  );
}

export default NutritionCard;