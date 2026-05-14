import React, { useEffect, useState } from 'react';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://cuddly-fiesta-j4c5.onrender.com/api/feedback')
      .then((res) => res.json())
      .then((data) => { setFeedbacks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading feedback...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">All Feedback</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {feedbacks.map((item) => (
            <li key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">{item.sentiment || 'Analyzing...'}</span>
              </div>
              <p className="text-gray-700 text-sm">{item.feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackList;