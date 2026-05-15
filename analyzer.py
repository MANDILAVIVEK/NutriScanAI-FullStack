def analyze_nutrition(sugar, protein, carbs, salt):

    score = 100

    advice = []

    # -----------------------------------
    # SUGAR
    # -----------------------------------

    if sugar > 20:

        score -= 20

        advice.append(
            "⚠ High sugar detected"
        )

    else:

        advice.append(
            "✅ Sugar level is acceptable"
        )

    # -----------------------------------
    # SALT
    # -----------------------------------

    if salt > 1.5:

        score -= 15

        advice.append(
            "⚠ High salt content"
        )

    else:

        advice.append(
            "✅ Salt level is moderate"
        )

    # -----------------------------------
    # CARBS
    # -----------------------------------

    if carbs > 60:

        score -= 10

        advice.append(
            "⚠ High carbohydrate content"
        )

    else:

        advice.append(
            "✅ Carbohydrate level is balanced"
        )

    # -----------------------------------
    # PROTEIN
    # -----------------------------------

    if protein < 8:

        score -= 10

        advice.append(
            "⚠ Low protein content"
        )

    else:

        advice.append(
            "✅ Good protein source"
        )

    # -----------------------------------
    # SCORE LIMIT
    # -----------------------------------

    if score < 0:

        score = 0

    # -----------------------------------
    # STATUS
    # -----------------------------------

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

        "advice": advice
    }