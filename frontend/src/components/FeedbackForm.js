import React, { useState } from 'react';

function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, category }),
      });
      if (res.ok) {
        setStatus('✅ Feedback submitted successfully!');
        setFeedback('');
      } else {
        setStatus('❌ Submission failed. Try again.');
      }
    } catch {
      setStatus('❌ Could not connect to server.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="general">General</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="ux">UX / Design</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            required
            placeholder="Write your feedback here..."
            className="w-full border rounded-lg p-2 resize-none"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}

export default FeedbackForm;