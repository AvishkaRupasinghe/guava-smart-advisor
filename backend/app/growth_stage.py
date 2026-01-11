from datetime import datetime

def calculate_age_in_months(plantation_date: str) -> int:
    """
    plantation_date: YYYY-MM-DD
    """
    plantation_date = datetime.strptime(plantation_date, "%Y-%m-%d")
    current_date = datetime.now()

    if plantation_date > current_date:
        raise ValueError("Plantation date cannot be in the future")

    age_days = (current_date - plantation_date).days
    return age_days // 30


def estimate_growth_stage(variety: str, age_months: int) -> str:
    variety = variety.lower()

    if variety == "natural":
        if age_months <= 3:
            return "Seedling"
        elif age_months <= 8:
            return "Vegetative"
        elif age_months <= 12:
            return "Flowering"
        else:
            return "Fruiting"

    elif variety == "hybrid":
        if age_months <= 2:
            return "Seedling"
        elif age_months <= 6:
            return "Vegetative"
        elif age_months <= 9:
            return "Flowering"
        else:
            return "Fruiting"

    else:
        raise ValueError("Variety must be 'Natural' or 'Hybrid'")

if __name__ == "__main__":
    age = calculate_age_in_months("2025-02-15")
    stage = estimate_growth_stage("Hybrid", age)
    print(age, stage)
