import marimo

__generated_with = "0.19.1"
app = marimo.App()


@app.cell
def _():
    import pandas as pd
    import re
    from rapidfuzz import process, fuzz, utils
    from nltk.stem.snowball import GermanStemmer
    return GermanStemmer, fuzz, pd, process, re


@app.cell
def _(pd):
    relevant_columns = {
            'BLS Code': 'id',
            'Lebensmittelbezeichnung': 'name',
            'ENERCC Energie (Kilokalorien) [kcal/100g]': 'kcal',
            'PROT625 Protein (Nx6,25) [g/100g]': 'protein',
            'FAT Fett [g/100g]': 'fat',
            'CHO Kohlenhydrate, verfügbar [g/100g]': 'carbs',
            'FIBT Ballaststoffe, gesamt [g/100g]': 'fiber'
        }
    nutrition_df = pd.read_excel("nutrition_information.xlsx", usecols=relevant_columns.keys())
    nutrition_df = nutrition_df.rename(columns=relevant_columns)
    return (nutrition_df,)


@app.function
def is_basic_ingredient(row):
  name = str(row['name']).lower()
  code = str(row['id'])
  if code.startswith(('X', 'Y')) or code.startswith('D7'):
        return False
  recipe_blacklist = [
        "plätzchen", "keks", "kuchen", "torte", "auflauf", 
        "eintopf", "suppe", "pfanne", "menü", 
        "fertiggericht", "frikadelle", "ragout", "soße", 
        "gefüllt", "überbacken", "paniert", "riegel", 
        "konserviert", "tiefkühl", "küchenfertig", "brötchen", "brot",
    ]
  if any(word in name for word in recipe_blacklist):
        return False
  
  return True


@app.function
def split_common_suffixes(text):
    suffixes = ["flocken", "mehl", "pulver", "schrot"]
    for s in suffixes:
        text = text.replace(s, f" {s}")
    return " ".join(text.split())


@app.cell
def _(GermanStemmer, re):
    stemmer = GermanStemmer()
    def normalize_text(text, stemming: bool = False):
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
    nutrition_df_cleaned = nutrition_df[nutrition_df.apply(is_basic_ingredient, axis=1)].copy()
    nutrition_df_cleaned["search_index"] = nutrition_df_cleaned["name"].apply(normalize_text)

    cols_to_fix = [col for col in nutrition_df_cleaned.columns if col not in ['id', 'name', 'search_index']]

    for col in cols_to_fix:
      if nutrition_df[col].dtype == "object":
        nutrition_df_cleaned[col] = pd.to_numeric(nutrition_df_cleaned[col], errors="coerce")

    nutrition_df_cleaned.fillna(0)
    return (nutrition_df_cleaned,)


@app.cell
def _(nutrition_df_cleaned):
    nutrition_df_cleaned.to_parquet("nutrition_df_cleaned", compression="snappy")
    return


@app.cell
def _(nutrition_df_cleaned):
    nutrition_df_cleaned
    return


@app.cell
def _(fuzz, normalize_text, nutrition_df_cleaned, process):
    def find_ingredients(query, threshold=65):
      normalized_query = normalize_text(query)
      splitted_query = split_common_suffixes(normalized_query)
      print(splitted_query)
      choices = nutrition_df_cleaned["search_index"].tolist()
      result = process.extractOne(splitted_query, choices, scorer=fuzz.WRatio)

      if result and result[1] >= threshold:
        match_str, score, index = result
        row = nutrition_df_cleaned.iloc[index]
  
      return {
                "name": row['name'],
                "kcal": row['kcal'],
                "protein": row['protein'],
                "fat": row['fat'],
                "carbs": row['carbs'],
                "fiber": row['fiber'],
                "score": score,
                "bls_code": row['id']
    }
    return (find_ingredients,)


@app.cell
def _(find_ingredients):
    find_ingredients("Apfel")
    return


if __name__ == "__main__":
    app.run()
