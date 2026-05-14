from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('feedback.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS feedback
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  feedback TEXT NOT NULL,
                  category TEXT NOT NULL,
                  sentiment TEXT)''')
    conn.commit()
    conn.close()

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    feedback = data.get('feedback')
    category = data.get('category')
    conn = sqlite3.connect('feedback.db')
    c = conn.cursor()
    c.execute('INSERT INTO feedback (feedback, category, sentiment) VALUES (?, ?, ?)',
              (feedback, category, 'Positive'))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Feedback submitted successfully'}), 200

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    conn = sqlite3.connect('feedback.db')
    c = conn.cursor()
    c.execute('SELECT * FROM feedback')
    rows = c.fetchall()
    conn.close()
    feedbacks = [{'id': r[0], 'feedback': r[1], 'category': r[2], 'sentiment': r[3]} for r in rows]
    return jsonify(feedbacks)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = sqlite3.connect('feedback.db')
    c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM feedback')
    total = c.fetchone()[0]
    c.execute('SELECT COUNT(*) FROM feedback WHERE sentiment="Positive"')
    positive = c.fetchone()[0]
    c.execute('SELECT COUNT(*) FROM feedback WHERE sentiment="Negative"')
    negative = c.fetchone()[0]
    c.execute('SELECT COUNT(*) FROM feedback WHERE sentiment="Neutral"')
    neutral = c.fetchone()[0]
    conn.close()
    return jsonify({'total': total, 'positive': positive, 'negative': negative, 'neutral': neutral})

init_db()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)