def analyze_nutrition(sugar, protein, carbs, salt):

    # High Sugar
    if sugar > 15:
        return "High Sugar ⚠"

    # High Protein
    elif protein > 10:
        return "High Protein ✅"

    # High Salt
    elif salt > 1.5:
        return "High Salt ⚠"

    # High Carbs
    elif carbs > 60:
        return "High Carbohydrates ⚠"

    # Balanced Food
    else:
        return "Moderate Nutrition ℹ"