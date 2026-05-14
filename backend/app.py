from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import requests

app = Flask(__name__)
CORS(app)

DB_NAME = "feedback.db"

# ---------------- DATABASE ---------------- #

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee TEXT,
        supervisor TEXT,
        feedback TEXT,
        sentiment TEXT,
        ai_summary TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- AI FUNCTION ---------------- #

def analyze_feedback(feedback_text):

    prompt = f"""
    Analyze this supervisor feedback.

    Feedback:
    {feedback_text}

    Return:
    1. Sentiment (Positive/Negative/Neutral)
    2. Short summary
    """

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()["response"]

    sentiment = "Neutral"

    if "Positive" in result:
        sentiment = "Positive"
    elif "Negative" in result:
        sentiment = "Negative"

    return sentiment, result

# ---------------- ROUTES ---------------- #

@app.route("/submit-feedback", methods=["POST"])
def submit_feedback():

    data = request.json

    employee = data["employee"]
    supervisor = data["supervisor"]
    feedback = data["feedback"]

    sentiment, summary = analyze_feedback(feedback)

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO feedback (
        employee,
        supervisor,
        feedback,
        sentiment,
        ai_summary
    )
    VALUES (?, ?, ?, ?, ?)
    """, (employee, supervisor, feedback, sentiment, summary))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Feedback analyzed successfully",
        "sentiment": sentiment,
        "summary": summary
    })

@app.route("/feedbacks", methods=["GET"])
def get_feedbacks():

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM feedback")

    rows = cursor.fetchall()

    conn.close()

    feedbacks = []

    for row in rows:
        feedbacks.append({
            "id": row[0],
            "employee": row[1],
            "supervisor": row[2],
            "feedback": row[3],
            "sentiment": row[4],
            "summary": row[5]
        })

    return jsonify(feedbacks)

if __name__ == "__main__":
    app.run(debug=True)