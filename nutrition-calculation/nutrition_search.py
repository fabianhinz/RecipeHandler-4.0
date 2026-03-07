import marimo

__generated_with = "0.19.11"
app = marimo.App()


@app.cell
def _():
    import re

    import numpy as np
    import pandas as pd
    from nltk.stem.snowball import GermanStemmer
    from rapidfuzz import fuzz, process

    return GermanStemmer, fuzz, np, pd, process, re


@app.cell
def _(pd):
    relevant_columns = {
        "BLS Code": "id",
        "Lebensmittelbezeichnung": "name",
        "ENERCC Energie (Kilokalorien) [kcal/100g]": "kcal",
        "PROT625 Protein (Nx6,25) [g/100g]": "protein",
        "FAT Fett [g/100g]": "fat",
        "CHO Kohlenhydrate, verfügbar [g/100g]": "carbs",
        "FIBT Ballaststoffe, gesamt [g/100g]": "fiber",
        "SUGAR Zucker (Mono- und Disaccharide), gesamt [g/100g]": "sugar",
    }
    nutrition_df = pd.read_excel(
        "nutrition_information.xlsx", usecols=relevant_columns.keys()
    )
    nutrition_df = nutrition_df.rename(columns=relevant_columns)
    return (nutrition_df,)


@app.function
def is_basic_ingredient(row):
    name = str(row["name"]).lower()
    code = str(row["id"])
    if code.startswith(("X", "Y")) or code.startswith("D7"):
        return False
    recipe_blacklist = [
        "plätzchen",
        "keks",
        "kuchen",
        "torte",
        "auflauf",
        "eintopf",
        "suppe",
        "pfanne",
        "menü",
        "fertiggericht",
        "frikadelle",
        "ragout",
        "soße",
        "gefüllt",
        "überbacken",
        "paniert",
        "riegel",
        "konserviert",
        "tiefkühl",
        "küchenfertig",
        "brötchen",
        "brot",
    ]
    if any(word in name for word in recipe_blacklist):
        return False

    return True


@app.function
def split_common_suffixes(text):
    suffixes = ["flock", "mehl", "pulver", "schrot"]
    for s in suffixes:
        text = text.replace(s, f" {s}")
    return " ".join(text.split())


@app.cell
def _(GermanStemmer, re):
    stemmer = GermanStemmer()

    def normalize_text(text, stemming: bool = True):
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = re.sub(r"[,.\-\(\)]", " ", text)
        words = text.split()
        if stemming:
            words = [stemmer.stem(w) for w in words]
        return " ".join(words)

    return (normalize_text,)


@app.cell
def _(normalize_text, nutrition_df, pd):
    nutrition_df_cleaned = nutrition_df[
        nutrition_df.apply(is_basic_ingredient, axis=1)
    ].copy()
    nutrition_df_cleaned["search_index"] = nutrition_df_cleaned["name"].apply(
        normalize_text
    )

    cols_to_fix = [
        col
        for col in nutrition_df_cleaned.columns
        if col not in ["id", "name", "search_index"]
    ]

    for col in cols_to_fix:
        if nutrition_df[col].dtype == "object":
            nutrition_df_cleaned[col] = pd.to_numeric(
                nutrition_df_cleaned[col], errors="coerce"
            )

    nutrition_df_cleaned.fillna(0)
    return (nutrition_df_cleaned,)


@app.cell
def _(nutrition_df_cleaned, pd):
    nutrition_df_cleaned.to_parquet("nutrition_df_cleaned", compression="snappy")
    cleaned_nutrition_df_from_file = pd.read_parquet("nutrition_df_cleaned")
    return (cleaned_nutrition_df_from_file,)


@app.cell
def _(cleaned_nutrition_df_from_file):
    cleaned_nutrition_df_from_file
    return


@app.cell
def _(cleaned_nutrition_df_from_file, fuzz, normalize_text, np, process):
    def find_ingredients(query, threshold=65):
        normalized_query = normalize_text(query)
        splitted_query = split_common_suffixes(normalized_query)
        print(f"used query: {splitted_query}")
        choices = cleaned_nutrition_df_from_file["search_index"].tolist()
        results = process.extract(splitted_query, choices, scorer=fuzz.WRatio, limit=5)
        # result = process.extractOne(splitted_query, choices, scorer=fuzz.WRatio)

        refined_results = []

        for match_str, score, index in results:
            match_words = match_str.lower().replace(",", " ").split()
            final_score = score
            if splitted_query in match_words:
                final_score += 25
            elif any(splitted_query in w for w in match_words):
                final_score -= 10

            refined_results.append((match_str, final_score, index))

        refined_results.sort(key=lambda x: x[1], reverse=True)
        result = refined_results[0]

        if result and result[1] >= threshold:
            match_str, score, index = result
            row = cleaned_nutrition_df_from_file.iloc[index]

        print(type(row["fiber"]))

        return {
            "name": row["name"],
            "kcal": row["kcal"] if not np.isnan(row["kcal"]) else 0.0,
            "protein": row["protein"] if not np.isnan(row["protein"]) else 0.0,
            "fat": row["fat"] if not np.isnan(row["fat"]) else 0.0,
            "carbs": row["carbs"] if not np.isnan(row["carbs"]) else 0.0,
            "fiber": row["fiber"] if not np.isnan(row["fiber"]) else 0.0,
            "score": score,
            "bls_code": row["id"],
        }

    return (find_ingredients,)


@app.cell
def _():
    ingredients = [
        # (100, "Apfel"),
        # (200, "Sojadrink"),
        # (20, "Cashewmuß"),
        # (30, "Mandel"),
        # (60, "Haferflocken"),
        (300, "Mehl Dinkel 630"),
        (200, "Dinkelvollkornmehl"),
        (45, "Margarine"),
        (50, "Zucker"),
        (200, "Sojadrink"),
        (53, "Hühnerei"),
        (75, "Magerquark"),
    ]
    return (ingredients,)


@app.cell
def _(find_ingredients, ingredients):
    total_nutrition = {
        "kcal": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0,
        "fiber": 0,
    }

    for amount, ingredient in ingredients:
        print(f"Finding values for {amount}g of {ingredient}")
        nutrition = find_ingredients(ingredient)
        print(nutrition)
        for key in total_nutrition.keys():
            total_nutrition[key] += nutrition[key] * (amount / 100)
    return (total_nutrition,)


@app.cell
def _(total_nutrition):
    for name, value in total_nutrition.items():
        print(f"{name}: {value * 1}")
    return


@app.cell
def _(nutrition_df_cleaned):
    import json
    import pathlib

    records = (
        nutrition_df_cleaned.rename(columns={"search_index": "searchIndex"})[
            ["id", "name", "kcal", "protein", "fat", "carbs", "fiber", "sugar", "searchIndex"]
        ]
        .fillna(0)
        .to_dict(orient="records")
    )
    out = pathlib.Path("../public/nutrition_data.json")
    out.write_text(json.dumps(records, ensure_ascii=False))
    print(f"Exported {len(records)} entries → {out.resolve()}")
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
