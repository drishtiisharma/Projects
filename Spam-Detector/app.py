from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    result = ""
    if request.method == "POST":
        text = request.form.get("text")
        if "buy now" in text.lower() or "free money" in text.lower():
            result = "🚨 Spam Detected!"
        else:
            result = "✅ Looks clean!"
    return '''
        <h2>Spam Detector</h2>
        <form method="post">
            <textarea name="text" rows="5" cols="40" placeholder="Enter your message here..."></textarea><br>
            <button type="submit">Check</button>
        </form>
        <p>{}</p>
    '''.format(result)

if __name__ == "__main__":
    app.run(debug=True)
