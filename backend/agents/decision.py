def make_final_verdict(analysis: dict, validation: dict) -> dict:
    """
    Decide whether the system recommends automatic action or human review
    based on confidence and validation feedback.
    """

    base_confidence = analysis.get("confidence", 0.0)
    adjusted_confidence = validation.get(
        "adjusted_confidence", base_confidence
    )

    if adjusted_confidence >= 0.75 and validation.get("is_valid", False):
        return {
            "confidence_level": "High",
            "recommended_action": "Auto-Apply Fix",
            "reason": "High confidence and validation passed"
        }

    if 0.5 <= adjusted_confidence < 0.75:
        return {
            "confidence_level": "Medium",
            "recommended_action": "Human Review Recommended",
            "reason": "Moderate confidence or minor reasoning gaps"
        }

    return {
        "confidence_level": "Low",
        "recommended_action": "Human Review Required",
        "reason": "Low confidence or validation flagged issues"
    }
