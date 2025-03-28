from flask import Flask, request, render_template
import os
import pandas as pd
from bs4 import BeautifulSoup

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"txt", "html", "xml"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

FILTER_KEYWORDS = ["OVA", "Movie", "Special", "ONA", "Recap"]

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


import re

FILTER_KEYWORDS = ["OVA", "Movie", "Special", "ONA", "Recap", "Season", "Part"]

def clean_title(title):
    """ Remove subtitles and extra words but keep full anime name. """
    title = re.split(r"[:\-|]", title)[0].strip()  # Keep only main title before ":" or "-"
    title = re.sub(r"https?.*", "", title).strip()  # Remove URLs
    return title

def process_file(filepath, filetype):
    anime_list = []
    
    if filetype == "txt":
        with open(filepath, "r", encoding="utf-8") as file:
            anime_list = file.read().splitlines()
    
    elif filetype in {"html", "xml"}:
        with open(filepath, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "lxml")
            anime_list = [tag.text.strip() for tag in soup.find_all("anime")]

    # Remove duplicates & filter unwanted types
    seen_titles = set()
    filtered_list = []

    for anime in anime_list:
        if any(kw in anime for kw in FILTER_KEYWORDS):
            continue  # Skip OVAs, Movies, Specials, and other extras

        main_title = clean_title(anime)  # Standardize title

        if main_title not in seen_titles:
            seen_titles.add(main_title)
            filtered_list.append(main_title)

    # Return a properly numbered list
    return [f"{i+1}. {title}" for i, title in enumerate(sorted(filtered_list))]

@app.route("/", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            return "No file part"
        
        file = request.files["file"]
        if file.filename == "" or not allowed_file(file.filename):
            return "Invalid file type"

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)
        
        filetype = file.filename.rsplit(".", 1)[1].lower()
        result = process_file(filepath, filetype)

        return render_template("result.html", result=result)

    return render_template("index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Port dynamically set karein
    app.run(host="0.0.0.0", port=port)  # Render ke liye external bind zaroori hai

