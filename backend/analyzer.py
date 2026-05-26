def analyze_nutrition(sugar, protein, carbs, salt, fat=0):
    try:
        sugar = float(sugar)
        protein = float(protein)
        carbs = float(carbs)
        salt = float(salt)
        fat = float(fat)

    except:
        return {
            "score": 0,
            "status": "Unknown",
            "color": "gray",
            "advice": ["⚠ Unable to analyze nutrition values"],
        }

    score = 100
    advice = []

    if sugar > 15:
        score -= 25
        advice.append("⚠ High sugar detected")
    elif sugar > 8:
        score -= 10
        advice.append("⚠ Moderate sugar level")
    else:
        advice.append("✅ Sugar level is acceptable")

    if salt > 1:
        score -= 20
        advice.append("⚠ High salt/sodium content")
    elif salt > 0.5:
        score -= 10
        advice.append("⚠ Moderate salt level")
    else:
        advice.append("✅ Salt level is moderate")

    if carbs > 70:
        score -= 15
        advice.append("⚠ High carbohydrate content")
    elif carbs > 50:
        score -= 8
        advice.append("⚠ Moderate carbohydrate content")
    else:
        advice.append("✅ Carbohydrate level is balanced")

    if fat > 20:
        score -= 20
        advice.append("⚠ High fat content")
    elif fat > 10:
        score -= 10
        advice.append("⚠ Moderate fat content")
    else:
        advice.append("✅ Fat level is acceptable")

    if protein >= 10:
        score += 5
        advice.append("✅ Good protein source")
    elif protein >= 5:
        advice.append("✅ Moderate protein content")
    else:
        score -= 10
        advice.append("⚠ Low protein content")

    score = max(0, min(score, 100))

    if score >= 80:
        status = "Healthy"
        color = "green"
    elif score >= 60:
        status = "Moderate"
        color = "orange"
    else:
        status = "Unhealthy"
        color = "red"

    return {
        "score": score,
        "status": status,
        "color": color,
        "advice": advice,
    }