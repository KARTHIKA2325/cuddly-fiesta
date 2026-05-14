import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('https://cuddly-fiesta-j4c5.onrender.com/api/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Feedback', value: stats?.total ?? '—' },
    { label: 'Positive', value: stats?.positive ?? '—' },
    { label: 'Negative', value: stats?.negative ?? '—' },
    { label: 'Neutral', value: stats?.neutral ?? '—' },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;