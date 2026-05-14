import React from 'react';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 text-center text-2xl font-bold">
        Trinethra Feedback Analyzer
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <FeedbackForm />
        <Dashboard />
        <FeedbackList />
      </main>
    </div>
  );
}

export default App;