def analyze_nutrition(sugar, protein, carbs, salt):

    try:

        sugar = float(sugar)
        protein = float(protein)
        carbs = float(carbs)
        salt = float(salt)

    except:

        return {
            "score": 0,
            "status": "Unknown",
            "color": "gray",
            "advice": ["Unable to analyze nutrition"]
        }

    score = 100

    advice = []

    # Sugar check
    if sugar > 20:

        score -= 25

        advice.append(
            "⚠ High sugar detected"
        )

    else:

        advice.append(
            "✅ Sugar level is acceptable"
        )

    # Salt check
    if salt > 1.5:

        score -= 25

        advice.append(
            "⚠ High salt intake"
        )

    else:

        advice.append(
            "✅ Salt level is moderate"
        )

    # Carbs check
    if carbs > 70:

        score -= 15

        advice.append(
            "⚠ High carbohydrate content"
        )

    else:

        advice.append(
            "✅ Balanced carbohydrates"
        )

    # Protein bonus
    if protein > 10:

        score += 10

        advice.append(
            "💪 Good protein content"
        )

    else:

        advice.append(
            "⚠ Low protein content"
        )

    # Final status
    if score >= 80:

        status = "Healthy"
        color = "green"

    elif score >= 50:

        status = "Moderate"
        color = "orange"

    else:

        status = "Unhealthy"
        color = "red"

    return {
        "score": score,
        "status": status,
        "color": color,
        "advice": advice
    }